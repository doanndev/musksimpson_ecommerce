import type { cart_items, product_images, products } from 'prisma/generated/client';

export interface Cart extends cart_items {
  product: ({
    product_images: product_images[];
  } & products)[];
}
