package airlinemanagementsystem;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;


public class BookFlight extends JFrame implements ActionListener {
    private JTextField tfaadhar;
    private JLabel tfname, tfnationality, tfaddress, labelgender, tfphone;
    private JButton bookFlightButton, fetchButton;
    private JTable flightsTable;
    private DefaultTableModel tableModel;
    private Connection connection;
    private int passengerId = -1;

    public BookFlight() {
        DatabaseConnection dbConnection = new DatabaseConnection();
        connection = dbConnection.getConnection();

        setupUI();
        viewAvailableFlights();
    }

    private void setupUI() {
        getContentPane().setBackground(new Color(235, 245, 255));
        setLayout(null);

        setExtendedState(JFrame.MAXIMIZED_BOTH); // Fullscreen

        JLabel heading = new JLabel("Book Flight");
        heading.setBounds(700, 20, 500, 35);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 32));
        heading.setForeground(new Color(0, 120, 215));
        add(heading);

        addLabel("Aadhar", 60, 80);
        tfaadhar = new JTextField();
        tfaadhar.setBounds(220, 80, 200, 30);
        add(tfaadhar);

        fetchButton = createButton("Fetch User", 440, 80);
        fetchButton.addActionListener(this);
        add(fetchButton);

        tfname = createDetailLabel("Name", 130);
        tfnationality = createDetailLabel("Nationality", 180);
        tfaddress = createDetailLabel("Address", 230);
        labelgender = createDetailLabel("Gender", 280);
        tfphone = createDetailLabel("Phone", 330);

        bookFlightButton = createButton("Book Flight", 220, 380);
        bookFlightButton.addActionListener(this);
        add(bookFlightButton);

        String[] columnNames = {
            "Flight ID", "Flight Name", "Flight Number", "Departure Airport ID", "Arrival Airport ID",
            "Travel Date", "Available Seats", "Price", "Journey Time", "Arrival Date", "Departure Date"
        };
        tableModel = new DefaultTableModel(columnNames, 0);
        flightsTable = new JTable(tableModel);
        flightsTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        JScrollPane scrollPane = new JScrollPane(flightsTable);
        scrollPane.setBounds(60, 440, 1400, 300);
        add(scrollPane);

        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setVisible(true);
    }

    private void addLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Tahoma", Font.PLAIN, 16));
        add(label);
    }

    private JLabel createDetailLabel(String text, int y) {
        JLabel label = new JLabel();
        label.setBounds(220, y, 250, 25);
        addLabel(text, 60, y);
        add(label);
        return label;
    }

    private JButton createButton(String text, int x, int y) {
        JButton button = new JButton(text);
        button.setBackground(Color.BLACK);
        button.setForeground(Color.WHITE);
        button.setBounds(x, y, 150, 30);
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
                passengerId = rs.getInt("passenger_id");
                tfname.setText(rs.getString("name"));
                tfnationality.setText(rs.getString("nationality"));
                tfaddress.setText(rs.getString("address"));
                labelgender.setText(rs.getString("gender"));
                tfphone.setText(rs.getString("phone"));
            } else {
                showMessage("No user found with this Aadhar number.");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            showMessage("Database error: " + e.getMessage());
        }
    }

    private void viewAvailableFlights() {
        tableModel.setRowCount(0);
        try {
            String query = "SELECT * FROM flight";
            PreparedStatement stmt = connection.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                tableModel.addRow(new Object[] {
                    rs.getInt("flight_id"),
                    rs.getString("flight_name"),
                    rs.getString("flight_number"),
                    rs.getInt("departure_airport_id"),
                    rs.getInt("arrival_airport_id"),
                    rs.getDate("travel_date"),
                    rs.getInt("available_seats"),
                    rs.getDouble("price"),
                    rs.getString("journey_time"),
                    rs.getDate("arrival_date"),
                    rs.getDate("departure_date")
                });
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

        if (passengerId == -1) {
            showMessage("Please fetch passenger details first.");
            return;
        }

        int flightId = (Integer) tableModel.getValueAt(selectedRow, 0);
        
        String pnr = generatePNR();
        String seatNumber = generateSeatNumber();

        if (!updateAvailableSeats(flightId)) {
            showMessage("Booking failed. No available seats for the selected flight.");
            return;
        }

        if (insertBooking(flightId, pnr, seatNumber)) {
            showMessage("Flight booked successfully! Your PNR is: " + pnr);
            viewAvailableFlights();
            dispose();
        } else {
            showMessage("Booking error occurred.");
        }
    }

    private boolean updateAvailableSeats(int flightId) {
        try {
            String query = "UPDATE flight SET available_seats = available_seats - 1 WHERE flight_id = ? AND available_seats > 0";
            PreparedStatement stmt = connection.prepareStatement(query);
            stmt.setInt(1, flightId);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            showMessage("Database error: " + e.getMessage());
            return false;
        }
    }

    private boolean insertBooking(int flightId, String pnr, String seatNumber) {
        try {
            String insertQuery = "INSERT INTO booking (flight_id, passenger_id, pnr_number, seat_number) VALUES (?, ?, ?, ?)";
            PreparedStatement stmt = connection.prepareStatement(insertQuery);
            stmt.setInt(1, flightId);
            stmt.setInt(2, passengerId);
            stmt.setString(3, pnr);
            stmt.setString(4, seatNumber);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generatePNR() {
        return "PNR" + System.currentTimeMillis();
    }

    private String generateSeatNumber() {
        return "S" + ((int)(Math.random() * 100) + 1);
    }

    private void showMessage(String message) {
        JOptionPane.showMessageDialog(this, message);
    }

    public static void main(String[] args) {
        new BookFlight();
    }
}
