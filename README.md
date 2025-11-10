# Airline Management System

A complete airline management system built with Next.js, MySQL, and Tailwind CSS featuring flight booking, user management, and admin functionality.

## Features

### For Customers
- ✅ Search flights by source, destination, and date
- ✅ Book flights with multiple passengers
- ✅ View booking history
- ✅ Cancel bookings
- ✅ Update profile information
- ✅ Beautiful, responsive UI/UX

### For Admins
- ✅ Admin dashboard with analytics
- ✅ Manage flights (Add/Update/Delete)
- ✅ View all bookings and passengers
- ✅ System statistics (revenue, bookings, flights)

### Technical Features
- ✅ JWT-based authentication with cookies
- ✅ Session caching with localStorage
- ✅ RESTful API routes
- ✅ MySQL database with proper schema
- ✅ Indian airline data (IndiGo, Air India, SpiceJet, Vistara)
- ✅ Indian airports (Delhi, Mumbai, Bangalore, Chennai, etc.)
- ✅ Modern UI with Tailwind CSS
- ✅ Responsive design

## Tech Stack

- **Frontend**: Next.js 14 (JavaScript), React 18
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT + Cookies
- **ORM**: mysql2

## Prerequisites

- Node.js 18+ and npm
- MySQL 5.7+ or 8.0+
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Airline-Reservation-NextJs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MySQL Database**
   
   Create a MySQL database and configure connection in `lib/db.js`:
   
   ```javascript
   host: process.env.MYSQL_HOST || 'localhost',
   user: process.env.MYSQL_USER || 'root',
   password: process.env.MYSQL_PASSWORD || 'your_password',
   database: process.env.MYSQL_DATABASE || 'airlinemanagement',
   ```

4. **Run SQL Schema**
   
   Import the schema and seed data:
   
   ```bash
   mysql -u root -p < schema.sql
   mysql -u root -p airlinemanagement < seed.sql
   ```

   Or using MySQL CLI:
   ```bash
   mysql -u root -p
   source schema.sql;
   source seed.sql;
   ```

5. **Environment Variables** (Optional)
   
   Create a `.env.local` file:
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=airlinemanagement
   JWT_SECRET=your_secret_key_here
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

### Customer Account
- Email: demo@example.com
- Password: password

### Admin Account
- Email: admin@example.com
- Password: password

## Project Structure

```
Airline-Reservation-NextJs/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── bookings/        # Booking endpoints
│   │   ├── flights/         # Flight endpoints
│   │   └── airports/        # Airport endpoints
│   ├── bookings/            # Bookings page
│   ├── dashboard/           # Admin dashboard
│   ├── flights/             # Flights management
│   ├── profile/             # User profile
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── page.js              # Home page with flight search
├── components/
│   ├── Navbar.js            # Navigation bar
│   ├── FlightSearch.js      # Flight search component
│   ├── Footer.js            # Footer component
│   └── flights/
│       └── FlightManager.js # Flight management (admin)
├── lib/
│   ├── db.js                # Database connection
│   ├── auth.js              # Auth context provider
│   ├── session.js           # Session management
│   └── cache.js             # Cache utilities
├── schema.sql               # Database schema
└── seed.sql                 # Sample data

```

## Key Features Implementation

### Authentication
- JWT tokens stored in HTTP-only cookies
- Session caching with localStorage for quick UI updates
- Protected routes using server-side verification
- Role-based access control (Admin vs Customer)

### Flight Booking
- Real-time seat availability check
- Multiple passengers support
- Automatic PNR generation
- Seat assignment
- Total amount calculation

### Admin Features
- Dashboard with analytics
- Flight CRUD operations
- Passenger management
- Booking overview

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user

### Flights
- `GET /api/flights` - List all flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/[id]` - Get flight details
- `POST /api/flights` - Create flight (admin)
- `DELETE /api/flights/[id]` - Delete flight (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/[id]` - Update booking status
- `GET /api/bookings/[id]` - Get booking details

### Airports
- `GET /api/airports` - List all airports
- `GET /api/airports/suggest` - Airport suggestions
- `POST /api/airports` - Create airport (admin)

## Database Schema

- **users**: User accounts and authentication
- **airport**: Airport information
- **aircraft**: Aircraft details
- **flight**: Flight schedules and pricing
- **passenger**: Passenger information
- **booking**: Flight bookings
- **payment**: Payment records
- **baggage**: Baggage information
- **customer_feedback**: Customer reviews
- **employee**: Employee records

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Future Enhancements

- [ ] Seat selection UI
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Flight status updates
- [ ] Mobile app
- [ ] Print tickets
- [ ] Loyalty program

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please create an issue in the repository.

---

Built with ❤️ using Next.js

