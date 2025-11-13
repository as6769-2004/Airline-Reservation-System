# Database Setup Guide

## Quick Setup

### Step 1: Create Database and Tables

```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `airlinemanagement` database
- Create all 10 tables with proper relationships
- Set up foreign keys and indexes

### Step 2: Insert Sample Data

```bash
mysql -u root -p airlinemanagement < seed.sql
```

This will:
- Clear any existing data
- Insert 16 Indian airports
- Insert 8 aircraft types
- Insert 2 demo users
- Insert 4 sample passengers
- Insert 15 flights (IndiGo, Air India, SpiceJet, Vistara)
- Insert sample bookings, payments, baggage, and feedback

## Demo Login Credentials

### Customer Account
- Email: `demo@example.com`
- Password: `password`
- Username: `demo`
- Role: `customer`

### Admin Account
- Email: `admin@example.com`
- Password: `password`
- Username: `admin`
- Role: `admin`

## Database Structure

### Tables Created

1. **users** - User accounts and authentication
2. **airport** - Airport information (16 Indian airports)
3. **aircraft** - Aircraft types and specifications
4. **flight** - Flight schedules and pricing
5. **passenger** - Passenger information
6. **booking** - Flight bookings with PNR
7. **payment** - Payment records
8. **baggage** - Baggage information
9. **customer_feedback** - Reviews and ratings
10. **employee** - Employee records

## Sample Data Overview

### Airports (16)
- Delhi (DEL), Mumbai (BOM), Bangalore (BLR), Chennai (MAA)
- Hyderabad (HYD), Kolkata (CCU), Ahmedabad (AMD), Pune (PNQ)
- Goa (GOI), Kochi (COK), Trivandrum (TRV), Jaipur (JAI)
- Lucknow (LKO), Chandigarh (IXC), Nagpur (NAG), Bagdogra (IXB)

### Airlines
- **IndiGo** (6E) - Domestic flights
- **Air India** (AI) - Premium domestic/international
- **SpiceJet** (SG) - Budget flights
- **Vistara** (UK) - Full-service airline

### Flights (15 sample flights)
- Routes between major Indian cities
- Mix of morning and evening departures
- Prices range from ₹3,200 to ₹8,500
- Varying journey times (1h 10m to 2h 40m)

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;`
3. Verify credentials in `lib/db.js`

### Duplicate Entry Errors
If you see duplicate entry errors:
- Drop database and recreate: `DROP DATABASE airlinemanagement;`
- Run setup again

### Foreign Key Errors
If foreign keys cause issues:
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Your inserts here
SET FOREIGN_KEY_CHECKS = 1;
```

## Verifying Setup

After running both SQL files, verify with:

```sql
USE airlinemanagement;

-- Check table counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'airport', COUNT(*) FROM airport
UNION ALL SELECT 'aircraft', COUNT(*) FROM aircraft
UNION ALL SELECT 'flight', COUNT(*) FROM flight
UNION ALL SELECT 'passenger', COUNT(*) FROM passenger
UNION ALL SELECT 'booking', COUNT(*) FROM booking;
```

Expected results:
- users: 2
- airport: 16
- aircraft: 8
- flight: 15
- passenger: 4
- booking: 4

## Reset Database

To completely reset the database:

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS airlinemanagement;"
mysql -u root -p < schema.sql
mysql -u root -p airlinemanagement < seed.sql
```

## Environment Variables

Configure database connection in `.env.local`:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=airlinemanagement
JWT_SECRET=your_secure_secret_key
```

Or edit `lib/db.js` directly:

```javascript
host: process.env.MYSQL_HOST || 'localhost',
user: process.env.MYSQL_USER || 'root',
password: process.env.MYSQL_PASSWORD || 'your_password',
database: process.env.MYSQL_DATABASE || 'airlinemanagement',
```

## Next Steps

After database setup:
1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Login with demo credentials
4. Start booking flights!

---

For more details, see README.md and SETUP.md

