package airlinemanagementsystem;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;
import java.util.Date;

public class BookFlight extends JFrame implements ActionListener {
    private JTextField tfaadhar; // Input field for Aadhar
    private JLabel tfname, tfnationality, tfaddress, labelgender, tfphone; // User detail labels
    private JButton bookFlightButton, fetchButton; // Action buttons
    private JTable flightsTable; // Table to display available flights
    private DefaultTableModel tableModel; // Model for the flights table
    private Connection connection; // Database connection

    public BookFlight() {
        // Establish the database connection
        DatabaseConnection dbConnection = new DatabaseConnection();
        connection = dbConnection.getConnection();
        
        setupUI();
        viewAvailableFlights(); // Automatically fetch flights when the form is opened
    }

    private void setupUI() {
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);

        // Heading
        JLabel heading = new JLabel("Book Flight");
        heading.setBounds(300, 20, 500, 35);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 28));
        heading.setForeground(new Color(0, 120, 215));
        add(heading);

        // Aadhar label and input
        addLabel("Aadhar", 60, 80);
        tfaadhar = new JTextField();
        tfaadhar.setBounds(220, 80, 150, 25);
        add(tfaadhar);

        // Fetch User button
        fetchButton = createButton("Fetch User", 380, 80);
        fetchButton.addActionListener(this);
        add(fetchButton);

        // User details labels
        tfname = createDetailLabel("Name", 130);
        tfnationality = createDetailLabel("Nationality", 180);
        tfaddress = createDetailLabel("Address", 230);
        labelgender = createDetailLabel("Gender", 280);
        tfphone = createDetailLabel("Phone", 330); // Added phone label

        // Book Flight button
        bookFlightButton = createButton("Book Flight", 220, 370);
        bookFlightButton.addActionListener(this);
        add(bookFlightButton);

        // Flights table setup
        String[] columnNames = { "Flight ID", "Flight Name", "Flight Number", "Departure", "Arrival", 
                                  "Travel Date", "Available Seats", "Price", "Journey Time", 
                                  "Arrival Date", "Departure Date" }; // Updated column names
        tableModel = new DefaultTableModel(columnNames, 0);
        flightsTable = new JTable(tableModel);
        flightsTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION); // Allow single selection
        JScrollPane scrollPane = new JScrollPane(flightsTable);
        scrollPane.setBounds(60, 410, 700, 150);
        add(scrollPane);

        // Frame settings
        setSize(800, 700);
        setLocation(200, 50);
        setVisible(true);
        getContentPane().setBackground(new Color(235, 245, 255));
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Close application on exit
    }

    private void addLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(label);
    }

    private JLabel createDetailLabel(String text, int y) {
        JLabel label = new JLabel();
        label.setBounds(220, y, 150, 25);
        addLabel(text, 60, y);
        add(label);
        return label;
    }

    private JButton createButton(String text, int x, int y) {
        JButton button = new JButton(text);
        button.setBackground(Color.BLACK);
        button.setForeground(Color.WHITE);
        button.setBounds(x, y, 120, 25);
        return button;
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == fetchButton) {
            fetchUserDetails();
        } else if (ae.getSource() == bookFlightButton) {
            bookFlight();
        }
    }

    private void fetchUserDetails() {
        String aadhar = tfaadhar.getText().trim();
        if (aadhar.isEmpty()) {
            showMessage("Please enter a valid Aadhar number.");
            return;
        }

        try {
            String query = "SELECT * FROM passenger WHERE aadhar = ?";
            PreparedStatement stmt = connection.prepareStatement(query);
            stmt.setString(1, aadhar);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                // Populate text fields with user data
                tfname.setText(rs.getString("name"));
                tfnationality.setText(rs.getString("nationality"));
                tfaddress.setText(rs.getString("address"));
                labelgender.setText(rs.getString("gender"));
                tfphone.setText(rs.getString("phone")); // Fetch and display phone number
            } else {
                showMessage("No user found with this Aadhar number.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            showMessage("Database error: " + e.getMessage());
        }
    }

    private void viewAvailableFlights() {
        tableModel.setRowCount(0); // Clear previous results

        try {
            String query = "SELECT * FROM flight"; // This will fetch all flights
            PreparedStatement stmt = connection.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                int flightId = rs.getInt("flight_id");
                String flightName = rs.getString("flight_name");
                String flightNumber = rs.getString("flight_number");
                String departure = rs.getString("departure");
                String arrival = rs.getString("arrival");
                Date travelDate = rs.getDate("travel_date");
                int availableSeats = rs.getInt("available_seats");
                double price = rs.getDouble("price");
                String journeyTime = rs.getString("journey_time");
                Date arrivalDate = rs.getDate("arrival_date");
                Date departureDate = rs.getDate("departure_date");

                // Add row to table
                tableModel.addRow(new Object[] { flightId, flightName, flightNumber, departure, arrival, 
                        travelDate, availableSeats, price, journeyTime, arrivalDate, departureDate });
            }
        } catch (SQLException e) {
            e.printStackTrace();
            showMessage("Database error: " + e.getMessage());
        }
    }

    private void bookFlight() {
        int selectedRow = flightsTable.getSelectedRow();
        if (selectedRow == -1) {
            showMessage("Please select a flight to book.");
            return;
        }

        // Get flight details from the selected row
        int flightId = (Integer) tableModel.getValueAt(selectedRow, 0);
        String flightName = (String) tableModel.getValueAt(selectedRow, 1);
        String departure = (String) tableModel.getValueAt(selectedRow, 3);
        String arrival = (String) tableModel.getValueAt(selectedRow, 4);
        String pnr = generatePNR(); // Generate a unique PNR

        // Debug: Check selected flight details
        System.out.println("Selected Flight ID: " + flightId + ", Flight Name: " + flightName);

        String aadhar = tfaadhar.getText().trim(); // Get the Aadhar number from the input field
        if (aadhar.isEmpty() || aadhar.length() != 12) {
            showMessage("Invalid Aadhar number.");
            return;
        }

        // Update available seats in the flight
        if (!updateAvailableSeats(flightId)) {
            showMessage("Booking failed. No available seats for the selected flight.");
            return;
        }

        // Insert booking into database
        if (insertBooking(flightId, flightName, departure, arrival, pnr)) {
            showMessage("Flight booked successfully! Your PNR is: " + pnr);
            viewAvailableFlights();
            dispose(); 
        } else {
            showMessage("Booking error occurred. Please check the database.");
        }
    }

    private boolean updateAvailableSeats(int flightId) {
        try {
            String updateQuery = "UPDATE flight SET available_seats = available_seats - 1 WHERE flight_id = ? AND available_seats > 0";
            PreparedStatement updateStmt = connection.prepareStatement(updateQuery);
            updateStmt.setInt(1, flightId);
            return updateStmt.executeUpdate() > 0; // Return true if the seats are updated
        } catch (SQLException e) {
            e.printStackTrace();
            showMessage("Database error: " + e.getMessage());
            return false;
        }
    }

    private boolean insertBooking(int flightId, String flightName, String departure, String arrival, String pnr) {
        try {
            String insertQuery = "INSERT INTO booking (flight_id, flight_name, departure, arrival, pnr_number, aadhar) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement insertStmt = connection.prepareStatement(insertQuery);
            insertStmt.setInt(1, flightId);
            insertStmt.setString(2, flightName);
            insertStmt.setString(3, departure);
            insertStmt.setString(4, arrival);
            insertStmt.setString(5, pnr);
            insertStmt.setString(6, tfaadhar.getText().trim());
            return insertStmt.executeUpdate() > 0; // Return true if the insert is successful
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generatePNR() {
        // Logic to generate a unique PNR (Passenger Name Record)
        return "PNR" + System.currentTimeMillis(); // Simple PNR generation using timestamp
    }


    private void showMessage(String message) {
        JOptionPane.showMessageDialog(this, message);
    }

    public static void main(String[] args) {
        new BookFlight();
    }
}
