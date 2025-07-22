import { env } from '@/lib/env';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  appUrl: env.APP_URL,
  name: 'Musksimpson',
  metaTitle: 'Mua sắm đỉnh cao, trò chuyện thông minh | Musksimpson Thương mại điện tử',
  description:
    'Khám phá sản phẩm chất lượng với trải nghiệm mua sắm mượt mà và hỗ trợ chatbot tích hợp tại Musksimpson Thương mại điện tử.',
  ogImage: `${env.APP_URL}/og-image.png`,
  email: 'lienhe@Musksimpson-ecommerce.com',
};
