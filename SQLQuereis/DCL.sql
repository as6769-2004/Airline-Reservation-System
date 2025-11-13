USE airlinemanagement;

-- STEP 1: Check if user already exists (BEFORE creation)
SELECT user, host FROM mysql.user WHERE user = 'customer_user';


-- STEP 3: Confirm user no longer exists
SELECT user, host FROM mysql.user WHERE user = 'customer_user';

-- Show current privileges BEFORE GRANT
SHOW GRANTS FOR 'customer_user'@'localhost';

-- STEP 5: GRANT SELECT permissions on specific tables
GRANT SELECT ON airlinemanagement.flight TO 'customer_user'@'localhost';
GRANT SELECT ON airlinemanagement.airport TO 'customer_user'@'localhost';
GRANT SELECT ON airlinemanagement.booking TO 'customer_user'@'localhost';

-- Apply all changes
FLUSH PRIVILEGES;

-- STEP 6: Check privileges AFTER GRANT
SHOW GRANTS FOR 'customer_user'@'localhost';

-- STEP 7: Demonstrate REVOKE (Remove access)
REVOKE SELECT ON airlinemanagement.flight FROM 'customer_user'@'localhost';
REVOKE SELECT ON airlinemanagement.airport FROM 'customer_user'@'localhost';
REVOKE SELECT ON airlinemanagement.booking FROM 'customer_user'@'localhost';

-- Apply changes again
FLUSH PRIVILEGES;

-- STEP 8: Show privileges AFTER REVOKE
SHOW GRANTS FOR 'customer_user'@'localhost';
