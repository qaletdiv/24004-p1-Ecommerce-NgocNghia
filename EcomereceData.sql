CREATE TABLE `account` (
  `account_id` integer PRIMARY KEY,
  `user_email` varchar(255) UNIQUE,
  `password` varchar(255)
);

CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY,
  `account_id` integer NOT NULL,
  `profile_user_image` varchar(255),
  `user_full_name` varchar(255),
  `DOB` timestamp,
  `gender` varchar(255),
  `phone_number` varchar(255),
  `home_address` varchar(255),
  `office_address` varchar(255)
);

CREATE TABLE `products` (
  `product_id` integer PRIMARY KEY,
  `product_name` varchar(255),
  `product_price` double,
  `product_description` varchar(255),
  `category_id` integer
);

CREATE TABLE `product_image` (
  `product_image_id` integer PRIMARY KEY,
  `product_id` integer,
  `product_image_link` varchar(255)
);

CREATE TABLE `category` (
  `category_id` integer PRIMARY KEY,
  `category_name` varchar(255)
);

CREATE TABLE `products_cart` (
  `products_cart_id` integer PRIMARY KEY,
  `product_id` integer,
  `cart_id` integer,
  `product_quantity` integer
);

CREATE TABLE `cart` (
  `cart_id` integer PRIMARY KEY,
  `user_id` integer NOT NULL,
  `total_product_type` integer
);

CREATE TABLE `payment` (
  `card_id` integer PRIMARY KEY,
  `user_id` integer,
  `card_name` varchar(255),
  `card_number` varchar(255),
  `card_password` varchar(255),
  `card_code` varchar(255)
);

CREATE TABLE `order_details` (
  `order_details_id` integer PRIMARY KEY,
  `order_id` integer,
  `product_id` integer,
  `product_quantity` integer,
  `product_price` double,
  `product_category` varchar(255)
);

CREATE TABLE `orders` (
  `order_id` integer PRIMARY KEY,
  `user_id` integer,
  `total_product_type` integer,
  `total_product_quantity` integer,
  `status` varchar(255)
);

CREATE TABLE `transaction` (
  `transaction_id` integer PRIMARY KEY,
  `user_id` integer,
  `transaction_amount` integer,
  `transaction_date` date
);

ALTER TABLE `users` ADD FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`);

ALTER TABLE `payment` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `order_details` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

ALTER TABLE `order_details` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `cart` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `products_cart` ADD FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`);

ALTER TABLE `products_cart` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`);

ALTER TABLE `product_image` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `transaction` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
