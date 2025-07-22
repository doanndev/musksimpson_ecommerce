/*
  Warnings:

  - You are about to alter the column `created_at` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `category_breadcrumbs` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `category_breadcrumbs` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `email_blacklist` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `email_blacklist` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `permissions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `product_attributes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `product_attributes` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `product_images` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `product_images` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `product_specifications` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `product_specifications` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `role_permissions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `role_permissions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `seller_hidden_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `seller_hidden_users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `shops` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `shops` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `email_verified_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `last_login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `created_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `cart_items` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `categories` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `category_breadcrumbs` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `email_blacklist` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `order_items` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `orders` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `payments` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `permissions` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `product_attributes` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `product_images` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `product_specifications` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `products` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `reviews` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `role_permissions` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `roles` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `seller_hidden_users` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `shops` MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE `users` MODIFY `email_verified_at` DATETIME NULL,
    MODIFY `last_login` DATETIME NULL,
    MODIFY `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
