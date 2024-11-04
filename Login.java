package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.*;

public class Login extends JFrame implements ActionListener {
    JButton submit, reset, close;
    JTextField tfusername;
    JPasswordField tfpassword;

    public Login() {
        // Set up the frame properties
        setTitle("Login");
        getContentPane().setBackground(Color.WHITE);
        setLayout(null);

        // Username Label and Field
        JLabel lblusername = new JLabel("Username");
        lblusername.setBounds(20, 20, 100, 20);
        add(lblusername);

        tfusername = new JTextField();
        tfusername.setBounds(130, 20, 200, 20);
        add(tfusername);

        // Password Label and Field
        JLabel lblpassword = new JLabel("Password");
        lblpassword.setBounds(20, 60, 100, 20);
        add(lblpassword);

        tfpassword = new JPasswordField();
        tfpassword.setBounds(130, 60, 200, 20);
        add(tfpassword);

        // Reset Button
        reset = new JButton("Reset");
        reset.setBounds(40, 120, 120, 20);
        reset.addActionListener(this);
        add(reset);

        // Submit Button
        submit = new JButton("Submit");
        submit.setBounds(190, 120, 120, 20);
        submit.addActionListener(this);
        add(submit);

        // Close Button
        close = new JButton("Close");
        close.setBounds(120, 160, 120, 20);
        close.addActionListener(this);
        add(close);

        // Frame settings
        setSize(400, 250);
        setLocationRelativeTo(null); // Center the frame on the screen
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Ensures the application exits when closed
        setVisible(true);
    }

    public void actionPerformed(ActionEvent ae) {
        if (ae.getSource() == submit) {
            String username = tfusername.getText();
            String password = new String(tfpassword.getPassword()); // Securely get password
    
            try {
                DatabaseConnection dbConnection = new DatabaseConnection();
                Connection conn = dbConnection.getConnection(); // Get the connection
    
                if (conn != null) { // Check if the connection is successful
                    String query = "SELECT * FROM login WHERE username = ? AND password = ?";
                    PreparedStatement stmt = conn.prepareStatement(query);
    
                    // Set parameters
                    stmt.setString(1, username);
                    stmt.setString(2, password);
    
                    ResultSet rs = stmt.executeQuery();
    
                    if (rs.next()) {
                        new Home(); // Redirect to Home screen on successful login
                        dispose(); // Close login window
                    } else {
                        JOptionPane.showMessageDialog(this, "Invalid Username or Password", "Login Error", JOptionPane.ERROR_MESSAGE);
                        tfusername.setText("");
                        tfpassword.setText("");
                    }
    
                    // Close resources
                    rs.close();
                    stmt.close();
                    conn.close(); // Close the database connection
    
                } else {
                    JOptionPane.showMessageDialog(this, "Database connection failed.", "Connection Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (SQLException e) {
                e.printStackTrace();
                JOptionPane.showMessageDialog(this, "Database error: " + e.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (ae.getSource() == close) {
            dispose(); // Close the application
        } else if (ae.getSource() == reset) {
            tfusername.setText("");
            tfpassword.setText("");
        }
    }
    

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Login::new); // Use invokeLater for thread safety
    }
}
