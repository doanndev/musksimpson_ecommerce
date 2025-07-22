export const MESSAGES = {
  // Validation Errors
  INVALID_EMAIL: 'Invalid email format',
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters long',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  ADDRESS_REQUIRED: 'Address is required',
  INVALID_UUID: 'Invalid UUID format',
  INSUFFICIENT_STOCK: 'Insufficient stock for product',
  INVALID_QUANTITY: 'Invalid quantity',
  INVALID_PRICE: 'Invalid price',
  CATEGORY_NOT_FOUND: 'Category not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  CART_ITEM_NOT_FOUND: 'Cart item not found',
  PAYMENT_FAILED: 'Payment failed',
  PAYMENT_ALREADY_PROCESSED: 'Payment already processed',
  EMAIL_OR_USERNAME_REQUIRED: 'Email or username is required',
  INVALID_RATING: 'Rating must be between 1 and 5',
  USER_NOT_PURCHASED_PRODUCT: 'User has not purchased the product',
  AT_LEAST_ONE_ATTRIBUTE_REQUIRED: 'At least one attribute is required',
  TOKEN_EXPIRED: 'Token has expired',
  NOT_AUTHORIZED: 'Authorization header missing or invalid',
  FULL_NAME_REQUIRED: 'Full name is required',
  PHONE_NUMBER_REQUIRED: 'Phone number is required',
  NOT_FOUND: 'Not found',

  // User Errors
  ACCOUNT_DOES_NOT_EXIST: 'Account does not exist',
  ACCOUNT_ALREADY_EXISTS: 'Account already exists',
  INCORRECT_PASSWORD: 'Incorrect password',
  INVALID_TOKEN: 'Invalid or expired token',
  SESSION_EXPIRED: 'Session has expired',
  FORBIDDEN: 'You are not authorized to perform this action',
  PASSWORD_REQUIRED: 'Password is required',
  MISSING_FIELDS: 'Missing required fields',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',

  // User Success
  USER_CREATED: 'User created successfully',
  USER_RETRIEVED: 'User retrieved successfully',
  USERS_RETRIEVED: 'Users retrieved successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  AVATAR_UPDATED: 'Avatar updated successfully',

  // Address Errors
  ADDRESS_NOT_FOUND: 'Address not found',
  INVALID_ADDRESS_ID: 'Invalid address ID',

  // Address Success
  ADDRESS_CREATED: 'Address created successfully',
  ADDRESSES_RETRIEVED: 'Addresses retrieved successfully',
  ADDRESS_RETRIEVED: 'Address retrieved successfully',
  ADDRESS_UPDATED: 'Address updated successfully',
  ADDRESS_DELETED: 'Address deleted successfully',

  // Product Success
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_RETRIEVED: 'Product retrieved successfully',
  PRODUCTS_RETRIEVED: 'Products retrieved successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',

  // Category Success
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_RETRIEVED: 'Category retrieved successfully',
  CATEGORIES_RETRIEVED: 'Categories retrieved successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',

  // Order Success
  ORDER_CREATED: 'Order created successfully',
  ORDER_RETRIEVED: 'Order retrieved successfully',
  ORDERS_RETRIEVED: 'Orders retrieved successfully',
  ORDER_STATUS_UPDATED: 'Order status updated successfully',
  ORDER_DELETED: 'Order deleted successfully',
  ORDER_ID_REQUIRED: 'OrderId is required',

  // Cart Item Success
  CART_ITEM_ADDED: 'Cart item added successfully',
  CART_ITEM_UPDATED: 'Cart item updated successfully',
  CART_ITEM_DELETED: 'Cart item deleted successfully',
  CART_ITEMS_RETRIEVED: 'Cart items retrieved successfully',

  // Payment Success
  PAYMENT_CREATED: 'Payment created successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  PAYMENT_CANCELLED: 'Payment cancelled successfully',

  // Review Success
  REVIEW_CREATED: 'Review created successfully',
  REVIEW_RETRIEVED: 'Review retrieved successfully',
  REVIEWS_RETRIEVED: 'Reviews retrieved successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  REVIEW_CREATION_FAILED: 'Review creation failed',
  REVIEW_RETRIEVAL_FAILED: 'Review retrieval failed',
  REVIEW_DELETION_FAILED: 'Review deletion failed',

  // AI Success
  AI_RECOMMENDATIONS_GENERATED: 'Recommendations generated successfully',
  AI_ANALYTICS_GENERATED: 'Analytics generated successfully',

  // Auth Success
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  LOGOUT_ALL_SUCCESS: 'Logged out from all devices',
  TOKEN_REFRESHED: 'Token refreshed',
  EMAIL_SENT: 'Email sent successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  TWO_FACTOR_ENABLED: 'Two-factor authentication enabled',
  TWO_FACTOR_VERIFIED: 'Two-factor authentication verified',
  TWO_FACTOR_REQUIRED: 'Two-factor authentication code required',
  TWO_FACTOR_CODE_LENGTH: 'Two-factor code must be 6 characters long',
  NOT_LOGGED_IN: 'You are not logged in',
  NOT_AUTHORIZED_ACTION: 'You are not authorized to perform this action',

  // Shop
  SHOP_NOT_FOUND: 'Shop not found',

  // Permission Success
  PERMISSIONS_RETRIEVED: 'Permissions retrieved successfully',
  PERMISSION_RETRIEVED: 'Permission retrieved successfully',
  PERMISSION_CREATED: 'Permission created successfully',
  PERMISSION_UPDATED: 'Permission updated successfully',
  PERMISSION_DELETED: 'Permission deleted successfully',
  PERMISSION_NOT_FOUND: 'Permission not found',

  // Auth Errors
  TWO_FACTOR_INVALID: 'Invalid two-factor code',

  // Rate Limit
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
};
