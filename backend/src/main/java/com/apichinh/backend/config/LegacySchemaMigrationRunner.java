package com.apichinh.backend.config;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class LegacySchemaMigrationRunner implements ApplicationRunner {
   private static final Logger log = LoggerFactory.getLogger(LegacySchemaMigrationRunner.class);

   private final DataSource dataSource;
   private final JdbcTemplate jdbcTemplate;

   public LegacySchemaMigrationRunner(DataSource dataSource, JdbcTemplate jdbcTemplate) {
      this.dataSource = dataSource;
      this.jdbcTemplate = jdbcTemplate;
   }

   @Override
   public void run(ApplicationArguments args) throws Exception {
      try (Connection connection = dataSource.getConnection()) {
         migrateCategories(connection);
         migrateProducts(connection);
         migrateUsers(connection);
         migrateAddresses(connection);
         migrateOrders(connection);
         migrateOrderDetails(connection);
         migrateBrands(connection);
         migrateProductImages(connection);
         migrateProductReviews(connection);
         migrateBanners(connection);
         migrateContactMessages(connection);
         migrateCoupons(connection);
         migrateAdminAccounts(connection);
         bootstrapLegacyProductImages(connection);
         log.info("Legacy schema synchronization completed.");
      }
   }

   private void migrateCategories(Connection connection) throws SQLException {
      if (!tableExists(connection, "categories")) {
         return;
      }
      ensureColumn(connection, "categories", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "categories", "created_at", "DATETIME NULL");
      ensureColumn(connection, "categories", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute(
            "UPDATE `categories` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateProducts(Connection connection) throws SQLException {
      if (!tableExists(connection, "products")) {
         return;
      }
      ensureColumn(connection, "products", "detailed_description", "TEXT NULL");
      ensureColumn(connection, "products", "original_price", "DOUBLE NULL");
      ensureColumn(connection, "products", "stock_quantity", "INT NOT NULL DEFAULT 0");
      ensureColumn(connection, "products", "visible", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "products", "featured", "TINYINT(1) NOT NULL DEFAULT 0");
      ensureColumn(connection, "products", "best_seller", "TINYINT(1) NOT NULL DEFAULT 0");
      ensureColumn(connection, "products", "created_at", "DATETIME NULL");
      ensureColumn(connection, "products", "updated_at", "DATETIME NULL");
      ensureColumn(connection, "products", "brand_id", "BIGINT NULL");
      jdbcTemplate.execute("UPDATE `products` SET `original_price` = COALESCE(`original_price`, `price`)");
      jdbcTemplate.execute("UPDATE `products` SET `stock_quantity` = COALESCE(`stock_quantity`, 0)");
      jdbcTemplate.execute("UPDATE `products` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateUsers(Connection connection) throws SQLException {
      if (!tableExists(connection, "users")) {
         return;
      }
      ensureColumn(connection, "users", "full_name", "VARCHAR(120) NULL");
      ensureColumn(connection, "users", "role", "VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER'");
      ensureColumn(connection, "users", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "users", "created_at", "DATETIME NULL");
      ensureColumn(connection, "users", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `users` SET `full_name` = COALESCE(NULLIF(`full_name`, ''), `username`)");
      jdbcTemplate.execute("UPDATE `users` SET `role` = COALESCE(NULLIF(`role`, ''), 'CUSTOMER')");
      jdbcTemplate.execute("UPDATE `users` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateAddresses(Connection connection) throws SQLException {
      if (!tableExists(connection, "addresses")) {
         return;
      }
      ensureColumn(connection, "addresses", "receiver_name", "VARCHAR(255) NULL");
      ensureColumn(connection, "addresses", "receiver_phone", "VARCHAR(255) NULL");
   }

   private void migrateOrders(Connection connection) throws SQLException {
      if (!tableExists(connection, "orders")) {
         return;
      }
      ensureColumn(connection, "orders", "order_code", "VARCHAR(40) NULL");
      ensureColumn(connection, "orders", "status", "VARCHAR(255) NULL");
      ensureColumn(connection, "orders", "payment_status", "VARCHAR(255) NULL");
      ensureColumn(connection, "orders", "stock_deducted", "TINYINT(1) NOT NULL DEFAULT 0");
      ensureColumn(connection, "orders", "total_amount", "DOUBLE NULL");
      ensureColumn(connection, "orders", "original_amount", "DOUBLE NULL");
      ensureColumn(connection, "orders", "discount_amount", "DOUBLE NULL");
      ensureColumn(connection, "orders", "coupon_code", "VARCHAR(60) NULL");
      ensureColumn(connection, "orders", "coupon_title", "VARCHAR(160) NULL");
      ensureColumn(connection, "orders", "customer_name", "VARCHAR(255) NULL");
      ensureColumn(connection, "orders", "customer_phone", "VARCHAR(255) NULL");
      ensureColumn(connection, "orders", "note", "VARCHAR(1000) NULL");
      ensureColumn(connection, "orders", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `orders` SET `order_code` = COALESCE(NULLIF(`order_code`, ''), CONCAT('ORD-', `id`))");
      jdbcTemplate.execute("UPDATE `orders` SET `total_amount` = COALESCE(`total_amount`, 0)");
      jdbcTemplate.execute("UPDATE `orders` SET `original_amount` = COALESCE(`original_amount`, `total_amount`)");
      jdbcTemplate.execute("UPDATE `orders` SET `discount_amount` = COALESCE(`discount_amount`, 0)");
      jdbcTemplate.execute("UPDATE `orders` SET `stock_deducted` = COALESCE(`stock_deducted`, 0)");
      jdbcTemplate.execute("UPDATE `orders` SET `updated_at` = COALESCE(`updated_at`, COALESCE(`date`, NOW()))");
   }

   private void migrateOrderDetails(Connection connection) throws SQLException {
      if (!tableExists(connection, "order_details")) {
         return;
      }
      ensureColumn(connection, "order_details", "unit_price", "DOUBLE NULL");
      jdbcTemplate.execute("UPDATE `order_details` SET `unit_price` = COALESCE(`unit_price`, 0)");
   }

   private void migrateBrands(Connection connection) throws SQLException {
      ensureTable(connection, "brands", """
            CREATE TABLE `brands` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `name` VARCHAR(120) NOT NULL,
              `logo` VARCHAR(255) NULL,
              `description` VARCHAR(600) NULL,
              `active` TINYINT(1) NOT NULL DEFAULT 1,
              `created_at` DATETIME NULL,
              `updated_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "brands", "name", "VARCHAR(120) NOT NULL DEFAULT ''");
      ensureColumn(connection, "brands", "logo", "VARCHAR(255) NULL");
      ensureColumn(connection, "brands", "description", "VARCHAR(600) NULL");
      ensureColumn(connection, "brands", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "brands", "created_at", "DATETIME NULL");
      ensureColumn(connection, "brands", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `brands` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateProductImages(Connection connection) throws SQLException {
      ensureTable(connection, "product_images", """
            CREATE TABLE `product_images` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `product_id` BIGINT NOT NULL,
              `image_url` VARCHAR(255) NOT NULL,
              `thumbnail` TINYINT(1) NOT NULL DEFAULT 0,
              `sort_order` INT NOT NULL DEFAULT 0,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "product_images", "product_id", "BIGINT NOT NULL");
      ensureColumn(connection, "product_images", "image_url", "VARCHAR(255) NOT NULL");
      ensureColumn(connection, "product_images", "thumbnail", "TINYINT(1) NOT NULL DEFAULT 0");
      ensureColumn(connection, "product_images", "sort_order", "INT NOT NULL DEFAULT 0");
   }

   private void migrateProductReviews(Connection connection) throws SQLException {
      ensureTable(connection, "product_reviews", """
            CREATE TABLE `product_reviews` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `product_id` BIGINT NOT NULL,
              `user_id` BIGINT NULL,
              `rating` INT NOT NULL DEFAULT 5,
              `comment` VARCHAR(2000) NULL,
              `approved` TINYINT(1) NOT NULL DEFAULT 1,
              `created_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "product_reviews", "product_id", "BIGINT NOT NULL");
      ensureColumn(connection, "product_reviews", "user_id", "BIGINT NULL");
      ensureColumn(connection, "product_reviews", "order_id", "BIGINT NULL");
      ensureColumn(connection, "product_reviews", "rating", "INT NOT NULL DEFAULT 5");
      ensureColumn(connection, "product_reviews", "comment", "VARCHAR(2000) NULL");
      ensureColumn(connection, "product_reviews", "approved", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "product_reviews", "created_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `product_reviews` SET `created_at` = COALESCE(`created_at`, NOW())");
   }

   private void migrateBanners(Connection connection) throws SQLException {
      ensureTable(connection, "banners", """
            CREATE TABLE `banners` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `title` VARCHAR(180) NOT NULL,
              `image_url` VARCHAR(255) NULL,
              `link` VARCHAR(600) NULL,
              `sort_order` INT NOT NULL DEFAULT 0,
              `active` TINYINT(1) NOT NULL DEFAULT 1,
              `created_at` DATETIME NULL,
              `updated_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "banners", "title", "VARCHAR(180) NOT NULL DEFAULT ''");
      ensureColumn(connection, "banners", "image_url", "VARCHAR(255) NULL");
      ensureColumn(connection, "banners", "link", "VARCHAR(600) NULL");
      ensureColumn(connection, "banners", "sort_order", "INT NOT NULL DEFAULT 0");
      ensureColumn(connection, "banners", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "banners", "created_at", "DATETIME NULL");
      ensureColumn(connection, "banners", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `banners` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateContactMessages(Connection connection) throws SQLException {
      ensureTable(connection, "contact_messages", """
            CREATE TABLE `contact_messages` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `name` VARCHAR(120) NOT NULL,
              `email` VARCHAR(160) NULL,
              `phone` VARCHAR(30) NULL,
              `subject` VARCHAR(220) NULL,
              `message` VARCHAR(3000) NOT NULL,
              `resolved` TINYINT(1) NOT NULL DEFAULT 0,
              `created_at` DATETIME NULL,
              `updated_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "contact_messages", "name", "VARCHAR(120) NOT NULL DEFAULT ''");
      ensureColumn(connection, "contact_messages", "email", "VARCHAR(160) NULL");
      ensureColumn(connection, "contact_messages", "phone", "VARCHAR(30) NULL");
      ensureColumn(connection, "contact_messages", "subject", "VARCHAR(220) NULL");
      ensureColumn(connection, "contact_messages", "message", "VARCHAR(3000) NOT NULL DEFAULT ''");
      ensureColumn(connection, "contact_messages", "resolved", "TINYINT(1) NOT NULL DEFAULT 0");
      ensureColumn(connection, "contact_messages", "created_at", "DATETIME NULL");
      ensureColumn(connection, "contact_messages", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute(
            "UPDATE `contact_messages` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateCoupons(Connection connection) throws SQLException {
      ensureTable(connection, "coupons", """
            CREATE TABLE `coupons` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `code` VARCHAR(60) NOT NULL,
              `title` VARCHAR(160) NOT NULL,
              `discount_value` DOUBLE NOT NULL DEFAULT 0,
              `discount_type` VARCHAR(20) NOT NULL DEFAULT 'PERCENT',
              `min_order_value` DOUBLE NULL,
              `max_discount_value` DOUBLE NULL,
              `quantity` INT NULL,
              `active` TINYINT(1) NOT NULL DEFAULT 1,
              `start_at` DATETIME NULL,
              `end_at` DATETIME NULL,
              `created_at` DATETIME NULL,
              `updated_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "coupons", "code", "VARCHAR(60) NOT NULL DEFAULT ''");
      ensureColumn(connection, "coupons", "title", "VARCHAR(160) NOT NULL DEFAULT ''");
      ensureColumn(connection, "coupons", "discount_value", "DOUBLE NOT NULL DEFAULT 0");
      ensureColumn(connection, "coupons", "discount_type", "VARCHAR(20) NOT NULL DEFAULT 'PERCENT'");
      ensureColumn(connection, "coupons", "min_order_value", "DOUBLE NULL");
      ensureColumn(connection, "coupons", "max_discount_value", "DOUBLE NULL");
      ensureColumn(connection, "coupons", "quantity", "INT NULL");
      ensureColumn(connection, "coupons", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "coupons", "start_at", "DATETIME NULL");
      ensureColumn(connection, "coupons", "end_at", "DATETIME NULL");
      ensureColumn(connection, "coupons", "created_at", "DATETIME NULL");
      ensureColumn(connection, "coupons", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute("UPDATE `coupons` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void migrateAdminAccounts(Connection connection) throws SQLException {
      ensureTable(connection, "admin_accounts", """
            CREATE TABLE `admin_accounts` (
              `id` BIGINT NOT NULL AUTO_INCREMENT,
              `username` VARCHAR(80) NOT NULL,
              `email` VARCHAR(160) NOT NULL,
              `full_name` VARCHAR(120) NOT NULL,
              `password` VARCHAR(255) NOT NULL,
              `role` VARCHAR(40) NOT NULL DEFAULT 'SUPER_ADMIN',
              `active` TINYINT(1) NOT NULL DEFAULT 1,
              `created_at` DATETIME NULL,
              `updated_at` DATETIME NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB
            """);
      ensureColumn(connection, "admin_accounts", "username", "VARCHAR(80) NOT NULL DEFAULT ''");
      ensureColumn(connection, "admin_accounts", "email", "VARCHAR(160) NOT NULL DEFAULT ''");
      ensureColumn(connection, "admin_accounts", "full_name", "VARCHAR(120) NOT NULL DEFAULT ''");
      ensureColumn(connection, "admin_accounts", "password", "VARCHAR(255) NOT NULL DEFAULT ''");
      ensureColumn(connection, "admin_accounts", "role", "VARCHAR(40) NOT NULL DEFAULT 'SUPER_ADMIN'");
      ensureColumn(connection, "admin_accounts", "active", "TINYINT(1) NOT NULL DEFAULT 1");
      ensureColumn(connection, "admin_accounts", "created_at", "DATETIME NULL");
      ensureColumn(connection, "admin_accounts", "updated_at", "DATETIME NULL");
      jdbcTemplate.execute(
            "UPDATE `admin_accounts` SET `created_at` = COALESCE(`created_at`, NOW()), `updated_at` = COALESCE(`updated_at`, NOW())");
   }

   private void bootstrapLegacyProductImages(Connection connection) throws SQLException {
      if (!tableExists(connection, "products") || !tableExists(connection, "product_images")) {
         return;
      }
      jdbcTemplate.execute("""
            INSERT INTO `product_images` (`product_id`, `image_url`, `thumbnail`, `sort_order`)
            SELECT `p`.`id`, `p`.`photo`, 1, 0
            FROM `products` `p`
            WHERE `p`.`photo` IS NOT NULL
              AND `p`.`photo` <> ''
              AND NOT EXISTS (
                  SELECT 1
                  FROM `product_images` `pi`
                  WHERE `pi`.`product_id` = `p`.`id`
                    AND `pi`.`image_url` = `p`.`photo`
              )
            """);
   }

   private void ensureTable(Connection connection, String tableName, String createSql) throws SQLException {
      if (tableExists(connection, tableName)) {
         return;
      }
      log.info("Creating missing table '{}'.", tableName);
      jdbcTemplate.execute(createSql);
   }

   private void ensureColumn(Connection connection, String tableName, String columnName, String definition)
         throws SQLException {
      if (columnExists(connection, tableName, columnName)) {
         return;
      }
      log.info("Adding missing column '{}.{}'.", tableName, columnName);
      jdbcTemplate.execute(
            "ALTER TABLE `" + tableName + "` ADD COLUMN `" + columnName + "` " + definition);
   }

   private boolean tableExists(Connection connection, String tableName) throws SQLException {
      DatabaseMetaData metaData = connection.getMetaData();
      try (ResultSet tables = metaData.getTables(connection.getCatalog(), null, tableName, new String[] { "TABLE" })) {
         if (tables.next()) {
            return true;
         }
      }
      try (ResultSet tables = metaData.getTables(connection.getCatalog(), null, tableName.toUpperCase(),
            new String[] { "TABLE" })) {
         if (tables.next()) {
            return true;
         }
      }
      try (ResultSet tables = metaData.getTables(connection.getCatalog(), null, tableName.toLowerCase(),
            new String[] { "TABLE" })) {
         return tables.next();
      }
   }

   private boolean columnExists(Connection connection, String tableName, String columnName) throws SQLException {
      DatabaseMetaData metaData = connection.getMetaData();
      try (ResultSet columns = metaData.getColumns(connection.getCatalog(), null, tableName, columnName)) {
         if (columns.next()) {
            return true;
         }
      }
      try (ResultSet columns = metaData.getColumns(connection.getCatalog(), null, tableName.toUpperCase(),
            columnName.toUpperCase())) {
         if (columns.next()) {
            return true;
         }
      }
      try (ResultSet columns = metaData.getColumns(connection.getCatalog(), null, tableName.toLowerCase(),
            columnName.toLowerCase())) {
         return columns.next();
      }
   }
}
