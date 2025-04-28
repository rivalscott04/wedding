# Database Setup Instructions

This directory contains the database schema and setup instructions for the wedding invitation application.

## MySQL Setup

### Prerequisites
- MySQL Server 5.7+ or MariaDB 10.2+
- MySQL client or phpMyAdmin for database management

### Setup Steps

1. **Create the database and tables**

   You can use the provided `schema.sql` file to create the database structure:

   ```bash
   mysql -u your_username -p < schema.sql
   ```

   Or you can run the SQL commands directly in your MySQL client or phpMyAdmin.

2. **Configure the application to connect to your database**

   Create a `.env` file in the root of your project with the following variables:

   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=wedding_invitation
   DB_PORT=3306
   ```

## Database Schema

### Guests Table
Stores information about wedding guests.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(255) | Guest name |
| slug | VARCHAR(255) | URL-friendly version of name |
| status | ENUM('active', 'inactive') | Guest status |
| attended | BOOLEAN | Whether the guest attended |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

### Messages Table
Stores messages and wishes from guests.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| guest_id | INT | Foreign key to guests table |
| name | VARCHAR(255) | Name of person leaving message |
| message | TEXT | The message content |
| is_attending | BOOLEAN | RSVP status |
| created_at | TIMESTAMP | Record creation time |

### Settings Table
Stores wedding details and configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| bride_name | VARCHAR(255) | Bride's name |
| groom_name | VARCHAR(255) | Groom's name |
| wedding_date | DATETIME | Date and time of wedding |
| akad_time | VARCHAR(100) | Time of akad ceremony |
| reception_time | VARCHAR(100) | Time of reception |
| venue_name | VARCHAR(255) | Venue name |
| venue_address | TEXT | Venue address |
| venue_map_link | TEXT | Google Maps link |
| updated_at | TIMESTAMP | Record update time |

## Setting up MySQL Connection

To connect your application to MySQL:

1. Install the MySQL client for Node.js:
   ```bash
   npm install mysql2
   ```

2. Create a database connection utility in `src/lib/db.ts`:
   ```typescript
   import mysql from 'mysql2/promise';

   export async function getConnection() {
     return mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       port: Number(process.env.DB_PORT) || 3306
     });
   }
   ```

3. Update the API services to use this MySQL connection.

## Backup and Restore

### Backup
```bash
mysqldump -u your_username -p wedding_invitation > backup.sql
```

### Restore
```bash
mysql -u your_username -p wedding_invitation < backup.sql
```
