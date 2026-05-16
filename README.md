# BarangayLink - Barangay Management System

A web-based integrated management information system for barangay operations and verified local services.

## Setup Instructions

### Prerequisites
- PHP 7.4+
- MySQL/MariaDB
- Laragon or similar local server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BarangayLink.git
   cd BarangayLink
   ```

2. **Create `.env` file from template**
   ```bash
   cp .env .env.local
   ```

3. **Configure `.env` with your SMTP credentials**
   - Edit `.env` and add your email provider settings:
     - `PHPMAILER_HOST`: Your SMTP server (e.g., `smtp.gmail.com`)
     - `PHPMAILER_PORT`: SMTP port (typically 587 for TLS)
     - `PHPMAILER_USERNAME`: Your email address
     - `PHPMAILER_PASSWORD`: App-specific password (never your main password)
     - `PHPMAILER_FROM_EMAIL`: Sender email address
     - `PHPMAILER_FROM_NAME`: Sender display name
   - For Gmail: [Generate an App-Specific Password](https://myaccount.google.com/apppasswords) (not your regular password)
   - **Never commit `.env` - it contains secrets!**

4. **Import database**
   ```bash
   mysql -u root barangay_system < barangay_system.sql
   ```
   This automatically creates the `barangay_system` database with all tables and seed data.

5. **Start local server**
   - Use Laragon or your preferred local server
   - Navigate to `http://localhost/BarangayLink`

### Sample Login Credentials (from seed data)

**Resident Account:**
- Email: `resident1@example.com`
- Password: `password`

**Official Account:**
- Email: `official1@example.com`
- Password: `password`

## Security Notes

- **Never commit `.env`** - it's in `.gitignore`
- **Never hardcode credentials** in PHP files
- Change sample passwords before production use
- Rotate Gmail App Password periodically
- Use environment-specific credentials for production
- Always validate user input and use prepared statements (already implemented)
- Keep PHP and dependencies updated for security patches

## Features

- Document request management
- Barangay announcements
- Local services directory
- Complaint portal
- Email notifications
- Resident dashboard

## License

For presentation purposes only.
