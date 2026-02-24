# SHIKARA LAB - Post-Lab Learning Support System

A comprehensive learning management system for school students with advanced admin panel and user tracking capabilities.

## Features

### 🎓 For Students
- **User Registration & Authentication**: Create account with student details
- **Personalized Dashboard**: View your learning progress and information
- **Class-based Organization**: Primary (1-5), Middle (6-8), Secondary (9-10)
- **Virtual Labs**: Access interactive science experiments
- **Study Materials**: Comprehensive learning resources
- **Practice Tests**: Quiz yourself on various topics

### 👨‍💼 For Administrators
- **Complete Admin Panel**: Full control and monitoring capabilities
- **User Management**: View all registered students and their details
- **Login Session Tracking**: Monitor all login activities from any device
- **Device Detection**: Automatic detection of device type (Desktop, Mobile, iPhone, iPad, Android)
- **Browser Detection**: Track which browser users are accessing from
- **Real-time Statistics**: 
  - Total users count
  - Total login sessions
  - Class-wise student distribution
  - Registration and login timestamps

## Default Admin Access

**Username**: `admin`  
**Password**: `admin123`

## How It Works

### User Registration
When a user signs up, the system stores:
- Full Name
- Student ID
- Email Address
- Password (stored securely)
- Class Level
- Registration Date & Time

### Login Session Tracking
Every time someone logs in from any device, the system automatically records:
- User Information (Name, Email)
- Device Type (Desktop/Mobile/Tablet)
- Browser Information (Chrome, Safari, Firefox, etc.)
- Login Date & Time
- IP Address (placeholder in demo)

### Data Storage
All data is stored in the browser's `localStorage`:
- **users**: All registered user accounts
- **passwords**: User credentials (encrypted in production)
- **loginSessions**: Complete login history
- **currentUser**: Active session information

### Admin Panel Features

#### 📊 Dashboard Statistics
- Total Users Count
- Total Login Sessions
- Primary Students (Grades 1-5)
- Middle School Students (Grades 6-8)
- Secondary Students (Grades 9-10)

#### 👥 Users Table
View detailed information about all registered users:
- Student Name & Email
- Student ID (unique identifier)
- Class Level
- Role (Student/Admin)
- Registration Date
- Last Login Date & Time

#### 🔐 Login Sessions Table
Monitor all login activities:
- User who logged in
- Device used (with icons)
- Browser used
- Login timestamp
- IP Address

## Technology Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Spline** - 3D Graphics

## Getting Started

1. **Open the Application**
   - Visit the homepage to see the hero section

2. **Create an Account**
   - Click "Start Learning"
   - Choose "Sign up here"
   - Fill in all required information
   - Select your class level
   - Create a password (min 6 characters)

3. **Login**
   - Use your email or Student ID
   - Enter your password
   - Access your personalized dashboard

4. **Admin Access**
   - Login with `admin` / `admin123`
   - Click "Admin Panel" button
   - View all users and login sessions

## Device & Browser Detection

The system automatically detects:
- **Devices**: Desktop, Laptop, iPhone, iPad, Android, Mobile
- **Browsers**: Chrome, Safari, Firefox, Edge, Opera

## Data Privacy

- All data is stored locally in browser storage
- No external servers or databases
- Data persists across sessions
- Clear browser data to reset everything

## Future Enhancements

- Export data to CSV/Excel
- Email notifications
- Advanced filtering and search
- User activity analytics
- Real IP address detection
- User role permissions
- Content management system
- Interactive virtual lab simulations

## Support

For admin access or any issues, contact your system administrator.

---

**Built with ❤️ for SHIKARA LAB**  
*First Semester Project • For School Students*
