package airlinemanagementsystem;

import javax.swing.*;
import javax.swing.border.Border;
import java.awt.*;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FlightInfo extends JFrame {

    public FlightInfo() {
        // Set up the main panel with a gradient background
        JPanel mainPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2d = (Graphics2D) g;
                GradientPaint gp = new GradientPaint(0, 0, Color.WHITE, 0, getHeight(), new Color(200, 230, 250));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        mainPanel.setLayout(new BorderLayout());
        add(mainPanel);

        // Scrollable panel to hold the flight cards
        JPanel flightPanel = new JPanel();
        flightPanel.setLayout(new BoxLayout(flightPanel, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(flightPanel);
        scrollPane.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS); // Enable the vertical scrollbar
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);

        // Set up custom scrolling speed
        scrollPane.getVerticalScrollBar().setUnitIncrement(16); // Customize scrolling speed

        // Add a MouseWheelListener to increase scroll sensitivity if needed
        scrollPane.addMouseWheelListener(new MouseWheelListener() {
            @Override
            public void mouseWheelMoved(MouseWheelEvent e) {
                int notches = e.getWheelRotation();
                int scrollAmount = notches * 16; // Adjust scroll amount if necessary
                scrollPane.getViewport().setViewPosition(
                    new Point(scrollPane.getViewport().getViewPosition().x,
                              scrollPane.getViewport().getViewPosition().y + scrollAmount));
            }
        });

        // Add the scroll pane to the main panel
        mainPanel.add(scrollPane, BorderLayout.CENTER);

        // Adding a header
        JLabel header = new JLabel("Flight Information", JLabel.CENTER);
        header.setFont(new Font("Segoe UI", Font.BOLD, 28));
        header.setForeground(new Color(0, 120, 215));
        mainPanel.add(header, BorderLayout.NORTH);

        // Database connection and data retrieval
        DatabaseConnection dbConn = new DatabaseConnection(); // Use the new DatabaseConnection class
        String sql = "SELECT * FROM flight"; // SQL query
        
        try (Connection connection = dbConn.getConnection();
             PreparedStatement passengerPs = connection.prepareStatement(sql);
             ResultSet passengerRs = passengerPs.executeQuery()) {

            while (passengerRs.next()) {
                JPanel flightCard = createFlightCard(passengerRs); // Create flight card for each result
                flightPanel.add(flightCard);
                flightPanel.add(Box.createVerticalStrut(10)); // Add space between cards
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Set up the frame
        setTitle("Flight Information");
        setSize(800, 500);
        setLocationRelativeTo(null); // Center the frame
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setVisible(true);
    }

    // Method to create a card for each flight
    private JPanel createFlightCard(ResultSet rs) throws SQLException {
        RoundedPanel card = new RoundedPanel(20); // Create a rounded panel with a radius of 20
        card.setLayout(new GridLayout(11, 2, 10, 10)); // Adjust layout for more labels
        card.setBorder(createRoundedBorder()); // Set rounded border
        card.setBackground(Color.WHITE); // Set card background color
        card.setPreferredSize(new Dimension(700, 300)); // Size of each card

        // Add details from ResultSet to the card
        addLabelToCard(card, "Flight ID", String.valueOf(rs.getInt("flight_id")));
        addLabelToCard(card, "Flight Number", rs.getString("flight_number"));
        addLabelToCard(card, "Flight Name", rs.getString("flight_name"));
        addLabelToCard(card, "Departure", rs.getString("departure"));
        addLabelToCard(card, "Arrival", rs.getString("arrival"));
        addLabelToCard(card, "Travel Date", String.valueOf(rs.getDate("travel_date")));
        addLabelToCard(card, "Available Seats", String.valueOf(rs.getInt("available_seats")));
        addLabelToCard(card, "Price", "$" + rs.getBigDecimal("price"));
        addLabelToCard(card, "Journey Time", rs.getString("journey_time"));
        addLabelToCard(card, "Arrival Date", String.valueOf(rs.getDate("arrival_date")));
        addLabelToCard(card, "Departure Date", String.valueOf(rs.getDate("departure_date")));

        return card;
    }

    // Helper function to create a rounded border
    private Border createRoundedBorder() {
        int borderThickness = 4; // Set the thickness of the border
        return BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(0, 102, 204), borderThickness, true), // Blue line border
                BorderFactory.createEmptyBorder(10, 10, 10, 10)
        );
    }

    // Helper function to add a label to the flight card
    private void addLabelToCard(JPanel card, String labelText, String valueText) {
        JLabel label = new JLabel(labelText);
        label.setFont(new Font("Segoe UI", Font.BOLD, 14)); // Make label text bold and a bit larger
        label.setForeground(new Color(0, 102, 204)); // Change label color for better visibility
        label.setHorizontalAlignment(JLabel.LEFT); // Align text to left
        card.add(label);

        JLabel valueLabel = new JLabel(valueText);
        valueLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14)); // Use a normal font for value
        valueLabel.setForeground(Color.BLACK); // Ensure value text is black
        valueLabel.setHorizontalAlignment(JLabel.LEFT); // Align text to left
        card.add(valueLabel);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(FlightInfo::new); // Use invokeLater for thread safety
    }
}

// Custom rounded JPanel class
class RoundedPanel extends JPanel {
    private final int radius;

    public RoundedPanel(int radius) {
        this.radius = radius;
        setOpaque(false); // Make sure the panel is transparent to show the rounded corners
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g.create();
        g2d.setColor(getBackground());
        g2d.fillRoundRect(0, 0, getWidth(), getHeight(), radius, radius);
        g2d.dispose();
    }
}
