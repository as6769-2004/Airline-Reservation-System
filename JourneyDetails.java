package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.sql.*;
import java.awt.event.*;

public class JourneyDetails extends JFrame implements ActionListener {
    JLabel imageLabel;
    private JTextField pnrField, aadharField;
    private JButton showButton;
    private JPanel detailsPanel; // Panel to display journey details
    private JScrollPane scrollPane; // Scroll pane for details
    private JRadioButton pnrOption, aadharOption; // Options to choose search criteria
    private static final int FRAME_WIDTH = 800;
    private static final int FRAME_HEIGHT = 600;

    @SuppressWarnings("unused")
    public JourneyDetails() {

        // Load the image
        ImageIcon imageIcon = new ImageIcon("C:\\Users\\ASUS\\Desktop\\New 2.0\\airlinemanagementsystem\\icons\\details.jpg"); // Replace with your image path
        Image image = imageIcon.getImage().getScaledInstance(85, 85, Image.SCALE_SMOOTH); // Resize if needed
        imageIcon = new ImageIcon(image);

        // Add the image label
        imageLabel = new JLabel(imageIcon);
        imageLabel.setBounds(600, 0, 150, 150); // Position on the center-left
        add(imageLabel);

        // Set up the frame properties
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);

        // Title label
        JLabel titleLabel = new JLabel("Journey Details");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setBounds(50, 20, 300, 30); // Positioning the title
        add(titleLabel);

        // Label for search options
        JLabel lblSearch = new JLabel("Search by:");
        lblSearch.setFont(new Font("Tahoma", Font.PLAIN, 16));
        lblSearch.setBounds(50, 60, 100, 25);
        add(lblSearch);

        // Radio buttons for search criteria
        pnrOption = new JRadioButton("PNR");
        pnrOption.setSelected(true);
        pnrOption.setBounds(50, 90, 60, 25);
        add(pnrOption);

        aadharOption = new JRadioButton("Aadhar");
        aadharOption.setBounds(120, 90, 70, 25);
        add(aadharOption);

        ButtonGroup group = new ButtonGroup();
        group.add(pnrOption);
        group.add(aadharOption);

        // TextField for PNR input
        pnrField = new JTextField();
        pnrField.setBounds(200, 90, 120, 25);
        add(pnrField);

        // TextField for Aadhar input
        aadharField = new JTextField();
        aadharField.setBounds(200, 90, 120, 25);
        aadharField.setVisible(false); // Hide Aadhar field initially
        add(aadharField);

        // Button to show details
        showButton = new JButton("Show Details");
        showButton.setBackground(Color.BLACK);
        showButton.setForeground(Color.WHITE);
        showButton.setBounds(330, 90, 120, 25);
        showButton.addActionListener(this);
        add(showButton);

        // Panel to display journey details
        detailsPanel = new JPanel();
        detailsPanel.setLayout(new BoxLayout(detailsPanel, BoxLayout.Y_AXIS)); // Vertical layout
        detailsPanel.setBackground(Color.WHITE);

        // Add a scroll pane
        scrollPane = new JScrollPane(detailsPanel);
        scrollPane.setBounds(50, 130, 700, 400); // Set scroll pane bounds
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED); // Scroll bar as needed
        scrollPane.setBorder(BorderFactory.createTitledBorder("Journey Details")); // Add a border for clarity
        add(scrollPane);

        // ActionListener to toggle between PNR and Aadhar input fields
        pnrOption.addActionListener(e -> toggleInputFields(true));
        aadharOption.addActionListener(e -> toggleInputFields(false));

        setSize(FRAME_WIDTH, FRAME_HEIGHT);
        setLocation(400, 150);
        setVisible(true);
        getContentPane().setBackground(new Color(235, 245, 255));
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Close operation
    }

    private void toggleInputFields(boolean isPnrSelected) {
        pnrField.setVisible(isPnrSelected);
        aadharField.setVisible(!isPnrSelected);
        if (isPnrSelected) {
            pnrField.requestFocus(); // Focus on PNR input
        } else {
            aadharField.requestFocus(); // Focus on Aadhar input
        }
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        String searchValue = null;

        // Validate input fields
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

        detailsPanel.removeAll(); // Clear previous details
        detailsPanel.revalidate(); // Refresh panel
        detailsPanel.repaint();

        try {
            String query = buildQuery();
            DatabaseConnection dbConnection = new DatabaseConnection();
            Connection conn = dbConnection.getConnection();
            if (conn != null) { // Check if the connection is successful
                PreparedStatement ps = conn.prepareStatement(query); // Use PreparedStatement for safety
                ps.setString(1, searchValue); // Set the search parameter
                ResultSet rs = ps.executeQuery();

                if (!rs.isBeforeFirst()) {
                    JOptionPane.showMessageDialog(this, "No Information Found");
                    return;
                }

                // Loop through booking results to get details
                while (rs.next()) {
                    // Create a card for each booking detail
                    JPanel card = createDetailCard(rs);
                    detailsPanel.add(card); // Add card to details panel
                }

                detailsPanel.revalidate(); // Refresh panel after adding new details
                detailsPanel.repaint();

                // Close resources
                rs.close();
                ps.close();
                conn.close(); // Close the database connection
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
        if (pnrOption.isSelected()) {
            return "SELECT b.flight_id, b.pnr_number, b.aadhar, "
                    + "f.flight_number, f.flight_name, "
                    + "f.departure, f.arrival, "
                    + "f.price, f.journey_time, "
                    + "f.departure_date, f.arrival_date "
                    + "FROM booking b "
                    + "JOIN flight f ON b.flight_id = f.flight_id "
                    + "WHERE b.pnr_number = ?";
        } else {
            return "SELECT b.flight_id, b.pnr_number, b.aadhar, "
                    + "f.flight_number, f.flight_name, "
                    + "f.departure, f.arrival, "
                    + "f.price, f.journey_time, "
                    + "f.departure_date, f.arrival_date "
                    + "FROM booking b "
                    + "JOIN flight f ON b.flight_id = f.flight_id "
                    + "WHERE b.aadhar = ?";
        }
    }

    private JPanel createDetailCard(ResultSet rs) throws SQLException {
        JPanel card = new JPanel();
        card.setLayout(new GridLayout(0, 2, 10, 10));
        card.setBorder(BorderFactory.createLineBorder(Color.LIGHT_GRAY, 1));
        card.setBackground(Color.WHITE);
        card.setPreferredSize(new Dimension(680, 100));

        // Adding labels and values from booking details
        card.add(new JLabel("PNR:"));
        card.add(new JLabel(rs.getString("pnr_number"))); // Show PNR

        card.add(new JLabel("Flight ID:"));
        card.add(new JLabel(rs.getString("flight_id")));

        card.add(new JLabel("Flight Number:"));
        card.add(new JLabel(rs.getString("flight_number")));

        card.add(new JLabel("Flight Name:"));
        card.add(new JLabel(rs.getString("flight_name")));

        card.add(new JLabel("Departure:"));
        card.add(new JLabel(rs.getString("departure")));

        card.add(new JLabel("Arrival:"));
        card.add(new JLabel(rs.getString("arrival")));

        card.add(new JLabel("Aadhar:"));
        card.add(new JLabel(rs.getString("aadhar"))); // Show Aadhar

        // Adding flight price and journey details
        card.add(new JLabel("Price:"));
        card.add(new JLabel(String.format("₹%.2f", rs.getDouble("price"))));

        card.add(new JLabel("Journey Time:"));
        card.add(new JLabel(rs.getString("journey_time")));

        card.add(new JLabel("Departure Date:"));
        card.add(new JLabel(rs.getString("departure_date")));

        card.add(new JLabel("Arrival Date:"));
        card.add(new JLabel(rs.getString("arrival_date")));

        return card;
    }

    public static void main(String[] args) {
        new JourneyDetails();
    }
}
