/*
 Navicat Premium Data Transfer

 Source Server         : gisdb
 Source Server Type    : MySQL
 Source Server Version : 80011
 Source Host           : localhost:3306
 Source Schema         : sportdb

 Target Server Type    : MySQL
 Target Server Version : 80011
 File Encoding         : 65001

 Date: 21/09/2019 10:39:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer`  (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `gender` int(1) NULL DEFAULT NULL,
  `birth` date NULL DEFAULT NULL,
  `height` float(5, 1) NULL DEFAULT NULL,
  `weight` float(5, 1) NULL DEFAULT NULL,
  `wx` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `qq` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `coord` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `hobby` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `profession` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `visitsource` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `performancesource` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `target` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `classid` int(10) NULL DEFAULT NULL,
  `memberid` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `coachid` int(10) NULL DEFAULT NULL,
  `saleid` int(5) NULL DEFAULT NULL,
  `pid` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES (1, '张二', 1, '2000-01-01', 175.5, 120.1, '1233445566', '123456677', '13212341234', '湖北省武汉市武昌区', '114.33,30.45556', '篮球', '工程师', '备注', '会员朋友', '老会员', '减脂', 1, '000001', 5, 2, 2);
INSERT INTO `customer` VALUES (2, '张三', 2, '2000-01-01', 175.5, 120.1, '1233445566', '123456677', '13312341234', '湖北省武汉市武昌区', '114.33,30.45556', '篮球', '工程师', '备注', '会员朋友', '老会员', '减脂', 1, '000001', 5, 2, 3);
INSERT INTO `customer` VALUES (3, '张三', 2, '2000-01-01', 175.5, 120.1, '1233445566', '123456677', '13312341234', '湖北省武汉市武昌区', '114.33,30.45556', '篮球', '工程师', '备注', '会员朋友', '老会员', '减脂', 1, '000001', 5, 2, 1);
INSERT INTO `customer` VALUES (4, '李一', 1, '2000-01-01', 175.5, 120.1, '1233445566', '123456677', '13312341234', '湖北省武汉市武昌区', '114.33,30.45556', '篮球', '工程师', '备注', '会员朋友', '老会员', '减脂', 1, '000001', 5, 2, 1);
INSERT INTO `customer` VALUES (5, '张飞', 1, '2000-01-01', 177.0, 170.0, '张飞', '12345', '13012341234', '武汉市武昌区', '114.409855,30.98754', '唱跳rap', '歌手', '无', '网络', '转介绍', '塑形', 1, '000005', 1, 2, 6);

-- ----------------------------
-- Table structure for iconfiles
-- ----------------------------
DROP TABLE IF EXISTS `iconfiles`;
CREATE TABLE `iconfiles`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `filename` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `encoding` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mimetype` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `size` int(50) NULL DEFAULT NULL,
  `filepath` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `addTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sourcetype
-- ----------------------------
DROP TABLE IF EXISTS `sourcetype`;
CREATE TABLE `sourcetype`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` int(5) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sourcetype
-- ----------------------------
INSERT INTO `sourcetype` VALUES (1, '会员朋友', 1);
INSERT INTO `sourcetype` VALUES (2, '网络', 1);
INSERT INTO `sourcetype` VALUES (3, '附近', 1);
INSERT INTO `sourcetype` VALUES (4, '老会员', 1);
INSERT INTO `sourcetype` VALUES (5, '单页', 1);
INSERT INTO `sourcetype` VALUES (6, '自发', 1);
INSERT INTO `sourcetype` VALUES (7, '转介绍', 2);
INSERT INTO `sourcetype` VALUES (8, '续卡', 2);
INSERT INTO `sourcetype` VALUES (9, '老会员', 2);
INSERT INTO `sourcetype` VALUES (10, '访客', 2);
INSERT INTO `sourcetype` VALUES (11, '约访', 2);

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff`  (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `account` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `storeid` int(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `account`(`account`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of staff
-- ----------------------------
INSERT INTO `staff` VALUES (1, 'john', '13666666666', '123456', '销售', 2);
INSERT INTO `staff` VALUES (5, 'mary', '13666666667', '123456', '教练', 2);
INSERT INTO `staff` VALUES (7, 'mary', '13166666667', '123456', '教练', 2);
INSERT INTO `staff` VALUES (8, 'mary', '13126666667', '123456', '教练', 2);
INSERT INTO `staff` VALUES (9, 'mary', '13126646667', '123456', '教练', 2);
INSERT INTO `staff` VALUES (10, 'mary', '13126646867', '123456', '教练', 2);
INSERT INTO `staff` VALUES (11, 'mary', '13126646861', '123456', '教练', 1);

-- ----------------------------
-- Table structure for storefiles
-- ----------------------------
DROP TABLE IF EXISTS `storefiles`;
CREATE TABLE `storefiles`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `filename` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `encoding` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `mimetype` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `size` int(50) NULL DEFAULT NULL,
  `filepath` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `addTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for storeinfos
-- ----------------------------
DROP TABLE IF EXISTS `storeinfos`;
CREATE TABLE `storeinfos`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `account` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pwd` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pid` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of storeinfos
-- ----------------------------
INSERT INTO `storeinfos` VALUES (2, 'admin1', '123456', '2号店', 2);

-- ----------------------------
-- Table structure for type
-- ----------------------------
DROP TABLE IF EXISTS `type`;
CREATE TABLE `type`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of type
-- ----------------------------
INSERT INTO `type` VALUES (1, '销售');
INSERT INTO `type` VALUES (2, '教练');

-- ----------------------------
-- Table structure for usr
-- ----------------------------
DROP TABLE IF EXISTS `usr`;
CREATE TABLE `usr`  (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `user` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pwd` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr
-- ----------------------------
INSERT INTO `usr` VALUES (1, 'admin', '12345678');

SET FOREIGN_KEY_CHECKS = 1;
