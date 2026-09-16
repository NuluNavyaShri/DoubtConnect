-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: doubtconnect
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `answer_id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `doubt_id` bigint NOT NULL,
  `answered_by` varchar(255) NOT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `FKni75vgvo6tt10auam20m29do2` (`doubt_id`),
  KEY `FKtksh5x1tnx31nuq2hh31sn0kw` (`answered_by`),
  CONSTRAINT `FKni75vgvo6tt10auam20m29do2` FOREIGN KEY (`doubt_id`) REFERENCES `doubt` (`doubt_id`),
  CONSTRAINT `FKtksh5x1tnx31nuq2hh31sn0kw` FOREIGN KEY (`answered_by`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,'useState stores state in a fiber node and schedules updates via React reconciliation.',1,'kk8334787@gmail.com'),(2,'State updates are batched for performance and processed during the render phase.',1,'abc@gmail.com'),(3,'An empty dependency array makes useEffect run only once after mount.',2,'jayakrishna@gmail.com'),(4,'Providing dependencies ensures effect re-runs only when tracked values change.',2,'krishna9502202491@gmail.com'),(5,'JWT contains header, payload, and signature, signed using a secret key.',3,'kk8334787@gmail.com'),(6,'In Spring Boot, filters validate the token before allowing access to secured endpoints.',3,'abc@gmail.com'),(7,'@Component is generic, @Service defines business logic, @Repository handles persistence.',4,'jayakrishna@gmail.com'),(8,'@Repository also enables exception translation for database operations.',4,'krishna9502202491@gmail.com'),(9,'Kafka maintains ordering only within a single partition.',5,'kk8334787@gmail.com'),(10,'Producers must use the same key to ensure ordered delivery.',5,'abc@gmail.com'),(11,'Monolith is a single deployable unit, microservices are independently deployable.',6,'jayakrishna@gmail.com'),(12,'Microservices enable scalability but increase operational complexity.',6,'krishna9502202491@gmail.com'),(13,'Java 21 uses generational garbage collection strategies like G1 and ZGC.',7,'kk8334787@gmail.com'),(14,'GC reclaims unreachable objects automatically from heap memory.',7,'abc@gmail.com'),(15,'HashMap is not thread-safe whereas ConcurrentHashMap supports concurrent access.',8,'jayakrishna@gmail.com'),(16,'ConcurrentHashMap segments the map internally for better concurrency.',8,'krishna9502202491@gmail.com'),(17,'Prepared statements prevent SQL injection by parameter binding.',9,'kk8334787@gmail.com'),(18,'Always validate and sanitize user input on backend.',9,'abc@gmail.com'),(19,'Normalization reduces redundancy and improves data integrity.',10,'jayakrishna@gmail.com'),(20,'Third Normal Form eliminates transitive dependency.',10,'krishna9502202491@gmail.com'),(21,'React lifecycle includes mounting, updating, and unmounting phases.',11,'kk8334787@gmail.com'),(22,'Hooks replaced many class lifecycle methods in functional components.',11,'abc@gmail.com'),(23,'Docker containers share host OS kernel unlike VMs.',12,'jayakrishna@gmail.com'),(24,'Containers are lightweight and start faster than VMs.',12,'krishna9502202491@gmail.com'),(25,'Zookeeper manages distributed coordination and leader election.',13,'kk8334787@gmail.com'),(26,'It ensures consistency across distributed nodes.',13,'abc@gmail.com'),(27,'Spring Security uses filters to intercept and validate requests.',14,'jayakrishna@gmail.com'),(28,'Authentication verifies identity while authorization verifies permissions.',14,'krishna9502202491@gmail.com'),(29,'Memoization stores computed results to avoid recomputation.',15,'kk8334787@gmail.com'),(30,'It significantly optimizes recursive dynamic programming problems.',15,'abc@gmail.com'),(31,'Event-driven systems communicate using events instead of direct calls.',16,'jayakrishna@gmail.com'),(32,'They improve scalability and loose coupling.',16,'krishna9502202491@gmail.com'),(33,'REST is lightweight and uses HTTP methods directly.',17,'kk8334787@gmail.com'),(34,'SOAP is protocol-based and supports strict standards.',17,'abc@gmail.com'),(35,'CAP theorem states consistency, availability, and partition tolerance cannot all be guaranteed.',18,'jayakrishna@gmail.com'),(36,'Distributed systems must choose trade-offs between them.',18,'krishna9502202491@gmail.com'),(37,'WebSocket enables full duplex communication.',19,'kk8334787@gmail.com'),(38,'HTTP is request-response based.',19,'abc@gmail.com'),(39,'Indexes improve search performance using B-tree structures.',20,'jayakrishna@gmail.com'),(40,'Too many indexes can slow down write operations.',20,'krishna9502202491@gmail.com'),(41,'Dependency injection promotes loose coupling.',21,'kk8334787@gmail.com'),(42,'Spring automatically wires beans using IoC container.',21,'abc@gmail.com'),(43,'Pagination can be implemented using LIMIT and OFFSET.',22,'jayakrishna@gmail.com'),(44,'Cursor-based pagination is more scalable for large datasets.',22,'krishna9502202491@gmail.com'),(45,'Authentication checks identity using credentials.',23,'kk8334787@gmail.com'),(46,'Authorization determines access rights.',23,'abc@gmail.com'),(47,'Caching reduces database load and latency.',24,'jayakrishna@gmail.com'),(48,'Redis is commonly used for distributed caching.',24,'krishna9502202491@gmail.com'),(49,'Load balancers distribute traffic evenly across servers.',25,'kk8334787@gmail.com'),(50,'They improve availability and reliability.',25,'abc@gmail.com'),(51,'ACID ensures reliable database transactions.',26,'jayakrishna@gmail.com'),(52,'Atomicity guarantees all-or-nothing execution.',26,'krishna9502202491@gmail.com'),(53,'Redux uses a centralized store.',27,'kk8334787@gmail.com'),(54,'Reducers define how state transitions occur.',27,'abc@gmail.com'),(55,'Optimistic locking avoids row locks using version fields.',28,'jayakrishna@gmail.com'),(56,'It works best in low conflict scenarios.',28,'krishna9502202491@gmail.com'),(57,'Rate limiting restricts request frequency.',29,'kk8334787@gmail.com'),(58,'Token bucket algorithm is widely used.',29,'abc@gmail.com'),(59,'Synchronous blocks execution until completion.',30,'jayakrishna@gmail.com'),(60,'Asynchronous improves responsiveness.',30,'krishna9502202491@gmail.com'),(61,'Message queues decouple producers and consumers.',31,'kk8334787@gmail.com'),(62,'They enable horizontal scaling.',31,'abc@gmail.com'),(63,'Kafka cluster is group of brokers.',32,'jayakrishna@gmail.com'),(64,'Partition divides topic for scalability.',32,'krishna9502202491@gmail.com'),(65,'OAuth2 involves authorization server and resource server.',33,'kk8334787@gmail.com'),(66,'Access tokens grant limited permissions.',33,'abc@gmail.com'),(67,'Design patterns provide reusable solutions.',34,'jayakrishna@gmail.com'),(68,'They improve code maintainability.',34,'krishna9502202491@gmail.com'),(69,'Thread safety prevents race conditions.',35,'kk8334787@gmail.com'),(70,'Synchronization mechanisms ensure safe access.',35,'abc@gmail.com'),(71,'GET retrieves data, POST submits data.',36,'jayakrishna@gmail.com'),(72,'POST is not idempotent.',36,'krishna9502202491@gmail.com'),(73,'CI/CD automates build and deployment.',37,'kk8334787@gmail.com'),(74,'It reduces manual errors.',37,'abc@gmail.com'),(75,'SQL databases are relational.',38,'jayakrishna@gmail.com'),(76,'NoSQL supports flexible schema.',38,'krishna9502202491@gmail.com'),(77,'Context API avoids prop drilling.',39,'kk8334787@gmail.com'),(78,'It is suitable for global state sharing.',39,'abc@gmail.com'),(79,'Sharding splits database horizontally.',40,'jayakrishna@gmail.com'),(80,'It improves scalability.',40,'krishna9502202491@gmail.com'),(81,'Deadlock occurs when threads wait indefinitely.',41,'kk8334787@gmail.com'),(82,'Proper resource ordering prevents deadlocks.',41,'abc@gmail.com'),(83,'HTTPS uses TLS encryption.',42,'jayakrishna@gmail.com'),(84,'Certificates validate server identity.',42,'krishna9502202491@gmail.com'),(85,'ArrayList uses dynamic arrays.',43,'kk8334787@gmail.com'),(86,'LinkedList uses nodes with pointers.',43,'abc@gmail.com'),(87,'Reverse proxy handles client requests before forwarding.',44,'jayakrishna@gmail.com'),(88,'It improves security and caching.',44,'krishna9502202491@gmail.com'),(89,'CDN distributes content geographically.',45,'kk8334787@gmail.com'),(90,'It reduces latency.',45,'abc@gmail.com'),(91,'OOP includes encapsulation, inheritance, polymorphism.',46,'jayakrishna@gmail.com'),(92,'Abstraction hides internal complexity.',46,'krishna9502202491@gmail.com'),(93,'GC tuning adjusts heap sizes and algorithms.',47,'kk8334787@gmail.com'),(94,'It reduces pause times.',47,'abc@gmail.com'),(95,'Blocking IO waits for operation completion.',48,'jayakrishna@gmail.com'),(96,'Non-blocking IO improves scalability.',48,'krishna9502202491@gmail.com'),(97,'Horizontal scaling adds more machines.',49,'kk8334787@gmail.com'),(98,'Vertical scaling increases machine capacity.',49,'abc@gmail.com'),(99,'Two-factor authentication adds extra verification step.',50,'jayakrishna@gmail.com'),(100,'It significantly reduces unauthorized access risk.',50,'krishna9502202491@gmail.com');
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-11 13:02:10
