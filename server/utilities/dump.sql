-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: store
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_color` tinytext NOT NULL,
  `item_amount` int NOT NULL,
  `product_id` int NOT NULL,
  `photos` text,
  PRIMARY KEY (`item_id`),
  KEY `item_product_id_fk_idx` (`product_id`),
  CONSTRAINT `item_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'blue',10,1,'Lenovo x120/1'),(2,'blue',10,2,'Sportsball 3000/2'),(3,'blue',10,3,'Mario Odyssey/3'),(4,'red',10,1,'Lenovo x120/4'),(5,'red',10,2,'Sportsball 3000/5'),(6,'red',10,3,'Mario Odyssey/6'),(8,'gray',3,2,'Sportsball 3000/8'),(9,'gray',3,1,'Lenovo x120/9');
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('fulfilled','cart') NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `order_user_id_fk_idx` (`user_id`),
  CONSTRAINT `order_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,2,'fulfilled'),(2,2,'cart'),(3,3,'fulfilled'),(4,2,'fulfilled'),(5,3,'cart'),(6,3,'fulfilled'),(7,4,'cart');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `order_id` int NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_item_item_id_fk_idx` (`item_id`),
  KEY `order_item_order_id_fk_idx` (`order_id`),
  CONSTRAINT `order_item_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`),
  CONSTRAINT `order_item_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,1,3),(2,2,1,2),(3,3,1,1),(4,1,2,5),(5,3,5,1),(6,2,3,1),(7,3,5,1),(8,2,5,1);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_info`
--

DROP TABLE IF EXISTS `payment_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_info` (
  `payment_info_id` int NOT NULL AUTO_INCREMENT,
  `credit_number` varchar(16) NOT NULL,
  `cvv` int NOT NULL,
  `expiration_date` date NOT NULL,
  `user_id` int NOT NULL,
  `active` tinyint NOT NULL,
  PRIMARY KEY (`payment_info_id`),
  KEY `payment_info_user_if_fk_idx` (`user_id`),
  CONSTRAINT `payment_info_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_info`
--

LOCK TABLES `payment_info` WRITE;
/*!40000 ALTER TABLE `payment_info` DISABLE KEYS */;
INSERT INTO `payment_info` VALUES (1,'3333444455556666',315,'2026-08-00',2,1),(2,'3333444455556666',315,'2026-08-00',3,1),(3,'3333444455557777',342,'2028-08-00',2,0);
/*!40000 ALTER TABLE `payment_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` text NOT NULL,
  `description` text NOT NULL,
  `type_id` int NOT NULL,
  `main_photo` text,
  `cost` float NOT NULL,
  `brand` tinytext NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `product_type_id_fk_idx` (`type_id`),
  CONSTRAINT `product_type_id_fk` FOREIGN KEY (`type_id`) REFERENCES `type` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Lenovo x120','a laptop baybeee',1,'1.jpg',500.5,'Lenovo'),(2,'Sportsball 3000','a very cool sports ball',2,'2.jpg',10.4,'Spalding'),(3,'Mario Odyssey','great game guys',3,NULL,5000,'Nintendo');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_history`
--

DROP TABLE IF EXISTS `purchase_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_history` (
  `purchase_history_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `purchase_date` date NOT NULL,
  `total_cost` int NOT NULL,
  `payment_info_id` int DEFAULT NULL,
  PRIMARY KEY (`purchase_history_id`),
  KEY `purchase_history_order_id_fk_idx` (`order_id`),
  KEY `purchase_history_payment_info_id_fk_idx` (`payment_info_id`),
  CONSTRAINT `purchase_history_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `purchase_history_payment_info_id_fk` FOREIGN KEY (`payment_info_id`) REFERENCES `payment_info` (`payment_info_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_history`
--

LOCK TABLES `purchase_history` WRITE;
/*!40000 ALTER TABLE `purchase_history` DISABLE KEYS */;
INSERT INTO `purchase_history` VALUES (1,1,'2022-10-18',5500,1),(2,3,'2022-09-18',5500,2),(3,4,'2022-10-18',5500,3),(4,6,'2022-11-18',5500,2);
/*!40000 ALTER TABLE `purchase_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` text NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'Laptops'),(2,'Sports'),(3,'Video Games');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `address` text NOT NULL,
  `phone_number` tinytext NOT NULL,
  `password` text NOT NULL,
  `permission` enum('customer','admin') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Bret','asdf@gmail.com','Your mama\'s house','055555555','Hv6GHv6G8M%2k4X','admin'),(2,'bobbart55','as123@gmail.com','Your daddy\'s house','055555555','*Nd@aQKTwfx1s0_','customer'),(3,'superman','ayyyy@gmail.com','no one knows','055555555','WVATV6@VewxO1n1$','customer'),(4,'evyatar','evyatarshafran@gmail.com','asdfasdf','0586311211','hHDXqfhHDXqf4U&10/','customer');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-20  4:14:06
