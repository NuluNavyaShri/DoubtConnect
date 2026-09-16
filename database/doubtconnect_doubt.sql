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
-- Table structure for table `doubt`
--

DROP TABLE IF EXISTS `doubt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doubt` (
  `doubt_id` bigint NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `title` varchar(200) NOT NULL,
  `asked_by` varchar(255) NOT NULL,
  PRIMARY KEY (`doubt_id`),
  KEY `FKd37s4quikf1qm3rdy1e7vk2s6` (`asked_by`),
  CONSTRAINT `FKd37s4quikf1qm3rdy1e7vk2s6` FOREIGN KEY (`asked_by`) REFERENCES `user` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doubt`
--

LOCK TABLES `doubt` WRITE;
/*!40000 ALTER TABLE `doubt` DISABLE KEYS */;
INSERT INTO `doubt` VALUES (1,'How does React useState hook internally manage state updates and batching?','Understanding useState Internal Working','krishna9502202491@gmail.com'),(2,'What is the difference between useEffect dependency array variations and when should each be used?','Deep Dive into useEffect Dependencies','kk8334787@gmail.com'),(3,'How does JWT authentication work in Spring Boot applications?','JWT Authentication Flow in Spring Boot','abc@gmail.com'),(4,'What is the difference between @Component, @Service, and @Repository annotations?','Spring Stereotype Annotations Explained','jayakrishna@gmail.com'),(5,'How does Kafka ensure message ordering within partitions?','Kafka Message Ordering Concept','krishna9502202491@gmail.com'),(6,'Explain the difference between Monolithic and Microservices architecture.','Monolith vs Microservices','kk8334787@gmail.com'),(7,'How does garbage collection work in Java 21?','Java Garbage Collection Overview','abc@gmail.com'),(8,'What are the differences between HashMap and ConcurrentHashMap?','HashMap vs ConcurrentHashMap','jayakrishna@gmail.com'),(9,'How can we prevent SQL injection attacks in backend applications?','Preventing SQL Injection','krishna9502202491@gmail.com'),(10,'What is normalization in database design and why is it important?','Database Normalization Basics','kk8334787@gmail.com'),(11,'Explain the lifecycle of a React component.','React Component Lifecycle','abc@gmail.com'),(12,'How does Docker containerization differ from virtual machines?','Docker vs Virtual Machines','jayakrishna@gmail.com'),(13,'What is the role of Zookeeper in distributed systems?','Zookeeper in Distributed Architecture','krishna9502202491@gmail.com'),(14,'How does Spring Security manage authentication and authorization?','Spring Security Architecture','kk8334787@gmail.com'),(15,'What is memoization and how is it used in dynamic programming?','Understanding Memoization','abc@gmail.com'),(16,'Explain the concept of event-driven architecture.','Event Driven Architecture Explained','jayakrishna@gmail.com'),(17,'How does REST differ from SOAP web services?','REST vs SOAP Comparison','krishna9502202491@gmail.com'),(18,'What is CAP theorem in distributed systems?','Understanding CAP Theorem','kk8334787@gmail.com'),(19,'How does WebSocket communication differ from HTTP?','WebSocket vs HTTP','abc@gmail.com'),(20,'What are indexes in databases and how do they improve performance?','Database Indexing Concepts','jayakrishna@gmail.com'),(21,'Explain dependency injection in Spring framework.','Dependency Injection in Spring','krishna9502202491@gmail.com'),(22,'How does pagination work in SQL queries?','Implementing Pagination in SQL','kk8334787@gmail.com'),(23,'What is the difference between authentication and authorization?','Auth vs Authorization','abc@gmail.com'),(24,'How does caching improve system performance?','System Caching Strategies','jayakrishna@gmail.com'),(25,'Explain the working of load balancers.','Load Balancer Fundamentals','krishna9502202491@gmail.com'),(26,'What are ACID properties in database transactions?','Understanding ACID Properties','kk8334787@gmail.com'),(27,'How does Redux manage global state in React applications?','Redux State Management','abc@gmail.com'),(28,'What is optimistic locking and when should it be used?','Optimistic Locking Strategy','jayakrishna@gmail.com'),(29,'How does rate limiting work in APIs?','API Rate Limiting Mechanisms','krishna9502202491@gmail.com'),(30,'Explain the difference between synchronous and asynchronous programming.','Sync vs Async Programming','kk8334787@gmail.com'),(31,'How does a message queue improve scalability?','Message Queues and Scalability','abc@gmail.com'),(32,'What is the difference between cluster and partition in Kafka?','Kafka Cluster vs Partition','jayakrishna@gmail.com'),(33,'How does OAuth2 authorization flow work?','OAuth2 Authorization Flow','krishna9502202491@gmail.com'),(34,'What are design patterns and why are they important?','Importance of Design Patterns','kk8334787@gmail.com'),(35,'Explain thread safety in Java applications.','Thread Safety in Java','abc@gmail.com'),(36,'What is the difference between GET and POST HTTP methods?','GET vs POST Explained','jayakrishna@gmail.com'),(37,'How does CI/CD pipeline automate deployment?','CI/CD Pipeline Overview','krishna9502202491@gmail.com'),(38,'What is the difference between NoSQL and SQL databases?','SQL vs NoSQL Comparison','kk8334787@gmail.com'),(39,'How does React Context API work?','React Context API Explained','abc@gmail.com'),(40,'Explain the concept of sharding in databases.','Database Sharding Concept','jayakrishna@gmail.com'),(41,'What is a deadlock and how can it be prevented?','Deadlock Prevention Techniques','krishna9502202491@gmail.com'),(42,'How does HTTPS ensure secure communication?','Working of HTTPS Protocol','kk8334787@gmail.com'),(43,'Explain the difference between ArrayList and LinkedList.','ArrayList vs LinkedList','abc@gmail.com'),(44,'What is a reverse proxy and why is it used?','Reverse Proxy Explained','jayakrishna@gmail.com'),(45,'How does a CDN improve website performance?','CDN Performance Benefits','krishna9502202491@gmail.com'),(46,'What are the principles of Object-Oriented Programming?','OOP Principles Explained','kk8334787@gmail.com'),(47,'How does garbage collection tuning improve JVM performance?','JVM GC Tuning','abc@gmail.com'),(48,'What is the difference between blocking and non-blocking IO?','Blocking vs Non Blocking IO','jayakrishna@gmail.com'),(49,'Explain the difference between horizontal and vertical scaling.','Horizontal vs Vertical Scaling','krishna9502202491@gmail.com'),(50,'How does two-factor authentication enhance security?','Two Factor Authentication Overview','kk8334787@gmail.com');
/*!40000 ALTER TABLE `doubt` ENABLE KEYS */;
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
