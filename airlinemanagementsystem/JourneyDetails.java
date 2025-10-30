package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.sql.*;
import java.awt.event.*;

public class JourneyDetails extends JFrame implements ActionListener {
    private JTextField pnrField, aadharField;
    private JButton showButton;
    private JPanel detailsPanel;
    private JScrollPane scrollPane;
    private JRadioButton pnrOption, aadharOption;

    public JourneyDetails() {
        setTitle("Journey Details");
        setExtendedState(JFrame.MAXIMIZED_BOTH); // Fullscreen
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());

        // Top panel for search
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        topPanel.setBackground(new Color(230, 240, 255));

        JLabel titleLabel = new JLabel("Journey Details");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 28));
        topPanel.add(titleLabel);

        topPanel.add(new JLabel(" | Search by:"));

        pnrOption = new JRadioButton("PNR", true);
        aadharOption = new JRadioButton("Aadhar");
        ButtonGroup group = new ButtonGroup();
        group.add(pnrOption);
        group.add(aadharOption);
        topPanel.add(pnrOption);
        topPanel.add(aadharOption);

        pnrField = new JTextField(10);
        aadharField = new JTextField(10);
        aadharField.setVisible(false);

        topPanel.add(pnrField);
        topPanel.add(aadharField);

        showButton = new JButton("Show Details");
        showButton.setBackground(Color.BLACK);
        showButton.setForeground(Color.WHITE);
        topPanel.add(showButton);

        add(topPanel, BorderLayout.NORTH);

        // Main scrollable panel
        detailsPanel = new JPanel();
        detailsPanel.setLayout(new BoxLayout(detailsPanel, BoxLayout.Y_AXIS));
        detailsPanel.setBackground(Color.WHITE);

        scrollPane = new JScrollPane(detailsPanel);
        scrollPane.setBorder(BorderFactory.createTitledBorder("Passenger Journey Records"));
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);
        add(scrollPane, BorderLayout.CENTER);

        // Add listeners
        showButton.addActionListener(this);
        pnrOption.addActionListener(_ -> toggleInputFields(true));
        aadharOption.addActionListener(_ -> toggleInputFields(false));
    }

    private void toggleInputFields(boolean isPnrSelected) {
        pnrField.setVisible(isPnrSelected);
        aadharField.setVisible(!isPnrSelected);
        if (isPnrSelected) {
            pnrField.requestFocus();
        } else {
            aadharField.requestFocus();
        }
        revalidate();
        repaint();
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        String searchValue;

        if (pnrOption.isSelected()) {
            searchValue = pnrField.getText().trim();
            if (searchValue.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please enter a PNR number.");
                return;
            }
        } else {
            searchValue = aadharField.getText().trim();
            if (searchValue.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Please enter an Aadhar number.");
                return;
            }
        }

        detailsPanel.removeAll();

        try {
            String query = buildQuery();
            DatabaseConnection dbConnection = new DatabaseConnection();
            Connection conn = dbConnection.getConnection();
            if (conn != null) {
                PreparedStatement ps = conn.prepareStatement(query);
                ps.setString(1, searchValue);
                ResultSet rs = ps.executeQuery();

                if (!rs.isBeforeFirst()) {
                    JOptionPane.showMessageDialog(this, "No Information Found");
                    return;
                }

                while (rs.next()) {
                    JPanel card = createDetailCard(rs);
                    detailsPanel.add(card);
                    detailsPanel.add(Box.createRigidArea(new Dimension(0, 10))); // Spacing
                }

                detailsPanel.revalidate();
                detailsPanel.repaint();
                rs.close();
                ps.close();
                conn.close();
            } else {
                JOptionPane.showMessageDialog(this, "Database connection failed.", "Connection Error",
                        JOptionPane.ERROR_MESSAGE);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage());
        }
    }

    private String buildQuery() {
        return "SELECT b.pnr_number, b.booking_date, b.seat_number, b.booking_status, " +
                "f.flight_number, f.flight_name, f.travel_date, f.journey_time, f.price, f.departure_date, f.arrival_date, "
                +
                "p.name, p.aadhar, p.nationality, p.gender, p.phone, p.email " +
                "FROM booking b " +
                "JOIN passenger p ON b.passenger_id = p.passenger_id " +
                "JOIN flight f ON b.flight_id = f.flight_id " +
                (pnrOption.isSelected() ? "WHERE b.pnr_number = ?" : "WHERE p.aadhar = ?");
    }

    private JPanel createDetailCard(ResultSet rs) throws SQLException {
        JPanel card = new JPanel(new GridLayout(0, 4, 20, 20)); // 4 columns, more vertical spacing
        card.setBackground(new Color(240, 248, 255)); // light blue

        // Make container bigger
        card.setPreferredSize(new Dimension(1000, 600)); // increase width & height
        card.setMaximumSize(new Dimension(Integer.MAX_VALUE, 500)); // stretch to fit panel

        // Add margin and border
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(150, 150, 150), 2),
                BorderFactory.createEmptyBorder(25, 25, 25, 25) // top, left, bottom, right padding
        ));

        Font labelFont = new Font("Segoe UI", Font.BOLD, 18); // Larger text
        Font valueFont = new Font("Segoe UI", Font.PLAIN, 18);

        // Fill in label-value fields
        card.add(createLabel("PNR:", labelFont));
        card.add(createValue(rs.getString("pnr_number"), valueFont));
        card.add(createLabel("Booking Date:", labelFont));
        card.add(createValue(rs.getString("booking_date"), valueFont));

        card.add(createLabel("Seat Number:", labelFont));
        card.add(createValue(rs.getString("seat_number"), valueFont));
        card.add(createLabel("Booking Status:", labelFont));
        card.add(createValue(rs.getString("booking_status"), valueFont));

        card.add(createLabel("Passenger Name:", labelFont));
        card.add(createValue(rs.getString("name"), valueFont));
        card.add(createLabel("Aadhar:", labelFont));
        card.add(createValue(rs.getString("aadhar"), valueFont));

        card.add(createLabel("Nationality:", labelFont));
        card.add(createValue(rs.getString("nationality"), valueFont));
        card.add(createLabel("Gender:", labelFont));
        card.add(createValue(rs.getString("gender"), valueFont));

        card.add(createLabel("Phone:", labelFont));
        card.add(createValue(rs.getString("phone"), valueFont));
        card.add(createLabel("Email:", labelFont));
        card.add(createValue(rs.getString("email"), valueFont));

        card.add(createLabel("Flight Number:", labelFont));
        card.add(createValue(rs.getString("flight_number"), valueFont));
        card.add(createLabel("Flight Name:", labelFont));
        card.add(createValue(rs.getString("flight_name"), valueFont));

        card.add(createLabel("Price:", labelFont));
        card.add(createValue("₹" + rs.getDouble("price"), valueFont));
        card.add(createLabel("Journey Time:", labelFont));
        card.add(createValue(rs.getString("journey_time"), valueFont));

        card.add(createLabel("Departure Date:", labelFont));
        card.add(createValue(rs.getString("departure_date"), valueFont));
        card.add(createLabel("Arrival Date:", labelFont));
        card.add(createValue(rs.getString("arrival_date"), valueFont));

        return card;
    }

    // Utility methods for label and value with styling
    private JLabel createLabel(String text, Font font) {
        JLabel label = new JLabel(text);
        label.setFont(font);
        label.setForeground(new Color(0, 51, 102)); // dark blue
        return label;
    }

    private JLabel createValue(String text, Font font) {
        JLabel value = new JLabel(text);
        value.setFont(font);
        value.setForeground(Color.DARK_GRAY);
        return value;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JourneyDetails().setVisible(true));
    }
}
