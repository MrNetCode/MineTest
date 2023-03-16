ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;

CREATE DATABASE `test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `test`;

CREATE TABLE `users` (
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `type` enum('student','prof','admin') NOT NULL DEFAULT 'prof',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `tokens` (
  `username` varchar(100) NOT NULL,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`token`),
  KEY `tokens_FK` (`username`),
  CONSTRAINT `tokens_FK` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


CREATE TABLE `tests` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `state` enum('private','public') NOT NULL DEFAULT 'private',
  PRIMARY KEY (`id`),
  KEY `tests_FK` (`owner`),
  CONSTRAINT `tests_FK` FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- dev.questions definition

CREATE TABLE `questions` (
  `id` char(36) NOT NULL,
  `test` char(36) NOT NULL,
  `order` int(11) NOT NULL,
  `type` enum('multi','text','true-false') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_FK` (`test`),
  CONSTRAINT `questions_FK` FOREIGN KEY (`test`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- dev.`multi-choice` definition

CREATE TABLE `multi-choice` (
  `id` char(36) NOT NULL,
  `choice1` varchar(100) DEFAULT NULL,
  `choice2` varchar(100) DEFAULT NULL,
  `choice3` varchar(100) DEFAULT NULL,
  `choice4` varchar(100) DEFAULT NULL,
  `choice5` varchar(100) DEFAULT NULL,
  `correct` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `multi_choice_FK` FOREIGN KEY (`id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `multi_choice_CHECK` CHECK (`choice1` is not null or `choice2` is not null or `choice3` is not null or `choice4` is not null or `choice5` is not null)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- dev.`true-false` definition

CREATE TABLE `true-false` (
  `id` char(36) NOT NULL,
  `text` varchar(255) NOT NULL,
  `answer` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `true_false_FK` FOREIGN KEY (`id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;