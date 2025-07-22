import { base, en, fakerVI, vi } from "@faker-js/faker";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toSlug } from "~/libs/utils";
import {
  fetchDistricts,
  fetchProvinces,
  fetchWards,
} from "~/libs/utils/ghnApi";
import { hashPassword } from "~/libs/utils/hashPassword.util";
import {
  OrderStatusEnum,
  PermissionEnum,
  PrismaClient,
  RoleEnum,
} from "./generated/client";

const prisma = new PrismaClient();

async function createShopAndAddress(userId: number) {
  try {
    // Fetch provinces from GHN
    const provinces = await fetchProvinces();
    if (provinces.length === 0) {
      console.warn(`No provinces fetched from GHN API, skipping shop creation for user ${userId}`);
      return null; // Skip shop creation
    }
    const province: any = fakerVI.helpers.arrayElement(provinces);
    const provinceId = province.ProvinceID;
    const regionId = province.RegionID;

    if (!provinceId) {
      console.warn(`No valid province ID found for province ${province.ProvinceName}, skipping shop creation for user ${userId}`);
      return null; // Skip shop creation
    }

    const provinceName = province.ProvinceName;

    const districts = await fetchDistricts(provinceId);
    if (districts.length === 0) {
      console.warn(`No districts found for province ${provinceId} (${provinceName}), skipping shop creation for user ${userId}`);
      return null; // Skip shop creation
    }
    const district: any = fakerVI.helpers.arrayElement(districts);

    if (!district) {
      console.warn(`No valid district found for province ${provinceId} (${provinceName}), skipping shop creation for user ${userId}`);
      return null; // Skip shop creation
    }

    const districtId = district.DistrictID;
    const districtName = district.DistrictName;

    const wards = await fetchWards(districtId);
    if (!wards || !Array.isArray(wards) || wards.length === 0) {
      console.warn(`No valid wards found for district ${districtId} (${districtName}, ${provinceName}), skipping shop creation for user ${userId}`);
      return null; // Skip shop creation
    }
    const ward: any = fakerVI.helpers.arrayElement(wards);
    const wardCode = ward ? ward.WardCode : fakerVI.location.city();
    const wardName = ward ? ward.WardName : fakerVI.location.city();

    const phone =
      "+84 9" +
      fakerVI.string.numeric(2) +
      " " +
      fakerVI.string.numeric(3) +
      " " +
      fakerVI.string.numeric(3);
    const fullName = fakerVI.person.fullName();

    // Use a transaction to ensure address and shop are created atomically
    const [address, shop] = await prisma.$transaction(async (tx) => {
      // Create address for the shop
      const address = await tx.addresses.create({
        data: {
          user_id: userId,
          full_name: fullName,
          phone_number: phone,
          address: fakerVI.location.streetAddress(),
          province_id: provinceId,
          province_name: provinceName,
          district_id: districtId,
          district_name: districtName,
          ward_code: wardCode,
          ward_name: wardName,
          type_address: "WORK",
          region_id: regionId,
          is_default: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Verify address was created
      if (!address || !address.id) {
        throw new Error(`Failed to create address for user ${userId}`);
      }

      console.log(
        `Created address for user ${userId}: ID ${address.id}, ${address.full_name}, ${provinceName}, ${districtName}, ${wardName}`
      );

      // Generate shop name using a last name and a retail suffix
      const lastName = fakerVI.person.lastName();
      const suffixes = ["Store", "Shop", "Market", "Mart"];
      let shopName = `${lastName} ${fakerVI.helpers.arrayElement(suffixes)}`;
      let slug = toSlug(shopName);
      let attempt = 1;
      const maxAttempts = 5;

      while (attempt <= maxAttempts) {
        const existingShop = await tx.shops.findUnique({
          where: { slug },
        });

        if (!existingShop) {
          break; // Slug is unique, proceed with shop creation
        }

        // Append a random number to the shop name to make the slug unique
        shopName = `${lastName} ${fakerVI.helpers.arrayElement(suffixes)} ${fakerVI.string.numeric(4)}`;
        slug = toSlug(shopName);
        attempt++;

        if (attempt > maxAttempts) {
          throw new Error(`Failed to generate a unique slug for shop after ${maxAttempts} attempts for user ${userId}`);
        }
        console.log(`Found existing slug '${slug}', retrying with new slug for user ${userId}`);
      }

      // Create shop for the user
      const shop = await tx.shops.create({
        data: {
          uuid: uuidv4(),
          seller_id: userId,
          name: shopName,
          slug,
          description: fakerVI.lorem.paragraph(),
          logo: fakerVI.image.url({ width: 200, height: 200 }),
          address_id: address.id,
          rating: 0,
          is_active: true,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return [address, shop];
    });

    console.log(
      `Created shop for user ${userId}: ${shop.name} with address ID ${address.id} in ${provinceName}, ${districtName}, ${wardName}`
    );
    return shop;
  } catch (error) {
    console.error(`Error creating shop and address for user ${userId}:`, error);
    return null; // Return null to allow seeding to continue
  }
}

async function syncCategories() {
  try {
    const response = await axios.get("https://api-tiki.vercel.app/categories");
    const categories = response.data;

    // Create a map to track processed categories
    const processedCategories = new Set<number>();
    const categoryMap = new Map();

    // Create a map for easy lookup
    categories.forEach((cat: any) => {
      categoryMap.set(parseInt(cat.id), cat);
    });

    // Recursive function to process categories in the correct order
    async function processCategory(categoryId: number): Promise<void> {
      if (processedCategories.has(categoryId)) {
        return; // Already processed
      }

      const category = categoryMap.get(categoryId);
      if (!category) {
        console.warn(
          `Category with ID ${categoryId} not found in API response`
        );
        return;
      }

      // If this category has a parent, process the parent first
      if (category.parent_id) {
        const parentId = parseInt(category.parent_id);
        if (!processedCategories.has(parentId)) {
          await processCategory(parentId);
        }
      }

      // Now process this category
      await createOrUpdateCategory(category);
      processedCategories.add(categoryId);
    }

    // Process all categories
    for (const category of categories) {
      await processCategory(parseInt(category.id));
    }

    console.log("✅ Categories synchronized successfully");
  } catch (error) {
    console.error("Error syncing categories:", error);
    throw error;
  }
}

async function createOrUpdateCategory(category: any) {
  try {
    const categoryId = parseInt(category.id);

    // Check if category exists by ID first
    const existingCategoryById = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategoryById) {
      // Check if a category with the same name already exists
      const existingCategoryByName = await prisma.categories.findUnique({
        where: { name: category.name },
      });

      if (existingCategoryByName) {
        // Skip this category if name already exists
        console.log(
          `⚠️  Skipping category "${category.name}" (ID: ${categoryId}) - name already exists with ID: ${existingCategoryByName.id}`
        );
        return;
      }

      // Create normally if no conflicts
      await prisma.categories.create({
        data: {
          id: categoryId,
          uuid: uuidv4(),
          name: category.name,
          slug: toSlug(category.name),
          icon: category.icon || null,
          parent_id: category.parent_id ? parseInt(category.parent_id) : null,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      console.log(`✅ Added category: ${category.name}`);
    } else {
      // Update existing category (be careful about name conflicts here too)
      const existingCategoryByName = await prisma.categories.findUnique({
        where: { name: category.name },
      });

      // Only update if no name conflict OR the name conflict is with the same record
      if (!existingCategoryByName || existingCategoryByName.id === categoryId) {
        await prisma.categories.update({
          where: { id: categoryId },
          data: {
            name: category.name,
            icon: category.icon || null,
            parent_id: category.parent_id ? parseInt(category.parent_id) : null,
            updated_at: new Date(),
          },
        });
        console.log(`✅ Updated category: ${category.name}`);
      } else {
        console.log(
          `⚠️  Skipping update for category "${category.name}" (ID: ${categoryId}) - name conflict with ID: ${existingCategoryByName.id}`
        );
      }
    }
  } catch (error: any) {
    console.error(
      `❌ Error creating/updating category ${category.name} (ID: ${category.id}):`,
      error.message
    );
    // Continue with other categories instead of stopping the entire process
  }
}

async function syncProducts() {
  try {
    const shops = await prisma.shops.findMany({ select: { id: true } });
    if (shops.length === 0) {
      throw new Error("No shops found for product assignment");
    }
    const response = await axios.get("https://api-tiki.vercel.app/products");
    const products = response.data;

    for (const product of products) {
      if (
        product.productName
          ?.toLowerCase()
          ?.startsWith("Phiếu Quà T".toLowerCase())
      ) {
        console.log(`Skipped product: ${product.productName}`);
        continue;
      }

      const shopId = fakerVI.helpers.arrayElement(shops).id; // Randomly select a shop
      const existingProduct = await prisma.products.findUnique({
        where: { id: product.id },
      });

      let categoryId = product.categoryId ? parseInt(product.categoryId) : null;
      if (categoryId && categoryId !== 0) {
        const category = await prisma.categories.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          console.log(
            `Category ${product.categoryId} not found for product ${product.productName}`
          );
          continue;
        }
      } else {
        categoryId = null;
      }

      const randomWeight = fakerVI.number.float({ min: 0.1, max: 5, fractionDigits: 2 });

      let productRecord;
      if (!existingProduct) {
        productRecord = await prisma.products.create({
          data: {
            id: product.id,
            uuid: uuidv4(),
            name: product.productName,
            slug: product.urlPath,
            description: product.description || null,
            new_price: product.priceNew,
            old_price: product.priceOdd,
            discount_percentage: product.discountProduct,
            stock: product.limitProduct || 0,
            category_id: categoryId,
            shop_id: shopId, // Use random shop ID
            weight: randomWeight,
            is_deleted: false,
            created_at: new Date(product.createdAt),
            updated_at: new Date(product.updatedAt),
          },
        });
        console.log(`Added product: ${product.productName} to shop ${shopId}`);
      } else {
        productRecord = await prisma.products.update({
          where: { id: product.id },
          data: {
            name: product.productName,
            slug: product.urlPath,
            description: product.description || null,
            new_price: product.priceNew,
            old_price: product.priceOdd,
            discount_percentage: product.discountProduct,
            stock: product.limitProduct || 0,
            category_id: categoryId,
            shop_id: shopId, // Update shop_id
            weight: randomWeight,
            updated_at: new Date(product.updatedAt),
          },
        });
        console.log(
          `Updated product: ${product.productName} to shop ${shopId}`
        );
      }

        if (product.imageList && product.imageList.length > 0) {
        if (existingProduct) {
          await prisma.product_images.deleteMany({
            where: { product_id: productRecord.id },
          });
        }
        for (let i = 0; i < product.imageList.length; i++) {
          await prisma.product_images.create({
            data: {
              product_id: productRecord.id,
              url: product.imageList[i],
              is_primary: i === 0,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }
      }

      if (product.specifications && product.specifications.length > 0) {
        if (existingProduct) {
          await prisma.product_attributes.deleteMany({
            where: { product_id: productRecord.id },
          });
          await prisma.product_specifications.deleteMany({
            where: { product_id: productRecord.id },
          });
        }

        for (const spec of product.specifications) {
          const specification = await prisma.product_specifications.create({
            data: {
              product_id: productRecord.id,
              key: spec.name,
              value: '',
              created_at: new Date(),
              updated_at: new Date(),
            },
          });

          if (spec.attributes && spec.attributes.length > 0) {
            for (const attr of spec.attributes) {
              await prisma.product_attributes.create({
                data: {
                  product_id: productRecord.id,
                  specification_id: specification.id,
                  name: attr.name,
                  value: attr.value,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
            }
          }
        }
      }

      if (product.breadcrumbs && product.breadcrumbs.length > 0) {
        if (existingProduct) {
          await prisma.category_breadcrumbs.deleteMany({
            where: {
              category_id: {
                in: product.breadcrumbs
                  .filter((b: any) => b.category_id !== 0)
                  .map((b: any) => b.category_id),
              },
            },
          });
        }

        for (let i = 0; i < product.breadcrumbs.length; i++) {
          const breadcrumb = product.breadcrumbs[i];
          let breadcrumbCategoryId = breadcrumb.category_id;
          if (breadcrumb.category_id === 0) {
            breadcrumbCategoryId = categoryId;
          }

          if (breadcrumbCategoryId) {
            const category = await prisma.categories.findUnique({
              where: { id: breadcrumbCategoryId },
            });
            if (category) {
              await prisma.category_breadcrumbs.create({
                data: {
                  category_id: breadcrumbCategoryId,
                  name: breadcrumb.name,
                  path: breadcrumb.url,
                  level: i + 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error syncing products:", error);
  }
}

async function seedAddresses() {
  try {
    // Instead of clearing all addresses, we will only clear non-shop-related addresses (optional)
    // If you want to avoid deleting any addresses, you can skip this step entirely
    const shopAddresses = await prisma.shops.findMany({
      select: { address_id: true },
    });
    const shopAddressIds = shopAddresses.map((shop) => shop.address_id);

    // Optionally delete only non-shop-related addresses
    await prisma.addresses.deleteMany({
      where: {
        id: {
          notIn: shopAddressIds as number[], // Preserve addresses linked to shops
        },
      },
    });
    console.log("Cleared non-shop-related addresses");

    // Fetch users who are not admins
    const users = await prisma.users.findMany({
      where: { role_id: { not: 1 } }, // Exclude admin
      take: 100,
    });

    const provinces = await fetchProvinces();
    if (provinces.length === 0) {
      throw new Error("No provinces fetched from GHN API");
    }

    for (const user of users) {
      // Check if user already has addresses
      const existingAddresses = await prisma.addresses.findMany({
        where: { user_id: user.id },
      });

      // Determine how many addresses to create (e.g., 1-2 additional addresses)
      const addressCount = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < addressCount; i++) {
        const province: any = fakerVI.helpers.arrayElement(provinces);
        const provinceId = province.ProvinceID;

        if (!provinceId) {
          console.warn(
            `No valid province ID found, skipping address for user ${user.id}`
          );
          continue;
        }

        const provinceName = province.ProvinceName;

        const districts = await fetchDistricts(provinceId);
        if (districts.length === 0) {
          console.log(
            `No districts found for province ${provinceId}, skipping address for user ${user.id}`
          );
          continue;
        }
        const district: any = fakerVI.helpers.arrayElement(districts);
        const districtId = district.DistrictID;
        const districtName = district.DistrictName;
        const regionId = province.RegionID;


        const wards = await fetchWards(districtId);
        if (!wards || !Array.isArray(wards)) {
          console.warn(
            `No valid wards found for district ${districtId}, skipping address for user ${user.id}`
          );
          continue;
        }
        const ward: any =
          wards.length > 0 ? fakerVI.helpers.arrayElement(wards) : null;
        const wardCode = ward ? ward.WardCode : fakerVI.location.city();
        const wardName = ward ? ward.WardName : fakerVI.location.city();

        const phone =
          "+84 9" +
          fakerVI.string.numeric(2) +
          " " +
          fakerVI.string.numeric(3) +
          " " +
          fakerVI.string.numeric(3);
        const fullName = fakerVI.person.fullName();

        // Check if this is the first address for the user
        const isDefault = existingAddresses.length === 0 && i === 0;

        await prisma.addresses.create({
          data: {
            user_id: user.id,
            full_name: fullName,
            phone_number: phone,
            address: fakerVI.location.streetAddress(),
            ward_code: wardCode,
            ward_name: wardName,
            district_id: districtId,
            district_name: districtName,
            province_id: provinceId,
            province_name: provinceName,
            region_id: regionId,
            type_address: fakerVI.helpers.arrayElement(["HOME", "WORK"]),
            is_default: isDefault,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        console.log(
          `Created address for user ${user.id}: ${fullName}, ${phone}, ` +
            `Province: ${province.ProvinceName}, District: ${district.DistrictName}` +
            (ward ? `, Ward: ${ward.WardName}` : "") + `region_id: ${regionId}`
            
        );
      }
    }
    console.log("Successfully seeded addresses");
  } catch (error) {
    console.error("Error seeding addresses:", error);
    throw error;
  }
}

async function seedFakeUsers(count: number = 20) {
  try {
    // Fetch USER and SELLER roles
    const userRole = await prisma.roles.findUnique({
      where: { name: RoleEnum.USER },
    });
    const sellerRole = await prisma.roles.findUnique({
      where: { name: RoleEnum.SELLER },
    });

    if (!userRole || !sellerRole) {
      throw new Error("USER or SELLER role not found");
    }

    const users: any[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = fakerVI.person.firstName();
      const lastName = fakerVI.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = fakerVI.internet.email({ firstName, lastName });
      const username = fakerVI.internet.username({ firstName, lastName });
      const phone =
        "+84 9" +
        fakerVI.string.numeric(2) +
        " " +
        fakerVI.string.numeric(3) +
        " " +
        fakerVI.string.numeric(3);
      const avatar = fakerVI.image.avatar();
      const gender = fakerVI.datatype.boolean();
      const dayOfBirth = fakerVI.date
        .birthdate({ mode: "age", min: 18, max: 40 })
        .toISOString()
        .split("T")[0];

      // Randomly assign USER or SELLER role
      const role = fakerVI.helpers.arrayElement([userRole, sellerRole]);

      const newUser = await prisma.users.create({
        data: {
          uuid: uuidv4(),
          username,
          email,
          full_name: fullName,
          password: hashPassword("123456"),
          phone_number: phone,
          avatar,
          gender,
          day_of_birth: dayOfBirth,
          role_id: role.id,
          provider: "email",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      console.log(`Created user: ${newUser.username} with role ${role.name}`);

      if (role.name === RoleEnum.SELLER) {
        await createShopAndAddress(newUser.id);
      }
    }
    console.log(`✅ Seeded ${count} fake users (${count} sellers with shops).`);
  } catch (error) {
    console.error("Error seeding fake users:", error);
    throw error;
  }
}

async function seedOrders() {
  try {
    // Clear existing orders and order items
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    console.log("Cleared existing orders");

    // Fetch users who are activated
    const users = await prisma.users.findMany({
      where: { is_activated: true },
      take: 100,
    });

    // Fetch non-deleted products
    const products = await prisma.products.findMany({
      where: { is_deleted: false },
      take: 100,
    });

    // Check if products exist
    if (products.length === 0) {
      console.warn(
        "No products found in the database, skipping order creation"
      );
      return;
    }

    let ordersCreated = 0;

    for (const user of users) {
      // Fetch one address per user
      const addresses = await prisma.addresses.findMany({
        where: { user_id: user.id },
        take: 1,
      });

      // Skip users without addresses
      if (addresses.length === 0) {
        console.warn(
          `No addresses found for user ${user.id}, skipping order creation`
        );
        continue;
      }
      const address = addresses[0];

      // Create an order
      const order = await prisma.orders.create({
        data: {
          uuid: uuidv4(),
          user_id: user.id,
          address_id: address.id,
          total_amount: 0,
          status: fakerVI.helpers.arrayElement([
            "PENDING",
            "PROCESSING",
            "SHIPPING",
            "DELIVERED",
            "CANCELLED",
          ]) as OrderStatusEnum,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Randomly select number of items (1 to 5)
      const itemCount = Math.floor(Math.random() * 5) + 1;
      let total = 0;

      for (let i = 0; i < itemCount; i++) {
        // Randomly select a product
        const product = fakerVI.helpers.arrayElement(products);
        // Random quantity between 1 and 5
        const quantity = Math.floor(Math.random() * 5) + 1;
        const unit_price = product.new_price || 100; // Fallback price if new_price is null

        await prisma.order_items.create({
          data: {
            order_id: order.id,
            product_id: product.id,
            quantity,
            unit_price,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        total += unit_price * quantity;
      }

      // Update order with total amount
      await prisma.orders.update({
        where: { id: order.id },
        data: { total_amount: total, updated_at: new Date() },
      });

      console.log(
        `✅ Created order ${order.uuid} for user ${user.id} with ${itemCount} items and total ${total}`
      );
      ordersCreated++;
    }

    // Verify order creation
    const orderCount = await prisma.orders.count();
    const usersWithOrders = await prisma.users.findMany({
      where: { orders: { some: {} } },
      select: { id: true },
    });
    console.log(`Total orders created: ${orderCount}`);
    console.log(`Users with orders: ${usersWithOrders.length}`);
    console.log(`Successfully seeded ${ordersCreated} orders`);
  } catch (error) {
    console.error("Error seeding orders:", error);
    throw error;
  }
}

async function main() {
  try {
    // // Clear table
    await prisma.order_items.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.product_images.deleteMany();
    await prisma.product_attributes.deleteMany();
    await prisma.product_specifications.deleteMany();
    await prisma.category_breadcrumbs.deleteMany();
    await prisma.products.deleteMany();
    await prisma.shops.deleteMany();
    await prisma.users.deleteMany();
    await prisma.addresses.deleteMany();
    console.log("Cleared existing data");

    // Seed roles
    const roles = [
      { name: RoleEnum.ADMIN, id: 1 },
      { name: RoleEnum.USER, id: 2 },
      { name: RoleEnum.SELLER, id: 3 },
    ];

    for (const role of roles) {
      await prisma.roles.upsert({
        where: { name: role.name },
        update: {},
        create: {
          id: role.id,
          name: role.name,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    // Seed permissions
    const permissions = Object.values(PermissionEnum);
    for (const perm of permissions) {
      await prisma.permissions.upsert({
        where: { name: perm },
        update: {},
        create: { name: perm, created_at: new Date(), updated_at: new Date() },
      });
    }

    // Seed role_permissions
    const rolePermissions = {
      [RoleEnum.ADMIN]: [
        PermissionEnum.VIEW_USERS,
        PermissionEnum.EDIT_USERS,
        PermissionEnum.VIEW_PRODUCTS,
        PermissionEnum.MANAGE_PRODUCTS,
        PermissionEnum.MANAGE_CATEGORIES,
        PermissionEnum.MANAGE_ADDRESSES,
        PermissionEnum.CREATE_REVIEW,
        PermissionEnum.DELETE_REVIEW,
        PermissionEnum.MANAGE_ORDERS,
        PermissionEnum.MANAGE_PERMISSIONS,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.CREATE_SHOP,
        PermissionEnum.EDIT_SHOP,
        PermissionEnum.DELETE_SHOP,
        PermissionEnum.VIEW_SHOP,
        PermissionEnum.MANAGE_SHOPS,
      ],
      [RoleEnum.USER]: [
        PermissionEnum.VIEW_USERS,
        PermissionEnum.VIEW_PRODUCTS,
        PermissionEnum.EDIT_USERS,
        PermissionEnum.MANAGE_ADDRESSES,
        PermissionEnum.CREATE_REVIEW,
        PermissionEnum.MANAGE_ORDERS,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.VIEW_SHOP,
      ],
      [RoleEnum.SELLER]: [
        PermissionEnum.VIEW_USERS,
        PermissionEnum.VIEW_PRODUCTS,
        PermissionEnum.EDIT_USERS,
        PermissionEnum.MANAGE_PRODUCTS,
        PermissionEnum.MANAGE_ADDRESSES,
        PermissionEnum.CREATE_REVIEW,
        PermissionEnum.MANAGE_ORDERS,
        PermissionEnum.VIEW_ORDERS,
        PermissionEnum.CREATE_SHOP,
        PermissionEnum.EDIT_SHOP,
        PermissionEnum.DELETE_SHOP,
        PermissionEnum.VIEW_SHOP,
        PermissionEnum.MANAGE_HIDDEN_USERS,
      ],
    };

    for (const [roleName, perms] of Object.entries(rolePermissions)) {
      const role = await prisma.roles.findUnique({
        where: { name: roleName as RoleEnum },
      });
      if (!role) continue;

      for (const permName of perms) {
        const permission = await prisma.permissions.findUnique({
          where: { name: permName },
        });
        if (!permission) continue;

        await prisma.role_permissions.upsert({
          where: {
            role_id_permission_id: {
              role_id: role.id,
              permission_id: permission.id,
            },
          },
          update: {},
          create: {
            role_id: role.id,
            permission_id: permission.id,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }
    }

    // Seed admin user
    const admin = await prisma.users.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        uuid: uuidv4(),
        username: "admin",
        email: "admin@admin.com",
        full_name: "Admin User",
        password: hashPassword("123321"),
        provider: "email",
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Tạo shop và address cho admin
    await createShopAndAddress(admin.id);

    // Seed dữ liệu khác
    await seedFakeUsers(20);
    await seedAddresses();
    await syncCategories();
    await syncProducts();
    await seedOrders();

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
