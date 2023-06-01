CREATE DATABASE dev;

USE dev;

CREATE TABLE `users` (
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `type` enum('student','prof','admin','banned') NOT NULL DEFAULT 'prof',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `tests` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `state` enum('stale','prepared','waiting','started') NOT NULL DEFAULT 'stale',
  `port` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tests_FK` (`owner`),
  CONSTRAINT `tests_FK` FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `tokens` (
  `username` varchar(100) NOT NULL,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`token`),
  KEY `tokens_FK` (`username`),
  CONSTRAINT `tokens_FK` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `questions` (
  `id` char(36) NOT NULL,
  `test` char(36) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 1,
  `type` enum('multi','text','true-false') NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_FK` (`test`),
  CONSTRAINT `questions_FK` FOREIGN KEY (`test`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `true_false` (
  `id` char(36) NOT NULL,
  `text` varchar(255) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `true_false_FK` FOREIGN KEY (`id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `multi_choice` (
  `id` char(36) NOT NULL,
  `correct` int(11) NOT NULL,
  `choice1` varchar(100) NOT NULL,
  `choice2` varchar(100) NOT NULL,
  `choice3` varchar(100) DEFAULT NULL,
  `choice4` varchar(100) DEFAULT NULL,
  `choice5` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `multi_choice_FK` FOREIGN KEY (`id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `answers` (
  `player` varchar(100) NOT NULL,
  `questionId` varchar(100) NOT NULL,
  `answer` longtext NOT NULL,
  `testId` varchar(100) NOT NULL,
  PRIMARY KEY (`player`,`questionId`),
  KEY `answers_FK` (`questionId`),
  KEY `answers_FK_1` (`testId`),
  CONSTRAINT `answers_FK` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `answers_FK_1` FOREIGN KEY (`testId`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
