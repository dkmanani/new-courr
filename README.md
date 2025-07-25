# CourierPro - PHP Courier Management System

A complete courier management system built with PHP, MySQL, HTML5, CSS3, and JavaScript. Fully responsive and optimized for Hostinger hosting.

## Features

### For Customers
- **Package Tracking**: Real-time tracking with courier ID
- **Contact Form**: Direct communication with support
- **Responsive Design**: Works on all devices
- **Service Information**: Local, state-wide, and international delivery options

### For Agents
- **Add Couriers**: Complete courier management with auto-generated IDs
- **Update Tracking**: Real-time status updates
- **Delivery Completion**: Photo verification with customer notes
- **Performance Stats**: Revenue and delivery tracking
- **Receipt Generation**: Automatic receipt downloads

### For Admins
- **Dashboard Overview**: Complete system statistics
- **Courier Management**: View and update all couriers
- **Agent Management**: Add and manage delivery agents
- **Delivery Verification**: View delivery selfies and notes
- **Analytics**: Daily and monthly performance reports
- **Data Export**: JSON export functionality

## Installation Instructions for Hostinger

### 1. Database Setup
1. Login to your Hostinger control panel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database named `courierpro`
4. Create a database user and assign it to the database
5. Import the `database.sql` file using phpMyAdmin

### 2. File Upload
1. Upload all files to your domain's `public_html` folder
2. Ensure the `uploads/selfies/` directory has write permissions (755)

### 3. Configuration
1. Edit `config/database.php` with your Hostinger database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_username');
   define('DB_PASS', 'your_database_password');
   ```

### 4. Default Login Credentials

**Admin Login:**
- Username: `admin`
- Password: `password` (Change this immediately after first login)

**Agent Login:**
- Agent ID: `agent`
- Password: `password` (Change this immediately after first login)

## File Structure

```
/
├── config/
│   └── database.php          # Database configuration
├── includes/
│   └── functions.php         # Core PHP functions
├── admin/
│   ├── login.php            # Admin login page
│   ├── dashboard.php        # Admin dashboard
│   └── logout.php           # Admin logout
├── agent/
│   ├── login.php            # Agent login page
│   ├── dashboard.php        # Agent dashboard
│   └── logout.php           # Agent logout
├── assets/
│   ├── css/
│   │   ├── style.css        # Main stylesheet
│   │   ├── auth.css         # Authentication pages
│   │   └── dashboard.css    # Dashboard styles
│   └── js/
│       ├── main.js          # Main JavaScript
│       ├── dashboard.js     # Admin dashboard JS
│       └── agent-dashboard.js # Agent dashboard JS
├── uploads/
│   └── selfies/             # Delivery selfie uploads
├── database.sql             # Database schema
├── index.php               # Homepage
└── README.md               # This file
```

## Database Schema

### Tables
- **admins**: Admin user accounts
- **agents**: Delivery agent accounts
- **couriers**: Courier/package information
- **delivery_selfies**: Delivery verification photos
- **contact_messages**: Customer contact form submissions

## Security Features

- **Password Hashing**: All passwords are hashed using PHP's `password_hash()`
- **SQL Injection Protection**: All queries use prepared statements
- **XSS Protection**: All user inputs are sanitized
- **File Upload Security**: Image-only uploads with size restrictions
- **Session Management**: Secure session handling
- **Directory Protection**: `.htaccess` files protect sensitive directories

## Responsive Design

The system is fully responsive and works perfectly on:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Compact design with essential features

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Optimized CSS**: Minified and efficient stylesheets
- **Lazy Loading**: Images load as needed
- **Efficient Queries**: Optimized database queries
- **Caching**: Browser caching for static assets

## Customization

### Colors and Branding
Edit the CSS variables in `assets/css/style.css` to match your brand colors.

### City Rates
Update the `calculateCourierAmount()` function in `includes/functions.php` to modify pricing.

### Email Configuration
Add SMTP configuration in `includes/functions.php` for email notifications.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `config/database.php`
   - Ensure database exists and user has proper permissions

2. **File Upload Issues**
   - Check `uploads/selfies/` directory permissions (755)
   - Verify PHP upload settings in hosting control panel

3. **Login Issues**
   - Clear browser cache and cookies
   - Check database for user accounts
   - Verify password hashing

### Support

For technical support or customization requests, please contact your development team.

## License

This project is proprietary software. All rights reserved.

## Version History

- **v1.0.0**: Initial release with full courier management features
- Responsive design for all devices
- Complete admin and agent dashboards
- Secure authentication system
- File upload functionality
- Export capabilities

---

**Note**: Remember to change default passwords and update database credentials before going live!