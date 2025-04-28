-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wedding_invitation;

-- Use the database
USE wedding_invitation;

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_status (status)
);

-- Create messages table for guest messages/wishes
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_attending BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL
);

-- Create settings table for wedding details
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bride_name VARCHAR(255) NOT NULL,
    groom_name VARCHAR(255) NOT NULL,
    wedding_date DATETIME NOT NULL,
    akad_time VARCHAR(100),
    reception_time VARCHAR(100),
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_map_link TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (bride_name, groom_name, wedding_date, akad_time, reception_time, venue_name, venue_address)
VALUES ('Syahrina', 'Rival', '2023-12-31 08:00:00', '08:00 - 10:00 WIB', '11:00 - 14:00 WIB', 'Hotel Grand Ballroom', 'Jl. Contoh No. 123, Jakarta Selatan');

-- Sample data for guests
INSERT INTO guests (name, slug, status) VALUES
('Budi Santoso', 'budi-santoso', 'active'),
('Siti Nurhaliza', 'siti-nurhaliza', 'active'),
('Keluarga Ahmad', 'keluarga-ahmad', 'active'),
('Pak Direktur', 'pak-direktur', 'active'),
('Ibu Kepala Sekolah', 'ibu-kepala-sekolah', 'active');

-- Sample data for messages
INSERT INTO messages (guest_id, name, message, is_attending) VALUES
(1, 'Budi Santoso', 'Selamat atas pernikahan kalian! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.', TRUE),
(2, 'Siti Nurhaliza', 'Barakallahu laka wa baraka alaika wa jamaaa bainakumaa fii khair. Semoga Allah memberkahi kalian berdua dan menyatukan kalian dalam kebaikan.', TRUE),
(3, 'Ahmad', 'Mohon maaf kami tidak bisa hadir. Semoga pernikahan kalian diberkahi Allah SWT.', FALSE);
