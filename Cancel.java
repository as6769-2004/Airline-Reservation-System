package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.sql.*;
import java.awt.event.*;

public class Cancel extends JFrame implements ActionListener {

    JTextField tfpnr, tfaadhar;
    JLabel tfname, cancellationno, lblFlightCodeValue, lblTravelDateValue;
    JLabel lblArrivalDate, lblArrivalPlace, lblDepartureDate, lblDeparturePlace, lblPrice;
    JLabel lblJourneyTime, lblFlightNumber, lblGender, lblPhone, lblNationality;
    JButton fetchButton, flight;

    public Cancel() {
        setTitle("Cancellation System");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        getContentPane().setBackground(new Color(235, 245, 255));
        setLayout(null);

        JLabel heading = new JLabel("CANCELLATION");
        heading.setBounds(380, 20, 400, 40);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 32));
        heading.setForeground(new Color(0, 120, 215));
        add(heading);

        add(createLabel("Aadhar Number:", 60, 100));
        tfaadhar = createTextField(220, 100);
        add(tfaadhar);

        add(createLabel("PNR Number:", 500, 100));
        tfpnr = createTextField(660, 100);
        add(tfpnr);

        fetchButton = createButton("Show Details", 820, 150);
        fetchButton.addActionListener(this);
        add(fetchButton);

        int leftX = 60;
        int rightX = 500;
        int valueXOffset = 160;
        int y = 180;
        int dy = 40;

        String[] labels = {
            "Passenger Name:", "Flight Code:",
            "Travel Date:", "Arrival Date:",
            "Arrival Place:", "Departure Date:",
            "Departure Place:", "Price:",
            "Journey Time:", "Flight Number:",
            "Gender:", "Phone:",
            "Nationality:"
        };

        JLabel[] values = {
            tfname = new JLabel(),
            lblFlightCodeValue = new JLabel(),
            lblTravelDateValue = new JLabel(),
            lblArrivalDate = new JLabel(),
            lblArrivalPlace = new JLabel(),
            lblDepartureDate = new JLabel(),
            lblDeparturePlace = new JLabel(),
            lblPrice = new JLabel(),
            lblJourneyTime = new JLabel(),
            lblFlightNumber = new JLabel(),
            lblGender = new JLabel(),
            lblPhone = new JLabel(),
            lblNationality = new JLabel()
        };

        for (int i = 0; i < labels.length; i++) {
            int col = i % 2;
            int row = i / 2;
            int x = col == 0 ? leftX : rightX;
            int vx = x + valueXOffset;
            int cy = y + row * dy;

            JLabel label = createLabel(labels[i], x, cy);
            JLabel value = values[i];
            value.setBounds(vx, cy, 200, 25);
            value.setFont(new Font("Arial", Font.PLAIN, 16));
            value.setForeground(Color.BLACK);

            add(label);
            add(value);
        }

        cancellationno = new JLabel("Cancellation Number: " + (123 + 1000));
        cancellationno.setBounds(60, y + 7 * dy, 400, 30);
        cancellationno.setFont(new Font("Arial", Font.BOLD, 18));
        cancellationno.setForeground(Color.RED);
        add(cancellationno);

        flight = createButton("Cancel", 220, y + 9 * dy);
        flight.setEnabled(false);
        flight.addActionListener(this);
        add(flight);

        setSize(1000, 750);
        setLocationRelativeTo(null);
        setVisible(true);
    }

    private JLabel createLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 160, 25);
        label.setFont(new Font("Arial", Font.BOLD, 16));
        label.setForeground(new Color(0, 51, 102));
        return label;
    }

    private JTextField createTextField(int x, int y) {
        JTextField field = new JTextField();
        field.setBounds(x, y, 200, 28);
        field.setFont(new Font("Arial", Font.PLAIN, 16));
        field.setBorder(BorderFactory.createLineBorder(new Color(0, 51, 102), 2));
        return field;
    }

    private JButton createButton(String text, int x, int y) {
        JButton button = new JButton(text);
        button.setBounds(x, y, 150, 35);
        button.setFont(new Font("Arial", Font.BOLD, 16));
        button.setBackground(new Color(0, 51, 102));
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        return button;
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == fetchButton) {
            String pnr = tfpnr.getText();
            String aadhar = tfaadhar.getText();

            try {
                DatabaseConnection dbConnection = new DatabaseConnection();
                Connection conn = dbConnection.getConnection();

                String query = "SELECT b.pnr_number, f.flight_name, b.booking_date, "
                        + "f.flight_id, f.flight_number, f.departure_date, f.arrival_date, "
                        + "a1.city AS departure, a2.city AS arrival, f.price, f.journey_time, "
                        + "p.name, p.nationality, p.gender, p.phone "
                        + "FROM booking b "
                        + "JOIN flight f ON b.flight_id = f.flight_id "
                        + "JOIN passenger p ON b.passenger_id = p.passenger_id "
                        + "JOIN airport a1 ON f.departure_airport_id = a1.airport_id "
                        + "JOIN airport a2 ON f.arrival_airport_id = a2.airport_id "
                        + "WHERE b.pnr_number = ? AND p.aadhar = ?";

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

                    flight.setEnabled(true);
                } else {
                    JOptionPane.showMessageDialog(this, "No Record Found", "Error", JOptionPane.ERROR_MESSAGE);
                }

                rs.close();
                ps.close();
                conn.close();

            } catch (SQLException e) {
                e.printStackTrace();
            }

        } else if (ae.getSource() == flight) {
            String pnr = tfpnr.getText();

            int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to cancel this booking?",
                    "Confirm Cancellation", JOptionPane.YES_NO_OPTION);

            if (confirm == JOptionPane.YES_OPTION) {
                try {
                    DatabaseConnection dbConnection = new DatabaseConnection();
                    Connection conn = dbConnection.getConnection();

                    String deleteQuery = "DELETE FROM booking WHERE pnr_number = ?";
                    PreparedStatement ps = conn.prepareStatement(deleteQuery);
                    ps.setString(1, pnr);
                    int rowsAffected = ps.executeUpdate();

                    if (rowsAffected > 0) {
                        JOptionPane.showMessageDialog(this, "Booking Cancelled Successfully", "Success",
                                JOptionPane.INFORMATION_MESSAGE);
                        flight.setEnabled(false);
                    } else {
                        JOptionPane.showMessageDialog(this, "Cancellation Failed", "Error", JOptionPane.ERROR_MESSAGE);
                    }

                    ps.close();
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) {
        new Cancel();
    }
}
