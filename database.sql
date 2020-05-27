DROP TABLE IF EXISTS `oak`.`_sg_articles`;
CREATE TABLE  `oak`.`_sg_articles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `article` varchar(30) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `html` text,
  `params` text,
  `config` text,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`article`)
);



DROP TABLE IF EXISTS `oak`.`_sg_catalogues`;
CREATE TABLE  `oak`.`_sg_catalogues` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catalogue` varchar(45) NOT NULL,
  `caption` varchar(45) DEFAULT '',
  `class` varchar(45) DEFAULT NULL,
  `querys` text,
  `template` varchar(30) DEFAULT NULL,
  `params` text,
  `methods` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`catalogue`)
) ;



DROP TABLE IF EXISTS `oak`.`_sg_f_catalogues`;
CREATE TABLE  `oak`.`_sg_f_catalogues` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `caption` varchar(100) DEFAULT NULL,
  `form` varchar(45) DEFAULT NULL,
  `catalogue` varchar(45) DEFAULT NULL,
  `params` text,
  `class` varchar(45) DEFAULT NULL,
  `methods` text,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `oak`.`_sg_fields`;
CREATE TABLE  `oak`.`_sg_fields` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `form` varchar(50) NOT NULL,
  `field` varchar(45) DEFAULT NULL,
  `alias` varchar(45) DEFAULT NULL,
  `caption` varchar(45) DEFAULT NULL,
  `input` varchar(45) DEFAULT NULL,
  `input_type` varchar(45) DEFAULT NULL,
  `cell` varchar(45) DEFAULT NULL,
  `cell_type` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `default` text,
  `mode_value` int(1) unsigned NOT NULL DEFAULT '0',
  `data` text,
  `params` text,
  `method` text,
  `rules` text,
  `events` text,
  `info` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`form`,`field`)
) ;

DROP TABLE IF EXISTS `oak`.`_sg_form`;
CREATE TABLE  `oak`.`_sg_form` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `form` varchar(45) NOT NULL,
  `caption` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `query` text,
  `params` text,
  `methods` text,
  `pages` text,
  `groups` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`form`)
);


DROP TABLE IF EXISTS `oak`.`_sg_groups`;
CREATE TABLE  `oak`.`_sg_groups` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` int(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY (`group`)
) ;


DROP TABLE IF EXISTS `oak`.`_sg_grp_usr`;
CREATE TABLE  `oak`.`_sg_grp_usr` (
  `group` varchar(30) NOT NULL,
  `user` varchar(30) NOT NULL,
  PRIMARY KEY (`group`,`user`),
  KEY `FK__sg_grp_usr_2` (`user`)

);


DROP TABLE IF EXISTS `oak`.`_sg_grp_str`;
CREATE TABLE  `oak`.`_sg_grp_str` (
  `group` varchar(30) NOT NULL,
  `structure` varchar(30) NOT NULL,
  PRIMARY KEY (`group`,`structure`)
) ;


DROP TABLE IF EXISTS `oak`.`_sg_menu_items`;
CREATE TABLE  `oak`.`_sg_menu_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `menu` varchar(45) DEFAULT NULL,
  `index` int(4) unsigned DEFAULT NULL,
  `parent` int(4) unsigned DEFAULT NULL,
  `method` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `action` text,
  `params` text,
  `order` int(4) unsigned DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  `actions` text,
  `events` text,
  PRIMARY KEY (`id`)
)

DROP TABLE IF EXISTS `oak`.`_sg_menus`;
CREATE TABLE  `oak`.`_sg_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menu` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `params` text,
  `config` text,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ;

DROP TABLE IF EXISTS `oak`.`_sg_modules`;
CREATE TABLE  `oak`.`_sg_modules` (
  `module` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `structure` varchar(30) DEFAULT NULL,
  `params` text,
  `theme` varchar(30) DEFAULT NULL,
  `debug` int(1) DEFAULT '0',
  `design` int(1) DEFAULT '0',
  PRIMARY KEY (`module`)
) ;

DROP TABLE IF EXISTS `oak`.`_sg_procedures`;
CREATE TABLE  `oak`.`_sg_procedures` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `procedure` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `commands` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `params` text,
  KEY `Index_1` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `oak`.`_sg_str_ele`;
CREATE TABLE  `oak`.`_sg_str_ele` (
  `structure` varchar(30) NOT NULL,
  `id` int(4) NOT NULL DEFAULT '0',
  `element` varchar(30) DEFAULT NULL,
  `name` text,
  `method` varchar(30) DEFAULT NULL,
  `eparams` text,
  `type` int(1) DEFAULT '0',
  `class` varchar(30) DEFAULT NULL,
  `debug` int(1) DEFAULT NULL,
  `design` int(1) DEFAULT NULL,
  PRIMARY KEY (`structure`,`id`)
) ;

DROP TABLE IF EXISTS `oak`.`_sg_structures`;
CREATE TABLE  `oak`.`_sg_structures` (
  `structure` varchar(30) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `template` varchar(30) DEFAULT NULL,
  `theme_template` varchar(45) DEFAULT NULL,
  `class` varchar(30) DEFAULT NULL,
  `main_panel` int(4) DEFAULT NULL,
  `params` text,
  `wins` text,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`structure`)
) ;

DROP TABLE IF EXISTS `oak`.`_sg_templates`;
CREATE TABLE  `oak`.`_sg_templates` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `template` varchar(45) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `html` text,
  `theme_template` varchar(45) DEFAULT NULL,
  `type` int(1) unsigned NOT NULL DEFAULT '0',
  `params` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`template`)
) ;


DROP TABLE IF EXISTS `oak`.`_sg_users`;
CREATE TABLE  `oak`.`_sg_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(45) DEFAULT NULL,
  `pass` varchar(45) DEFAULT NULL,
  `expiration` date DEFAULT NULL,
  `date_time` timestamp NULL DEFAULT NULL,
  `status` int(1) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UNIQUE` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;