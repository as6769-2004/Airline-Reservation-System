package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class BoardingPass extends JFrame implements ActionListener {

    private JTextField tfpnr;
    private JLabel bookingIdLabel, flightIdLabel, passengerIdLabel, bookingDateLabel, seatNumberLabel, bookingStatusLabel;

    private JLabel nameLabel, aadharLabel, nationalityLabel, addressLabel, genderLabel, phoneLabel, emailLabel, dobLabel;

    private JButton fetchBtn;

    public BoardingPass() {
        setTitle("Booking + Full Passenger Details");
        setSize(850, 720);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        JPanel panel = new JPanel(null);
        panel.setBackground(Color.WHITE);
        add(panel);

        JLabel heading = new JLabel("Lookup Booking & Passenger by PNR", SwingConstants.CENTER);
        heading.setFont(new Font("SansSerif", Font.BOLD, 24));
        heading.setBounds(180, 20, 500, 30);
        panel.add(heading);

        JLabel lblpnr = new JLabel("Enter PNR Number:");
        lblpnr.setFont(new Font("SansSerif", Font.PLAIN, 16));
        lblpnr.setBounds(60, 80, 160, 25);
        panel.add(lblpnr);

        tfpnr = new JTextField();
        tfpnr.setBounds(220, 80, 200, 25);
        panel.add(tfpnr);

        fetchBtn = new JButton("Fetch Details");
        fetchBtn.setBounds(440, 80, 150, 25);
        fetchBtn.setBackground(new Color(0, 102, 204));
        fetchBtn.setForeground(Color.WHITE);
        fetchBtn.addActionListener(this);
        panel.add(fetchBtn);

        int y = 140;
        bookingIdLabel = createField(panel, "Booking ID", y);
        flightIdLabel = createField(panel, "Flight ID", y += 30);
        passengerIdLabel = createField(panel, "Passenger ID", y += 30);
        bookingDateLabel = createField(panel, "Booking Date", y += 30);
        seatNumberLabel = createField(panel, "Seat Number", y += 30);
        bookingStatusLabel = createField(panel, "Booking Status", y += 30);

        y += 40; // gap

        nameLabel = createField(panel, "Name", y += 30);
        aadharLabel = createField(panel, "Aadhar Number", y += 30);
        nationalityLabel = createField(panel, "Nationality", y += 30);
        addressLabel = createField(panel, "Address", y += 30);
        genderLabel = createField(panel, "Gender", y += 30);
        phoneLabel = createField(panel, "Phone", y += 30);
        emailLabel = createField(panel, "Email", y += 30);
        dobLabel = createField(panel, "Date of Birth", y += 30);

        setVisible(true);
    }

    private JLabel createField(JPanel panel, String label, int y) {
        JLabel lbl = new JLabel(label + ":");
        lbl.setFont(new Font("SansSerif", Font.PLAIN, 16));
        lbl.setBounds(60, y, 150, 25);
        panel.add(lbl);

        JLabel val = new JLabel();
        val.setFont(new Font("SansSerif", Font.PLAIN, 16));
        val.setBounds(220, y, 550, 25);
        panel.add(val);

        return val;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        String pnr = tfpnr.getText().trim();

        if (pnr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please enter a PNR number.");
            return;
        }

        try (Connection conn = new DatabaseConnection().getConnection()) {

            // Step 1: Fetch from booking
            String bookingQuery = "SELECT * FROM booking WHERE pnr_number = ?";
            PreparedStatement pst = conn.prepareStatement(bookingQuery);
            pst.setString(1, pnr);
            ResultSet rs = pst.executeQuery();

            if (rs.next()) {
                int bookingId = rs.getInt("booking_id");
                int flightId = rs.getInt("flight_id");
                int passengerId = rs.getInt("passenger_id");

                bookingIdLabel.setText(String.valueOf(bookingId));
                flightIdLabel.setText(String.valueOf(flightId));
                passengerIdLabel.setText(String.valueOf(passengerId));
                bookingDateLabel.setText(rs.getString("booking_date"));
                seatNumberLabel.setText(rs.getString("seat_number"));
                bookingStatusLabel.setText(rs.getString("booking_status"));

                // Step 2: Fetch passenger details using passenger_id
                String passengerQuery = "SELECT * FROM passenger WHERE passenger_id = ?";
                PreparedStatement pst2 = conn.prepareStatement(passengerQuery);
                pst2.setInt(1, passengerId);
                ResultSet rs2 = pst2.executeQuery();

                if (rs2.next()) {
                    nameLabel.setText(rs2.getString("name"));
                    aadharLabel.setText(rs2.getString("aadhar"));
                    nationalityLabel.setText(rs2.getString("nationality"));
                    addressLabel.setText(rs2.getString("address"));
                    genderLabel.setText(rs2.getString("gender"));
                    phoneLabel.setText(rs2.getString("phone"));
                    emailLabel.setText(rs2.getString("email"));
                    dobLabel.setText(rs2.getString("date_of_birth"));
                } else {
                    nameLabel.setText("Not Found");
                    aadharLabel.setText("-");
                    nationalityLabel.setText("-");
                    addressLabel.setText("-");
                    genderLabel.setText("-");
                    phoneLabel.setText("-");
                    emailLabel.setText("-");
                    dobLabel.setText("-");
                }

                rs2.close();
                pst2.close();

            } else {
                JOptionPane.showMessageDialog(this, "No booking found for the provided PNR.");
            }

            rs.close();
            pst.close();

        } catch (Exception ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database error occurred.");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(BoardingPass::new);
    }
}
