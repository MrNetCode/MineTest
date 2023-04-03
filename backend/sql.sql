-- prod.users definition

CREATE TABLE `users` (
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `type` enum('student','prof','admin') NOT NULL DEFAULT 'prof',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- prod.tests definition

CREATE TABLE `tests` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `state` enum('private','public') NOT NULL DEFAULT 'private',
  PRIMARY KEY (`id`),
  KEY `tests_FK` (`owner`),
  CONSTRAINT `tests_FK` FOREIGN KEY (`owner`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- prod.tokens definition

CREATE TABLE `tokens` (
  `username` varchar(100) NOT NULL,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`token`),
  KEY `tokens_FK` (`username`),
  CONSTRAINT `tokens_FK` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- prod.questions definition

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


-- prod.true_false definition

CREATE TABLE `true_false` (
  `id` char(36) NOT NULL,
  `text` varchar(255) NOT NULL,
  `correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `true_false_FK` FOREIGN KEY (`id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- prod.multi_choice definition

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
