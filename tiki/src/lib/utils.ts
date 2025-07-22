import { OrderStatusEnum } from '@/api/orders/type';
import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ValidationErrors {
  [key: string]: string;
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function formatPriceToK(number: number) {
  if (number >= 1000) return (number / 1000).toFixed(1) + 'K';

  return number;
}

export function formatPriceToVnd(number: number | string) {
  if (number || number === 0)
    return number.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  return number;
}

export function convertToVietnameseDate(isoDate: string) {
  if (!isoDate || !dayjs(isoDate).isValid()) {
    return 'Ngày không hợp lệ';
  }

  const date = dayjs(isoDate);
  const dayOfWeek = date.format('dddd');
  const day = date.format('DD');
  const month = date.format('MM');

  const daysInVietnamese = {
    Sunday: 'Chủ Nhật',
    Monday: 'Thứ Hai',
    Tuesday: 'Thứ Ba',
    Wednesday: 'Thứ Tư',
    Thursday: 'Thứ Năm',
    Friday: 'Thứ Sáu',
    Saturday: 'Thứ Bảy',
  };

  return `Giao ${daysInVietnamese[dayOfWeek as keyof typeof daysInVietnamese]}, ${day}/${month}`;
}

export function generatePassword() {
  let length = 15,
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export const getStatusColor = (status?: OrderStatusEnum): string => {
  if (!status) return '#BDBDBD'; // Grey 400
  switch (status) {
    case OrderStatusEnum.DELIVERED:
      return '#4CAF50'; // Green 500
    case OrderStatusEnum.CANCELLED:
      return '#F44336'; // Red 500
    case OrderStatusEnum.SHIPPING:
      return '#2196F3'; // Blue 500
    case OrderStatusEnum.PENDING:
      return '#FFB300';
    // case OrderStatusEnum.PROCESSING:
    //   return '#FFD54F';
    default:
      return '#BDBDBD'; // Grey 400
  }
};

export const getStatusLabel = (status?: OrderStatusEnum): string => {
  if (!status) return 'Chờ xác nhận';
  switch (status) {
    case OrderStatusEnum.DELIVERED:
      return 'Đã giao';
    case OrderStatusEnum.CANCELLED:
      return 'Đã huỷ';
    case OrderStatusEnum.SHIPPING:
      return 'Đang giao';
    case OrderStatusEnum.PROCESSING:
      return 'Đang xử lý';
    case OrderStatusEnum.PENDING:
      return 'Chờ xác nhận';
    default:
      return 'Chờ xác nhận';
  }
};

export const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export default function generateProductJson() {
  const DATA_CATEGORIES = JSON.parse(localStorage.getItem('data_categories') || '{}').categories;
  const categoriesId = DATA_CATEGORIES.map((obj: any) => obj.id);
  const array = [];
  const shopNames = [
    'ElectroGadget',
    'TechHaven',
    'GizmoGalaxy',
    'SmartChoice',
    'MegaTech',
    'SuperStore',
    'GeekGoods',
    'TechTreasure',
    'InnovateHub',
    'EpicElectronics',
    'GadgetGenius',
    'DigitalDreams',
    'WonderTech',
    'FuturisticFinds',
    'GizmoHub',
    'NextLevelTech',
    'GadgetSphere',
    'TechOasis',
    'StarTech',
    'DigitalEmporium',
    'TechVoyage',
    'GadgetBoutique',
    'FutureFinds',
    'SmartGizmos',
    'TechWonders',
    'GizmoTreasures',
    'InfiniteInnovations',
    'GadgetGalore',
    'TechHarbor',
    'DreamTech',
    'EcoGizmos',
    'ModernMarvels',
    'SmartSpark',
    'TechVista',
    'GadgetVerse',
    'TheGizmoSpot',
    'InnovativeInsights',
    'TechJunction',
    'QuantumGadgets',
    'TechNest',
    'GizmoRadar',
    'ProTech',
    'PrimeGizmos',
    'GadgetVortex',
    'EurekaTech',
    'TechMatrix',
    'GizmoFusion',
    'SmartSync',
    'TechNova',
    'GadgetSavvy',
  ];
  // const adjectives = [
  //   'Mới',
  //   'Mới nhất',
  //   'Cao cấp',
  //   'Cao cấp',
  //   'Sang trọng',
  //   'Chất lượng cao',
  //   'Bền bỉ',
  //   'Giá cả phải chăng',
  // ];
  const brands = [
    'Apple',
    'Samsung',
    'Sony',
    'LG',
    'Nike',
    'Adidas',
    'Puma',
    'Under Armour',
    'Microsoft',
    'Dell',
    'HP',
    'Lenovo',
    'Acer',
    'Asus',
    'Toshiba',
    'Panasonic',
    'Sharp',
    'Philips',
    'JBL',
    'Bose',
  ];
  const categories = [
    // Danh mục "Thời trang":
    'Áo phông nam/nữ',
    'Quần jeans nam/nữ',
    'Váy dạ hội',
    'Túi xách thời trang',
    'Đồng hồ đeo tay nam/nữ',

    // Danh mục "Điện tử":
    'Laptop gaming',
    'Máy tính đồng bộ',
    'Máy in màu đa chức năng',
    'Máy ảnh DSLR',
    'Điện thoại di động cao cấp',

    // Danh mục "Thiết bị thông minh":
    'Đèn nền phòng thông minh có thể điều chỉnh màu sắc',
    'Khóa cửa vân tay thông minh',
    'Bộ điều nhiệt và làm ấm thông minh cho gia đình',
    'Bộ định tuyến Wi-Fi mạnh mẽ',
    'Camera an ninh ngoài trời',

    // Danh mục "Thể thao và sức khỏe":
    'Đồng hồ đo nhịp tim và bước chạy',
    'Bộ thiết bị tập thể dục tại nhà',
    'Vớ chống trượt khi tập yoga',
    'Máy chạy bộ điện tử tiện lợi',
    'Bình nước thể thao chất liệu an toàn',

    // Danh mục "Gaming":
    'Bàn phím cơ gaming có đèn nền RGB',
    'Chuột gaming chuyên nghiệp',
    'Tai nghe gaming với âm thanh vòm 7.1',
    'Ghế gaming thoải mái',
    'Bàn điều khiển trò chơi không dây',

    // Danh mục "Sức khỏe và làm đẹp":
    'Máy massage cầm tay',
    'Bộ dụng cụ làm móng chuyên nghiệp',
    'Máy rửa mặt tự động',
    'Máy sấy tóc chăm sóc tóc tốt',
    'Máy cạo râu điện tử cao cấp',

    // Danh mục "Đồ gia dụng":
    'Nồi cơm điện tử',
    'Bếp từ đơn',
    'Lò vi sóng đa năng',
    'Máy lọc không khí',
    'Máy pha cà phê tự động',

    // Danh mục "Đồ chơi":
    'Xe đạp địa hình cho trẻ em',
    'Búp bê cao cấp với phụ kiện',
    'Xếp hình thông minh Montessori',
    'Lego kiến trúc phức tạp',
    'Xe điều khiển từ xa',

    // Danh mục "Nhà cửa và nội thất":
    'Bàn làm việc đa năng',
    'Sofa phòng khách thư giãn',
    'Kệ sách treo tường',
    'Bộ chăn ga gối đệm cao cấp',
    'Bộ nồi chảo chống dính không khói',

    // Danh mục "Dụng cụ nghề nghiệp":
    'Máy hàn mini',
    'Kìm mỏ vịt đa năng',
    'Bộ dụng cụ điện cầm tay',
    'Máy khoan đa năng',
    'Dao cắt chất liệu cao cấp',

    // Danh mục "Vui chơi và giải trí":
    'Vé xem phim tại rạp',
    'Vé tham quan triển lãm nghệ thuật',
    'Bộ bài Magic chuyên nghiệp',
    'Bảo trì thẻ thư viện',
    'Vé tham gia công viên giải trí',

    // Danh mục "Sản phẩm thú cưng":
    'Lồng cho chó hoặc mèo',
    'Thức ăn ngon miệng cho chó',
    'Đồ chơi interative cho mèo',
    'Bộ chăm sóc lông thú cưng',
    'Vòng cổ da thời trang cho chó',

    // Danh mục "Sản phẩm làm vườn":
    'Hạt giống rau sạch hữu cơ',
    'Bộ dụng cụ làm vườn',
    'Hệ thống tưới tự động',
    'Ghế nghỉ dưỡng ngoài trời',
    'Bể thủy sinh trang trí phòng khách',
  ];

  for (let i = 0; i < 3000; i++) {
    // const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const productName = `${randomCategory} ${randomBrand}`;
    const priceProduct = Math.floor(Math.random() * 999) * 1000;
    const discountProduct = Math.floor(Math.random() * 100) % 2 === 0 ? 0 : Math.floor(Math.random() * 100);
    const priceDiscount = priceProduct * (1 - discountProduct / 100);
    const shopName = shopNames[Math.floor(Math.random() * shopNames.length)];
    const categoryId = categoriesId[Math.floor(Math.random() * categoriesId.length)];
    const rating = Math.ceil((Math.random() * 5).toFixed(2) as unknown as number);

    array.push({
      id: i + 1,
      category_id: categoryId,
      name_product: `${productName}`,
      image_url: `https://source.unsplash.com/random/750x750?products=${i + 1}`,
      image_list: [
        'https://source.unsplash.com/random/750x750?products=99991',
        'https://source.unsplash.com/random/750x750?products=99992',
        'https://source.unsplash.com/random/750x750?products=99993',
        'https://source.unsplash.com/random/750x750?products=99994',
      ],
      rating: rating,
      sold_product: Math.floor(Math.random() * 3000) >= 1000 ? '1000+' : Math.floor(Math.random() * 3000),
      shop_name: shopName,
      price_product: priceProduct,
      price_discount: parseInt(priceDiscount.toFixed(0)),
      discount_product: discountProduct === 0 ? 0 : discountProduct / 100,
      delivery_day: `Giao thứ ${Math.ceil(Math.random() * 7)}, ngày ${Math.floor(
        Math.random() * 30
      )}/${Math.ceil(Math.random() * 12)}`,
      delivery_price: Math.floor(Math.random() * 25) * 1000,
      limit_product: Math.ceil(Math.random() * 1000),
    });
  }

  localStorage.setItem('data_product', JSON.stringify(array));
}

export function generateCategoriesJson() {
  const categories = {
    outstanding: [
      {
        id: 1,
        name: 'Musksimpson ChatGPT',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/a0/c9/78/cddabc413834de509f40455498c7ff47.png.webp',
      },
      {
        id: 2,
        name: 'Astra Reward',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/cb/64/f7/0ebb0ae297f052e34a8161c9bf8efb96.png.webp',
      },
      {
        id: 3,
        name: 'Musksimpson Exchange',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/44/58/fc/804a2dfd610e9075ad5a8f0d13f2b21a.png.webp',
      },
      {
        id: 4,
        name: 'Musksimpson ChatGPT',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/a0/c9/78/cddabc413834de509f40455498c7ff47.png.webp',
      },
      {
        id: 5,
        name: 'Giá Rẻ Mỗi Ngày',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/ae/72/a3/d4503c3ece932dc8c57d2d5c97cd6ffc.png.webp',
      },
      {
        id: 6,
        name: 'Xả kho',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/3c/ce/96/db8c083610e45b78d8f7662f0013faa8.png.webp',
      },
      {
        id: 7,
        name: 'Mã giảm giá',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/20/68/cf/6d4adbdbcd1c35b0a438a655d9a420d0.png.webp',
      },
      {
        id: 8,
        name: 'Ưu đãi thẻ, ví',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/1e/27/a7/e2c0e40b6dc45a3b5b0a8e59e2536f23.png.webp',
      },
      {
        id: 9,
        name: 'Đóng tiền, nạp thẻ',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/4d/a3/cb/c86b6e4f17138195c026437458029d67.png.webp',
      },
      {
        id: 10,
        name: 'Mua trước trả sau',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/tmp/6f/4e/41/93f72f323d5b42207ab851dfa39d44fb.png.webp',
      },
      {
        id: 11,
        name: 'Bảo hiểm Musksimpson360',
        icon: 'https://salt.tikicdn.com/cache/100x100/ts/upload/6f/d0/68/76b6c01998c3f45f70b843c390097690.png.webp',
      },
    ],
    categories: [
      {
        id: 1,
        name: 'Đồ Chơi - Mẹ &amp; Bé',
        icon: 'https://salt.tikicdn.com/ts/category/13/64/43/226301adcc7660ffcf44a61bb6df99b7.png',
      },
      {
        id: 2,
        name: 'NGON',
        icon: 'https://salt.tikicdn.com/ts/category/1e/8c/08/d8b02f8a0d958c74539316e8cd437cbd.png',
      },
      {
        id: 3,
        name: 'Điện Thoại - Máy Tính Bảng',
        icon: 'https://salt.tikicdn.com/ts/category/54/c0/ff/fe98a4afa2d3e5142dc8096addc4e40b.png',
      },
      {
        id: 4,
        name: 'Làm Đẹp - Sức Khỏe',
        icon: 'https://salt.tikicdn.com/ts/category/73/0e/89/d7ca146de7198a6808580239e381a0c8.png',
      },
      {
        id: 5,
        name: 'Điện Gia Dụng',
        icon: 'https://salt.tikicdn.com/ts/category/61/d4/ea/e6ea3ffc1fcde3b6224d2bb691ea16a2.png',
      },
      {
        id: 6,
        name: 'Thời trang nữ',
        icon: 'https://salt.tikicdn.com/ts/category/55/5b/80/48cbaafe144c25d5065786ecace86d38.png',
      },
      {
        id: 7,
        name: 'Thời trang nam',
        icon: 'https://salt.tikicdn.com/ts/category/00/5d/97/384ca1a678c4ee93a0886a204f47645d.png',
      },
      {
        id: 8,
        name: 'Giày - Dép nữ',
        icon: 'https://salt.tikicdn.com/ts/category/cf/ed/e1/96216aae6dd0e2beeb5e91d301649d28.png',
      },
      {
        id: 9,
        name: 'Túi thời trang nữ',
        icon: 'https://salt.tikicdn.com/ts/category/31/a7/94/6524d2ecbec216816d91b6066452e3f2.png',
      },
      {
        id: 10,
        name: 'Giày - Dép nam',
        icon: 'https://salt.tikicdn.com/ts/category/d6/7f/6c/5d53b60efb9448b6a1609c825c29fa40.png',
      },
      {
        id: 11,
        name: 'Túi thời trang nam',
        icon: 'https://salt.tikicdn.com/ts/category/9b/31/af/669e6a133118e5439d6c175e27c1f963.png',
      },
      {
        id: 12,
        name: 'Balo và Vali',
        icon: 'https://salt.tikicdn.com/ts/category/3e/c0/30/1110651bd36a3e0d9b962cf135c818ee.png',
      },
      {
        id: 13,
        name: 'Phụ kiện thời trang',
        icon: 'https://salt.tikicdn.com/ts/category/ca/53/64/49c6189a0e1c1bf7cb91b01ff6d3fe43.png',
      },
      {
        id: 14,
        name: 'Đồng hồ và Trang sức',
        icon: 'https://salt.tikicdn.com/ts/category/8b/d4/a8/5924758b5c36f3b1c43b6843f52d6dd2.png',
      },
      {
        id: 15,
        name: 'Laptop - Máy Vi Tính - Linh kiện',
        icon: 'https://salt.tikicdn.com/ts/category/92/b5/c0/3ffdb7dbfafd5f8330783e1df20747f6.png',
      },
      {
        id: 16,
        name: 'Nhà Cửa - Đời Sống',
        icon: 'https://salt.tikicdn.com/ts/category/f6/22/46/7e2185d2cf1bca72d5aeac385a865b2b.png',
      },
      {
        id: 17,
        name: 'Cross Border - Hàng Quốc Tế',
        icon: 'https://salt.tikicdn.com/ts/category/3c/e4/99/eeee1801c838468d94af9997ec2bbe42.png',
      },
      {
        id: 18,
        name: 'Bách Hóa Online',
        icon: 'https://salt.tikicdn.com/ts/category/40/0f/9b/62a58fd19f540c70fce804e2a9bb5b2d.png',
      },
      {
        id: 19,
        name: 'Thiết Bị Số - Phụ Kiện Số',
        icon: 'https://salt.tikicdn.com/ts/category/75/34/29/d900f845e51e95a2c41b5b035468f959.png',
      },
      {
        id: 20,
        name: 'Voucher - Dịch vụ',
        icon: 'https://salt.tikicdn.com/ts/category/0a/c9/7b/8e466bdf6d4a5f5e14665ce56e58631d.png',
      },
      {
        id: 21,
        name: 'Ô Tô - Xe Máy - Xe Đạp',
        icon: 'https://salt.tikicdn.com/ts/category/69/f5/36/c6cd9e2849854630ed74ff1678db8f19.png',
      },
      {
        id: 22,
        name: 'Nhà Sách Musksimpson',
        icon: 'https://salt.tikicdn.com/ts/category/ed/20/60/afa9b3b474bf7ad70f10dd6443211d5f.png',
      },
      {
        id: 23,
        name: 'Điện Tử - Điện Lạnh',
        icon: 'https://salt.tikicdn.com/ts/category/c8/82/d4/64c561c4ced585c74b9c292208e4995a.png',
      },
      {
        id: 24,
        name: 'Thể Thao - Dã Ngoại',
        icon: 'https://salt.tikicdn.com/ts/category/0b/5e/3d/00941c9eb338ea62a47d5b1e042843d8.png',
      },
      {
        id: 25,
        name: 'Máy Ảnh - Máy Quay Phim',
        icon: 'https://salt.tikicdn.com/ts/category/2d/7c/45/e4976f3fa4061ab310c11d2a1b759e5b.png',
      },
      {
        id: 26,
        name: 'Sản phẩm Tài chính - Bảo hiểm',
        icon: 'https://salt.tikicdn.com/ts/category/a0/49/f4/a75f6e5dc021b0005fb8923b9846abc2.jpg',
      },
    ],
  };
  localStorage.setItem('data_categories', JSON.stringify(categories));
}

export function onMutateError(error: any) {
  return toast.error(error?.message || error?.meta?.message || error?.statusText);
}
