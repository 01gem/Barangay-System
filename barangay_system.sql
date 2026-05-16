-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 16, 2026 at 01:37 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `barangay_system` DEFAULT CHARACTER SET latin1;
USE `barangay_system`;

--
-- Database: `barangay_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `barangay_officials`
--

CREATE TABLE `barangay_officials` (
  `id` int NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `barangay_officials`
--

INSERT INTO `barangay_officials` (`id`, `fname`, `lname`, `address`, `contact`, `email`, `password`) VALUES
(1, 'Ana', 'Reyes', 'Barangay Hall, Sampaguita', '09170000003', 'official1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int NOT NULL,
  `reference_no` varchar(50) NOT NULL,
  `resident_name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `location_text` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `date_filed` varchar(30) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'open',
  `official_note` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `reference_no`, `resident_name`, `category`, `location_text`, `description`, `date_filed`, `status`, `official_note`) VALUES
(1, 'COMP-20260516-0001', 'Juan Dela Cruz', 'Noise', 'Purok 1, Sampaguita', 'Loud music late at night.', '2026-05-15 20:30', 'open', ''),
(2, 'COMP-20260516-0002', 'Maria Santos', 'Parking', 'Purok 2, Sampaguita', 'Vehicle blocking driveway.', '2026-05-14 08:15', 'resolved', 'Resolved during barangay mediation.');

-- --------------------------------------------------------

--
-- Table structure for table `document_requests`
--

CREATE TABLE `document_requests` (
  `id` int NOT NULL,
  `reference_no` varchar(50) NOT NULL,
  `resident_id` int DEFAULT NULL,
  `resident_name` varchar(100) NOT NULL,
  `resident_email` varchar(100) DEFAULT NULL,
  `document_type` varchar(100) NOT NULL,
  `purpose` varchar(150) NOT NULL,
  `date_requested` varchar(30) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `document_requests`
--

INSERT INTO `document_requests` (`id`, `reference_no`, `resident_id`, `resident_name`, `resident_email`, `document_type`, `purpose`, `date_requested`, `status`) VALUES
(1, 'DOC-20260516-0001', 1, 'Juan Dela Cruz', 'resident1@example.com', 'Barangay Clearance', 'Employment', '2026-05-16 09:05', 'pending'),
(2, 'DOC-20260516-0002', 2, 'Maria Santos', 'resident2@example.com', 'Certificate of Residency', 'School', '2026-05-16 09:10', 'ready');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `title` varchar(120) NOT NULL,
  `body` varchar(255) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `body`, `is_read`, `created_at`) VALUES
(1, 'System Ready', 'Your account has been created successfully.', 1, '2026-05-16 09:00'),
(2, 'Document Update', 'Your document request DOC-20260516-0002 is ready for pickup.', 0, '2026-05-16 09:20');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `fname`, `lname`, `address`, `contact`, `email`, `password`) VALUES
(1, 'Juan', 'Dela Cruz', 'Blk 1 Lot 2, Sampaguita', '09170000001', 'resident1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Maria', 'Santos', 'Purok 2, Sampaguita', '09170000002', 'resident2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barangay_officials`
--
ALTER TABLE `barangay_officials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_no` (`reference_no`);

--
-- Indexes for table `document_requests`
--
ALTER TABLE `document_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_no` (`reference_no`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barangay_officials`
--
ALTER TABLE `barangay_officials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `document_requests`
--
ALTER TABLE `document_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
