package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.net.URI;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BoardingPass extends JFrame implements ActionListener {

    private JTextField tfpnr;
    private JLabel tfname, tfnationality, lblsrc, lbldest, labelfname, labelfcode, labeldate;
    private JButton fetchButton, downloadButton;

    @SuppressWarnings("unused")
    public BoardingPass() {
        // Frame setup
        setTitle("Air India - Boarding Pass");
        setSize(1000, 450);
        setLocation(300, 150);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Main panel with gradient background
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
        mainPanel.setLayout(null);
        add(mainPanel);

        // Heading
        JLabel heading = new JLabel("AIR INDIA", JLabel.CENTER);
        heading.setBounds(360, 10, 300, 40);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 32));
        mainPanel.add(heading);

        JLabel subheading = new JLabel("Boarding Pass", JLabel.CENTER);
        subheading.setBounds(360, 60, 300, 30);
        subheading.setFont(new Font("Segoe UI", Font.PLAIN, 24));
        subheading.setForeground(new Color(0, 102, 204));
        mainPanel.add(subheading);

        // PNR details label
        JLabel lblaadhar = new JLabel("PNR DETAILS");
        lblaadhar.setBounds(60, 100, 150, 25);
        lblaadhar.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        mainPanel.add(lblaadhar);

        tfpnr = new JTextField();
        tfpnr.setBounds(220, 100, 150, 25);
        mainPanel.add(tfpnr);

        fetchButton = new JButton("Fetch Details");
        fetchButton.setBounds(380, 100, 120, 25);
        fetchButton.setBackground(new Color(0, 102, 204));
        fetchButton.setForeground(Color.WHITE);
        fetchButton.addActionListener(this);
        mainPanel.add(fetchButton);

        // Passenger details layout
        setupLabel(mainPanel, "NAME", 60, 140);
        tfname = setupValueLabel(mainPanel, 220, 140);

        setupLabel(mainPanel, "NATIONALITY", 60, 180);
        tfnationality = setupValueLabel(mainPanel, 220, 180);

        setupLabel(mainPanel, "SRC", 60, 220);
        lblsrc = setupValueLabel(mainPanel, 220, 220);

        setupLabel(mainPanel, "DEST", 380, 220);
        lbldest = setupValueLabel(mainPanel, 540, 220);

        setupLabel(mainPanel, "Flight Name", 60, 260);
        labelfname = setupValueLabel(mainPanel, 220, 260);

        setupLabel(mainPanel, "Flight Code", 380, 260);
        labelfcode = setupValueLabel(mainPanel, 540, 260);

        setupLabel(mainPanel, "Date", 60, 300);
        labeldate = setupValueLabel(mainPanel, 220, 300);

        // Image on the right side
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("airlinemanagementsystem/icons/airindia.png"));
        Image i2 = i1.getImage().getScaledInstance(250, 200, Image.SCALE_SMOOTH);
        JLabel lblimage = new JLabel(new ImageIcon(i2));
        lblimage.setBounds(700, 20, 250, 200);
        mainPanel.add(lblimage);

        // Add download button
        downloadButton = new JButton("Download");
        downloadButton.setBounds(380, 340, 120, 25);
        downloadButton.setBackground(new Color(0, 102, 204));
        downloadButton.setForeground(Color.WHITE);
        downloadButton.addActionListener(e -> {
            // Redirect to the download page
            try {
                Desktop.getDesktop().browse(new URI("http://localhost:8080/downloadBoardingPass.html"));
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });
        mainPanel.add(downloadButton);

        setVisible(true);
    }

    // Helper function to set up a label with common properties
    private void setupLabel(JPanel panel, String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        panel.add(label);
    }

    // Helper function to set up a label for displaying values
    private JLabel setupValueLabel(JPanel panel, int x, int y) {
        JLabel label = new JLabel();
        label.setBounds(x, y, 150, 25);
        label.setFont(new Font("Segoe UI", Font.PLAIN, 16));
        panel.add(label);
        return label;
    }

    @Override
    public void actionPerformed(ActionEvent ae) {
        String pnr = tfpnr.getText();

        try (Connection connection = new DatabaseConnection().getConnection()) {
            String query = "SELECT p.name, p.nationality, f.departure, f.arrival, b.flight_name, b.flight_id, b.booking_date " +
                           "FROM booking b " +
                           "JOIN passenger p ON b.aadhar = p.aadhar " +
                           "JOIN flight f ON b.flight_id = f.flight_id " +
                           "WHERE b.pnr_number = ?";
            PreparedStatement pstmt = connection.prepareStatement(query);
            pstmt.setString(1, pnr);

            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                tfname.setText(rs.getString("name"));
                tfnationality.setText(rs.getString("nationality"));
                lblsrc.setText(rs.getString("departure"));
                lbldest.setText(rs.getString("arrival"));
                labelfname.setText(rs.getString("flight_name"));
                labelfcode.setText(rs.getString("flight_id"));
                labeldate.setText(rs.getString("booking_date")); // Use booking_date for display
            } else {
                JOptionPane.showMessageDialog(this, "Please enter a correct PNR.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Error retrieving data. Please try again.", "Database Error", JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(BoardingPass::new);
    }
}
