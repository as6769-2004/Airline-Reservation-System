package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.sql.*;
import java.awt.event.*;

public class Cancel extends JFrame implements ActionListener {

    JLabel imageLabel;
    JTextField tfpnr, tfaadhar; // Fields for PNR and Aadhar
    JLabel tfname, cancellationno, lblFlightCode, lblFlightCodeValue, lbldateoftravel, lblTravelDateValue;
    JLabel lblArrivalDate, lblArrivalPlace, lblDepartureDate, lblDeparturePlace, lblPrice;
    JLabel lblJourneyTime, lblFlightNumber, lblGender, lblPhone, lblNationality;
    JButton fetchButton, flight;

    public Cancel() {
        // Set the frame properties
        setTitle("Cancellation System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        getContentPane().setBackground(new Color(235, 245, 255));
        setLayout(null);

        // Load the image
        ImageIcon imageIcon = new ImageIcon(
                "C:\\Users\\ASUS\\Desktop\\New 2.0\\airlinemanagementsystem\\icons\\cancel.png"); // Replace with your
                                                                                                  // image path
        Image image = imageIcon.getImage().getScaledInstance(250, 250, Image.SCALE_SMOOTH); // Resize if needed
        imageIcon = new ImageIcon(image);

        // Add the image label
        imageLabel = new JLabel(imageIcon);
        imageLabel.setBounds(420, 250, 250, 250); // Position on the center-left
        add(imageLabel);

        // Heading
        JLabel heading = new JLabel("CANCELLATION");
        heading.setBounds(250, 20, 300, 35);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 28));
        heading.setForeground(new Color(0, 120, 215));
        add(heading);

        // Aadhar Number
        JLabel lblaadhar = createLabel("Aadhar Number", 60, 80);
        add(lblaadhar);

        tfaadhar = createTextField(220, 80);
        add(tfaadhar);

        // PNR Number
        JLabel lblpnr = createLabel("PNR Number", 60, 130);
        add(lblpnr);

        tfpnr = createTextField(220, 130);
        add(tfpnr);

        // Show Details Button
        fetchButton = createButton("Show Details", 380, 130);
        fetchButton.addActionListener(this);
        add(fetchButton);

        // Labels for fetched details
        JLabel lblName = createLabel("Passenger Name:", 60, 180);
        add(lblName);

        tfname = new JLabel();
        tfname.setBounds(220, 180, 150, 25);
        add(tfname);

        // Flight Code Label and Value
        lblFlightCode = new JLabel("Flight Code:");
        lblFlightCode.setBounds(60, 210, 150, 25);
        lblFlightCode.setFont(new Font("Arial", Font.PLAIN, 16));
        lblFlightCode.setForeground(new Color(0, 51, 102)); // Blue color for label
        add(lblFlightCode);

        lblFlightCodeValue = new JLabel();
        lblFlightCodeValue.setBounds(220, 210, 150, 25);
        lblFlightCodeValue.setForeground(Color.BLACK); // Black color for value
        add(lblFlightCodeValue);

        // Travel Date Label and Value
        lbldateoftravel = new JLabel("Travel Date:");
        lbldateoftravel.setBounds(60, 240, 150, 25);
        lbldateoftravel.setFont(new Font("Arial", Font.PLAIN, 16));
        lbldateoftravel.setForeground(new Color(0, 51, 102)); // Blue color for label
        add(lbldateoftravel);

        lblTravelDateValue = new JLabel();
        lblTravelDateValue.setBounds(220, 240, 150, 25);
        lblTravelDateValue.setForeground(Color.BLACK); // Black color for value
        add(lblTravelDateValue);

        // New labels for additional details
        addDetailLabel("Arrival Date:", 60, 270);
        lblArrivalDate = new JLabel();
        lblArrivalDate.setBounds(220, 270, 150, 25);
        lblArrivalDate.setForeground(Color.BLACK);
        add(lblArrivalDate);

        addDetailLabel("Arrival Place:", 60, 300);
        lblArrivalPlace = new JLabel();
        lblArrivalPlace.setBounds(220, 300, 150, 25);
        lblArrivalPlace.setForeground(Color.BLACK);
        add(lblArrivalPlace);

        addDetailLabel("Departure Date:", 60, 330);
        lblDepartureDate = new JLabel();
        lblDepartureDate.setBounds(220, 330, 150, 25);
        lblDepartureDate.setForeground(Color.BLACK);
        add(lblDepartureDate);

        addDetailLabel("Departure Place:", 60, 360);
        lblDeparturePlace = new JLabel();
        lblDeparturePlace.setBounds(220, 360, 150, 25);
        lblDeparturePlace.setForeground(Color.BLACK);
        add(lblDeparturePlace);

        addDetailLabel("Price:", 60, 390);
        lblPrice = new JLabel();
        lblPrice.setBounds(220, 390, 150, 25);
        lblPrice.setForeground(Color.BLACK);
        add(lblPrice);

        addDetailLabel("Journey Time:", 60, 420);
        lblJourneyTime = new JLabel();
        lblJourneyTime.setBounds(220, 420, 150, 25);
        lblJourneyTime.setForeground(Color.BLACK);
        add(lblJourneyTime);

        addDetailLabel("Flight Number:", 60, 450);
        lblFlightNumber = new JLabel();
        lblFlightNumber.setBounds(220, 450, 150, 25);
        lblFlightNumber.setForeground(Color.BLACK);
        add(lblFlightNumber);

        addDetailLabel("Gender:", 60, 480);
        lblGender = new JLabel();
        lblGender.setBounds(220, 480, 150, 25);
        lblGender.setForeground(Color.BLACK);
        add(lblGender);

        addDetailLabel("Phone:", 60, 510);
        lblPhone = new JLabel();
        lblPhone.setBounds(220, 510, 150, 25);
        lblPhone.setForeground(Color.BLACK);
        add(lblPhone);

        addDetailLabel("Nationality:", 60, 540);
        lblNationality = new JLabel();
        lblNationality.setBounds(220, 540, 150, 25);
        lblNationality.setForeground(Color.BLACK);
        add(lblNationality);

        cancellationno = new JLabel("Cancellation Number: " + (123 + 1000));
        cancellationno.setBounds(60, 570, 250, 25);
        add(cancellationno);

        // Cancel Button
        flight = createButton("Cancel", 220, 610);
        flight.addActionListener(this);
        flight.setEnabled(false); // Initially disabled
        add(flight);

        // Frame settings
        setSize(800, 700);
        setLocation(350, 150);
        setVisible(true);
    }

    // Method to create JLabels with custom styles
    private JLabel createLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setForeground(new Color(0, 51, 102));
        return label;
    }

    // Method to create JTextFields with custom styles
    private JTextField createTextField(int x, int y) {
        JTextField textField = new JTextField();
        textField.setBounds(x, y, 150, 25);
        textField.setBorder(BorderFactory.createLineBorder(new Color(0, 51, 102), 2));
        textField.setFont(new Font("Arial", Font.PLAIN, 14));
        return textField;
    }

    // Method to create JButtons with custom styles
    private JButton createButton(String text, int x, int y) {
        JButton button = new JButton(text);
        button.setBounds(x, y, 120, 25);
        button.setBackground(new Color(0, 51, 102));
        button.setForeground(Color.WHITE);
        button.setFont(new Font("Arial", Font.BOLD, 14));
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createLineBorder(Color.WHITE, 2));
        button.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        return button;
    }

    // Method to add detail labels
    private void addDetailLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setForeground(new Color(0, 51, 102)); // Blue color for label
        add(label);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == fetchButton) {
            String pnr = tfpnr.getText();
            String aadhar = tfaadhar.getText();

            try {
                DatabaseConnection dbConnection = new DatabaseConnection();
                Connection conn = dbConnection.getConnection();

                // SQL query to fetch details
                String query = "SELECT b.aadhar, f.flight_name, b.booking_date, "
                        + "f.flight_id, f.flight_number, "
                        + "f.departure, f.arrival, "
                        + "f.price, f.journey_time, "
                        + "f.departure_date, f.arrival_date, "
                        + "p.name, p.nationality, p.address, p.gender, p.phone "
                        + "FROM booking b "
                        + "JOIN flight f ON b.flight_id = f.flight_id "
                        + "JOIN passenger p ON b.aadhar = p.aadhar "
                        + "WHERE b.pnr_number = ? AND b.aadhar = ?";
                PreparedStatement ps = conn.prepareStatement(query);
                ps.setString(1, pnr);
                ps.setString(2, aadhar);
                ResultSet rs = ps.executeQuery();

                if (rs.next()) {
                    tfname.setText(rs.getString("name"));
                    lblFlightCodeValue.setText(rs.getString("flight_name"));
                    lblTravelDateValue.setText(rs.getString("booking_date"));
                    lblArrivalDate.setText(rs.getString("arrival_date"));
                    lblDepartureDate.setText(rs.getString("departure_date"));
                    lblArrivalPlace.setText(rs.getString("arrival"));
                    lblDeparturePlace.setText(rs.getString("departure"));
                    lblPrice.setText(rs.getString("price"));
                    lblJourneyTime.setText(rs.getString("journey_time"));
                    lblFlightNumber.setText(rs.getString("flight_number"));
                    lblGender.setText(rs.getString("gender"));
                    lblPhone.setText(rs.getString("phone"));
                    lblNationality.setText(rs.getString("nationality"));

                    flight.setEnabled(true); // Enable the cancel button
                } else {
                    JOptionPane.showMessageDialog(this, "No Record Found", "Error", JOptionPane.ERROR_MESSAGE);
                }

                // Close resources
                rs.close();
                ps.close();
                conn.close();

            } catch (SQLException e) {
                e.printStackTrace();
            }

        } else if (ae.getSource() == flight) {
            // Code to cancel the booking goes here
            // E.g., deleting the record from the database

            // Show cancellation success message
            JOptionPane.showMessageDialog(this, "Booking Cancelled Successfully", "Success",
                    JOptionPane.INFORMATION_MESSAGE);
            // Clear fields or reset UI as needed
        }
    }

    public static void main(String[] args) {
        new Cancel();
    }
}
