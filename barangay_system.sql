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
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int NOT NULL,
  `title` varchar(120) NOT NULL,
  `excerpt` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'General',
  `created_at` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `excerpt`, `category`, `created_at`) VALUES
(1, 'Barangay Fiesta 2026', 'Join us on June 15, 2026 for the Barangay Fiesta celebration with activities, food, and entertainment for the whole family.', 'Event', '2026-05-17 07:15'),
(2, 'Road Maintenance Schedule', 'Road maintenance activities in Purok 3 are scheduled for May 20-22, 2026. Please avoid the area during these dates.', 'Maintenance', '2026-05-17 08:45'),
(3, 'Water System Upgrade', 'Barangay water system upgrade project begins on May 25, 2026. Residents may experience water interruptions during the upgrade.', 'Maintenance', '2026-05-16 10:30'),
(4, 'Community Health Drive', 'Free medical and dental services will be provided on June 1, 2026 at the Barangay Hall for all residents.', 'Health', '2026-05-15 14:00'),
(5, 'New Online Services Available', 'Residents can now apply for barangay clearances and certificates online through the BarangayLink portal.', 'Service', '2026-05-14 09:20'),
(6, 'Scholarship Application Opens', 'Educational scholarship applications for deserving students are now open. Deadline: June 30, 2026.', 'Education', '2026-05-13 15:45');

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `address` varchar(150) NOT NULL,
  `contact` varchar(50) NOT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT '5.0',
  `reviews_count` int DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `name`, `category`, `description`, `address`, `contact`, `rating`, `reviews_count`, `is_verified`) VALUES
(1, 'Juan\'s Restaurant', 'Food', 'Authentic Filipino cuisine with fresh local ingredients. Open 10 AM - 9 PM daily.', 'Purok 1, Sampaguita', '09171234567', 4.8, 24, 1),
(2, 'Maria\'s Sari-Sari Store', 'Retail', 'One-stop shop for groceries, snacks, and household items. Affordable prices and friendly service.', 'Purok 2, Sampaguita', '09172345678', 4.5, 18, 1),
(3, 'Pedro\'s Barbershop', 'Services', 'Professional haircuts, grooming, and styling for men. Walk-ins welcome.', 'Blk 3 Lot 5, Sampaguita', '09173456789', 4.7, 32, 1),
(4, 'Lucia\'s Bakery', 'Food', 'Fresh bread, pastries, and cakes baked daily. Catering services available.', 'Purok 4, Sampaguita', '09174567890', 4.9, 41, 1),
(5, 'Tech Service Center', 'Services', 'Mobile phone repairs, charging, and accessories. Quick turnaround time.', 'Blk 1 Lot 2, Sampaguita', '09175678901', 4.6, 28, 1),
(6, 'Angela\'s Clothing Boutique', 'Retail', 'Latest fashion trends and clothing for men, women, and kids. Affordable prices.', 'Purok 1, Sampaguita', '09176789012', 4.4, 15, 1),
(7, 'Diego\'s Hardware Store', 'Retail', 'Complete range of hardware tools and building materials for home improvement projects.', 'Blk 4 Lot 1, Sampaguita', '09177890123', 4.5, 22, 1),
(8, 'Beauty Salon Sampaguita', 'Services', 'Hair care, facial treatments, and wellness services for women. Relaxing environment.', 'Purok 3, Sampaguita', '09178901234', 4.8, 35, 1);

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
(1, 'Ana', 'Reyes', 'Barangay Hall, Sampaguita', '09170000003', 'official1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Carlos', 'Mendoza', 'Barangay Hall, Sampaguita', '09170000004', 'official2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Rosa', 'Flores', 'Barangay Hall, Sampaguita', '09170000005', 'official3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

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
(2, 'COMP-20260516-0002', 'Maria Santos', 'Parking', 'Purok 2, Sampaguita', 'Vehicle blocking driveway.', '2026-05-14 08:15', 'resolved', 'Resolved during barangay mediation.'),
(3, 'COMP-20260517-0003', 'Antonio Castillo', 'Street Maintenance', 'Purok 3, Sampaguita', 'Potholes on main road need repair.', '2026-05-16 14:45', 'open', ''),
(4, 'COMP-20260517-0004', 'Elena Morales', 'Stray Animals', 'Purok 4, Sampaguita', 'Pack of stray dogs roaming neighborhood.', '2026-05-15 09:20', 'in_progress', 'Animal control contacted.'),
(5, 'COMP-20260517-0005', 'Roberto Torres', 'Water Supply', 'Purok 1, Sampaguita', 'No water for 3 days.', '2026-05-16 17:30', 'resolved', 'Water pressure restored successfully.');

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
(2, 'DOC-20260516-0002', 2, 'Maria Santos', 'resident2@example.com', 'Certificate of Residency', 'School', '2026-05-16 09:10', 'ready'),
(3, 'DOC-20260517-0003', 3, 'Pedro Gonzales', 'resident3@example.com', 'Barangay Clearance', 'Travel', '2026-05-17 08:30', 'pending'),
(4, 'DOC-20260517-0004', 4, 'Lucia Reyes', 'resident4@example.com', 'Certificate of Low Income', 'Scholarship', '2026-05-16 11:45', 'ready'),
(5, 'DOC-20260517-0005', 5, 'Francisco Hernandez', 'resident5@example.com', 'Residency Certification', 'Business Permit', '2026-05-15 14:20', 'processing');

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
(2, 'Document Update', 'Your document request DOC-20260516-0002 is ready for pickup.', 0, '2026-05-16 09:20'),
(3, 'Barangay Announcement', 'Barangay fiesta celebration is scheduled for June 15, 2026.', 0, '2026-05-17 07:15'),
(4, 'Complaint Status', 'Your complaint COMP-20260516-0001 has been noted and assigned to officials.', 1, '2026-05-15 21:00'),
(5, 'Maintenance Notice', 'Road maintenance activities in Purok 3 scheduled for May 20-22, 2026.', 0, '2026-05-17 08:45'),
(6, 'Document Ready', 'Your document request DOC-20260517-0004 is now ready for pickup.', 0, '2026-05-17 09:30');

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
(2, 'Maria', 'Santos', 'Purok 2, Sampaguita', '09170000002', 'resident2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(3, 'Pedro', 'Gonzales', 'Blk 3 Lot 5, Sampaguita', '09170000006', 'resident3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(4, 'Lucia', 'Reyes', 'Purok 4, Sampaguita', '09170000007', 'resident4@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(5, 'Francisco', 'Hernandez', 'Blk 2 Lot 8, Sampaguita', '09170000008', 'resident5@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(6, 'Angela', 'Flores', 'Purok 1, Sampaguita', '09170000009', 'resident6@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(7, 'Diego', 'Moreno', 'Blk 4 Lot 1, Sampaguita', '09170000010', 'resident7@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(8, 'Isabel', 'Lopez', 'Purok 3, Sampaguita', '09170000011', 'resident8@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

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
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `document_requests`
--
ALTER TABLE `document_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
