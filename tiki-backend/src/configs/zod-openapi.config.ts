import { z } from 'zod';
import { createDocument } from 'zod-openapi';
import {
  UserResponseDataSchema,
  UserCreateInputSchema,
  UserUpdateInputSchema,
  UserFilterSchema,
  UserIdParamSchema,
  ResetPasswordTokenParamSchema,
} from '../libs/schemas/user.schema';
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  TwoFactorRequestSchema,
  LoginResponseSchema,
} from '../libs/schemas/auth.schema';
import {
  ErrorResponseSchema,
  IdParamSchema,
  SuccessResponseSchema,
  UuidParamSchema,
} from '../libs/schemas/common.shema';
import {
  ProductCreateInputSchema,
  ProductFilterSchema,
  ProductIdParamSchema,
  ProductResponseSchema,
  ProductUpdateInputSchema,
} from '~/libs/schemas/product.schema';
import {
  AddressCreateInputSchema,
  AddressResponseSchema,
  AddressUpdateInputSchema,
} from '~/libs/schemas/address.schema';
import {
  CartItemCreateInputSchema,
  CartItemResponseSchema,
  CartItemUpdateInputSchema,
} from '~/libs/schemas/cart-item.schema';
import {
  CategoryBreadcrumbSchema,
  CategoryCreateInputSchema,
  CategoryResponseSchema,
  CategoryUpdateInputSchema,
} from '~/libs/schemas/category.schema';
import {
  OrderCreateInputSchema,
  OrderItemSchema,
  OrderResponseSchema,
  OrderStatusUpdateSchema,
} from '~/libs/schemas/order.schema';
import { PaymentCreateInputSchema, PaymentResponseSchema } from '~/libs/schemas/payment.schema';
import { PermissionResponseDataSchema } from '~/libs/schemas/permission.schema';
import { ReviewCreateInputSchema, ReviewFilterSchema, ReviewResponseSchema } from '~/libs/schemas/review.schema';

const openApiSpec = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Vona API',
    version: '1.0.0',
    description: 'API documentation for Vona application',
  },
  servers: [
    {
      url: 'http://localhost:3003/api/v1',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      UserResponse: UserResponseDataSchema,
      UserCreateInput: UserCreateInputSchema,
      UserUpdateInput: UserUpdateInputSchema,
      UserFilter: UserFilterSchema,
      LoginRequest: LoginRequestSchema,
      RegisterRequest: RegisterRequestSchema,
      ForgotPasswordRequest: ForgotPasswordRequestSchema,
      ResetPasswordRequest: ResetPasswordRequestSchema,
      TwoFactorRequest: TwoFactorRequestSchema,
      LoginResponse: LoginResponseSchema,
      ErrorResponse: ErrorResponseSchema,
      SuccessResponse: SuccessResponseSchema,
      UserIdParam: UserIdParamSchema,
      ResetPasswordTokenParam: ResetPasswordTokenParamSchema,
      ProductResponse: ProductResponseSchema,
      ProductCreateInput: ProductCreateInputSchema,
      ProductUpdateInput: ProductUpdateInputSchema,
      ProductFilter: ProductFilterSchema,
      ProductIdParam: ProductIdParamSchema,
      AddressCreateInput: AddressCreateInputSchema,
      AddressUpdateInput: AddressUpdateInputSchema,
      AddressResponse: AddressResponseSchema,
      CartItemCreateInput: CartItemCreateInputSchema,
      CartItemUpdateInput: CartItemUpdateInputSchema,
      CartItemResponse: CartItemResponseSchema,
      CategoryCreateInput: CategoryCreateInputSchema,
      CategoryUpdateInput: CategoryUpdateInputSchema,
      CategoryResponse: CategoryResponseSchema,
      CategoryBreadcrumb: CategoryBreadcrumbSchema,
      OrderCreateInput: OrderCreateInputSchema,
      OrderStatusUpdate: OrderStatusUpdateSchema,
      OrderResponse: OrderResponseSchema,
      OrderItem: OrderItemSchema,
      PaymentCreateInput: PaymentCreateInputSchema,
      PaymentResponse: PaymentResponseSchema,
      PermissionResponse: PermissionResponseDataSchema,
      ReviewCreateInput: ReviewCreateInputSchema,
      ReviewResponse: ReviewResponseSchema,
      ReviewFilter: ReviewFilterSchema,
      IdParam: IdParamSchema,
      UuidParam: UuidParamSchema,
    },
  },
  tags: [
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Auth', description: 'Authentication and authorization endpoints' },
    { name: 'Products', description: 'Product management endpoints' },
    { name: 'Addresses', description: 'User address management endpoints' },
    { name: 'RateLimit', description: 'Rate limiting information endpoints' },
    { name: 'Permissions', description: 'Permission management endpoints' },
    { name: 'Orders', description: 'Order management endpoints' },
    { name: 'Categories', description: 'Category management endpoints' },
    { name: 'CartItems', description: 'Cart item management endpoints' },
    { name: 'Chatbot', description: 'Chatbot interaction endpoints' },
    { name: 'Payments', description: 'Payment processing endpoints' },
    { name: 'Reviews', description: 'Product review management endpoints' },
  ],
  paths: {
    // User Routes
    '/users': {
      get: {
        summary: 'Get list of users',
        description: 'Retrieve a paginated list of users with optional filters (requires user login)',
        operationId: 'getAllUsers',
        tags: ['Users'],
        parameters: [
          {
            name: 'filter',
            in: 'query',
            description: 'Filter parameters',
            schema: {
              $ref: '#/components/schemas/UserFilter',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new user',
        description: 'Create a new user with provided data',
        operationId: 'createUser',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/users/user': {
      get: {
        summary: 'Get current user',
        description: 'Retrieve the details of the currently authenticated user',
        operationId: 'getUserByOne',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'Current user details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/users/{userId}': {
      get: {
        summary: 'Get user by ID',
        description: 'Retrieve a user by their UUID (requires admin login)',
        operationId: 'getUserById',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'UUID of the user',
            schema: {
              $ref: '#/components/schemas/UserIdParam',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update a user',
        description: 'Update user details by UUID (requires user login)',
        operationId: 'updateUser',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'UUID of the user',
            schema: {
              $ref: '#/components/schemas/UserIdParam',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserUpdateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete a user',
        description: 'Delete a user by UUID (requires user login)',
        operationId: 'deleteUser',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'UUID of the user',
            schema: {
              $ref: '#/components/schemas/UserIdParam',
            },
          },
        ],
        responses: {
          '204': {
            description: 'User deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/users/upload-avatar/{userId}': {
      post: {
        summary: 'Upload user avatar',
        description: 'Upload an avatar image for a user by UUID (requires user login)',
        operationId: 'uploadAvatar',
        tags: ['Users'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'UUID of the user',
            schema: {
              $ref: '#/components/schemas/UserIdParam',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Avatar image file',
                  },
                },
                required: ['avatar'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Avatar uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid file or input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Auth Routes
    '/auth/login': {
      post: {
        summary: 'User login',
        description: 'Authenticate user and return JWT token or 2FA requirement',
        operationId: 'login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful or 2FA required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'User registration',
        description: 'Register a new user',
        operationId: 'register',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'User logout',
        description: 'Log out the current user (invalidates JWT token)',
        operationId: 'logout',
        tags: ['Auth'],
        responses: {
          '204': {
            description: 'Logout successful',
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/auth/logout-all': {
      post: {
        summary: 'Logout from all devices',
        description: 'Log out the user from all devices (invalidates all tokens)',
        operationId: 'logoutAllDevices',
        tags: ['Auth'],
        responses: {
          '204': {
            description: 'Logout from all devices successful',
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/auth/refresh-token': {
      post: {
        summary: 'Refresh JWT token',
        description: 'Generate a new JWT token using a valid refresh token',
        operationId: 'refreshToken',
        tags: ['Auth'],
        responses: {
          '200': {
            description: 'New JWT token generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', description: 'New JWT token' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/auth/forgot-password': {
      post: {
        summary: 'Request password reset',
        description: 'Send a password reset link to the user’s email',
        operationId: 'forgotPassword',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForgotPasswordRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset link sent',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/reset-password/{userId}/{token}': {
      post: {
        summary: 'Reset password',
        description: 'Reset user password using a reset token',
        operationId: 'resetPassword',
        tags: ['Auth'],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            description: 'UUID of the user',
            schema: {
              $ref: '#/components/schemas/UserIdParam',
            },
          },
          {
            name: 'token',
            in: 'path',
            required: true,
            description: 'Password reset token',
            schema: {
              $ref: '#/components/schemas/ResetPasswordTokenParam',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResetPasswordRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input or token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/enable-2fa': {
      post: {
        summary: 'Enable two-factor authentication',
        description: 'Enable 2FA for the authenticated user',
        operationId: 'enableTwoFactor',
        tags: ['Auth'],
        responses: {
          '200': {
            description: '2FA enabled successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/auth/verify-2fa': {
      post: {
        summary: 'Verify two-factor authentication',
        description: 'Verify 2FA code to complete login',
        operationId: 'verifyTwoFactor',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TwoFactorRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: '2FA verification successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid 2FA code',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        summary: 'Get list of products',
        description: 'Retrieve a paginated list of products with optional filters',
        operationId: 'getAllProducts',
        tags: ['Products'],
        parameters: [
          {
            name: 'filter',
            in: 'query',
            description: 'Filter parameters for products',
            schema: {
              $ref: '#/components/schemas/ProductFilter',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new product',
        description: 'Create a new product with provided data (requires admin login)',
        operationId: 'createProduct',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/products/{uuid}': {
      get: {
        summary: 'Get a product by UUID',
        description: 'Retrieve a product by its UUID',
        operationId: 'getProductById',
        tags: ['Products'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            description: 'UUID of the product',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Product details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid UUID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update a product',
        description: 'Update a product by its UUID (requires admin login)',
        operationId: 'updateProduct',
        tags: ['Products'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            description: 'UUID of the product',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductUpdateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input or UUID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete a product',
        description: 'Delete a product by its UUID (requires admin login)',
        operationId: 'deleteProduct',
        tags: ['Products'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            description: 'UUID of the product',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Product deleted successfully',
          },
          '400': {
            description: 'Invalid UUID',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/addresses': {
      get: {
        summary: 'Get list of addresses',
        description: 'Retrieve a list of addresses for the authenticated user',
        operationId: 'getAllAddresses',
        tags: ['Addresses'],
        responses: {
          '200': {
            description: 'List of addresses',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new address',
        description: 'Create a new address for the authenticated user',
        operationId: 'createAddress',
        tags: ['Addresses'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddressCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Address created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AddressResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/addresses/{id}': {
      get: {
        summary: 'Get address by ID',
        description: 'Retrieve details of a specific address by ID',
        operationId: 'getAddressById',
        tags: ['Addresses'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Address details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AddressResponse',
                },
              },
            },
          },
          '404': {
            description: 'Address not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update address',
        description: 'Update an existing address by ID',
        operationId: 'updateAddress',
        tags: ['Addresses'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AddressUpdateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Address updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AddressResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Address not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete address',
        description: 'Delete an address by ID',
        operationId: 'deleteAddress',
        tags: ['Addresses'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Address deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'Address not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // RateLimit
    '/rate-limit': {
      get: {
        summary: 'Get rate limit information',
        description: 'Retrieve rate limit information for the API',
        operationId: 'getRateLimit',
        tags: ['RateLimit'],
        responses: {
          '200': {
            description: 'Rate limit information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Permissions
    '/permissions': {
      get: {
        summary: 'Get list of permissions',
        description: 'Retrieve a list of permissions (requires MANAGE_PERMISSIONS)',
        operationId: 'getAllPermissions',
        tags: ['Permissions'],
        responses: {
          '200': {
            description: 'List of permissions',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Orders
    '/orders': {
      get: {
        summary: 'Get list of orders',
        description: 'Retrieve a paginated list of orders for the authenticated user',
        operationId: 'getAllOrders',
        tags: ['Orders'],
        responses: {
          '200': {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new order',
        description: 'Create a new order with provided data',
        operationId: 'createOrder',
        tags: ['Orders'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/OrderCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/orders/{uuid}': {
      get: {
        summary: 'Get order by UUID',
        description: 'Retrieve details of a specific order by UUID',
        operationId: 'getOrderById',
        tags: ['Orders'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Order details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update order status',
        description: 'Update the status of an order by UUID (requires MANAGE_ORDERS)',
        operationId: 'updateOrderStatus',
        tags: ['Orders'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/OrderStatusUpdate',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Order status updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Categories
    '/categories': {
      get: {
        summary: 'Get list of categories',
        description: 'Retrieve a paginated list of categories',
        operationId: 'getAllCategories',
        tags: ['Categories'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Number of categories to return',
            // schema: z.number().int().positive().optional(),
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of categories to skip',
            // schema: z.number().int().nonnegative().optional(),
          },
        ],
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new category',
        description: 'Create a new category (requires MANAGE_CATEGORIES)',
        operationId: 'createCategory',
        tags: ['Categories'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/categories/{uuid}': {
      get: {
        summary: 'Get category by UUID',
        description: 'Retrieve details of a specific category by UUID',
        operationId: 'getCategoryById',
        tags: ['Categories'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Category details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update category',
        description: 'Update an existing category by UUID (requires MANAGE_CATEGORIES)',
        operationId: 'updateCategory',
        tags: ['Categories'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryUpdateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CategoryResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete category',
        description: 'Delete a category by UUID (requires MANAGE_CATEGORIES)',
        operationId: 'deleteCategory',
        tags: ['Categories'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // CartItems
    '/cart-items/user/{user_id}': {
      get: {
        summary: 'Get cart items by user',
        description: 'Retrieve cart items for a specific user',
        operationId: 'getCartItemsByUser',
        tags: ['CartItems'],
        parameters: [
          {
            name: 'user_id',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'List of cart items',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/cart-items': {
      post: {
        summary: 'Add item to cart',
        description: 'Add a new item to the cart',
        operationId: 'createCartItem',
        tags: ['CartItems'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CartItemCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cart item added successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CartItemResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/cart-items/{id}': {
      put: {
        summary: 'Update cart item',
        description: 'Update quantity of a cart item by ID',
        operationId: 'updateCartItem',
        tags: ['CartItems'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CartItemUpdateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Cart item updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CartItemResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Cart item not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete cart item',
        description: 'Delete a cart item by ID',
        operationId: 'deleteCartItem',
        tags: ['CartItems'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Cart item deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'Cart item not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/cart-items/admin/user/{user_id}': {
      get: {
        summary: 'Get cart items by user (Admin)',
        description: 'Retrieve cart items for a specific user (requires MANAGE_ORDERS)',
        operationId: 'getAdminCartItemsByUser',
        tags: ['CartItems'],
        parameters: [
          {
            name: 'user_id',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'List of cart items',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Chatbot
    '/chatbot': {
      post: {
        summary: 'Interact with chatbot',
        description: 'Send a message to the chatbot and receive a response',
        operationId: 'interactWithChatbot',
        tags: ['Chatbot'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: z.object({
                message: z.string().min(1, 'Message is required'),
              }),
            },
          },
        },
        responses: {
          '200': {
            description: 'Chatbot response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Payments
    '/payments/paypal': {
      post: {
        summary: 'Create PayPal payment',
        description: 'Initiate a PayPal payment for an order',
        operationId: 'createPayPalPayment',
        tags: ['Payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentCreateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'PayPal payment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/payments/paypal/capture': {
      get: {
        summary: 'Capture PayPal payment',
        description: 'Capture a PayPal payment for an order',
        operationId: 'capturePayPalPayment',
        tags: ['Payments'],
        parameters: [
          {
            name: 'orderId',
            in: 'query',
            required: true,
            // schema: z.string(),
          },
        ],
        responses: {
          '200': {
            description: 'Payment captured successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/payments/paypal/cancel': {
      get: {
        summary: 'Cancel PayPal payment',
        description: 'Cancel a PayPal payment process',
        operationId: 'cancelPayPalPayment',
        tags: ['Payments'],
        responses: {
          '200': {
            description: 'Payment cancelled successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Cancellation failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/payments/admin/paypal': {
      post: {
        summary: 'Create PayPal payment (Admin)',
        description: 'Initiate a PayPal payment for an order (requires MANAGE_ORDERS)',
        operationId: 'createAdminPayPalPayment',
        tags: ['Payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentCreateInput',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'PayPal payment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/payments/admin/paypal/capture': {
      get: {
        summary: 'Capture PayPal payment (Admin)',
        description: 'Capture a PayPal payment for an order (requires MANAGE_ORDERS)',
        operationId: 'captureAdminPayPalPayment',
        tags: ['Payments'],
        parameters: [
          {
            name: 'orderId',
            in: 'query',
            required: true,
            // schema: z.string(),
          },
        ],
        responses: {
          '200': {
            description: 'Payment captured successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PaymentResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Order not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // Reviews
    '/reviews': {
      get: {
        summary: 'Get list of reviews',
        description: 'Retrieve a paginated list of reviews with optional filters',
        operationId: 'getAllReviews',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'filter',
            in: 'query',
            description: 'Filter parameters',
            schema: {
              $ref: '#/components/schemas/ReviewFilter',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of reviews',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new review',
        description: 'Create a new review for a product (requires CREATE_REVIEW or ownership)',
        operationId: 'createReview',
        tags: ['Reviews'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ReviewCreateInput',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Review created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ReviewResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/reviews/{uuid}': {
      get: {
        summary: 'Get review by UUID',
        description: 'Retrieve details of a specific review by UUID',
        operationId: 'getReviewById',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Review details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ReviewResponse',
                },
              },
            },
          },
          '404': {
            description: 'Review not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete review',
        description: 'Delete a review by UUID (requires DELETE_REVIEW or ownership)',
        operationId: 'deleteReview',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Review deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'Review not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/reviews/admin/{uuid}': {
      delete: {
        summary: 'Delete review (Admin)',
        description: 'Delete a review by UUID (requires DELETE_REVIEW)',
        operationId: 'deleteAdminReview',
        tags: ['Reviews'],
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Review deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '404': {
            description: 'Review not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
});

export default openApiSpec;
