package airlinemanagementsystem;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Home extends JFrame implements ActionListener {

    public Home() {
        setLayout(null);
        
        // Background Image
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("airlinemanagementsystem/icons/front.jpg"));
        JLabel image = new JLabel(i1);
        image.setBounds(0, 0, 1600, 800);
        add(image);

        // Heading Label
        JLabel heading = new JLabel("AIR INDIA WELCOMES YOU");
        heading.setBounds(500, 40, 1000, 40);
        heading.setForeground(Color.BLUE);
        heading.setFont(new Font("Tahoma", Font.BOLD, 36));
        image.add(heading);

        // Create Buttons for various functionalities
        JButton flightDetailsButton = createModernButton("Flight Details", 300, 200);
        flightDetailsButton.addActionListener(this);
        image.add(flightDetailsButton);

        JButton customerDetailsButton = createModernButton("Add Customer Details", 300, 300);
        customerDetailsButton.addActionListener(this);
        image.add(customerDetailsButton);

        JButton bookFlightButton = createModernButton("Book Flight", 300, 400);
        bookFlightButton.addActionListener(this);
        image.add(bookFlightButton);

        JButton journeyDetailsButton = createModernButton("Journey Details", 300, 500);
        journeyDetailsButton.addActionListener(this);
        image.add(journeyDetailsButton);

        JButton cancelTicketButton = createModernButton("Cancel Ticket", 300, 600);
        cancelTicketButton.addActionListener(this);
        image.add(cancelTicketButton);

        JButton boardingPassButton = createModernButton("Boarding Pass", 300, 700);
        boardingPassButton.addActionListener(this);
        image.add(boardingPassButton);

        // Frame Settings
        setExtendedState(JFrame.MAXIMIZED_BOTH); // Maximize window
        setVisible(true);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Proper exit operation
    }

    private JButton createModernButton(String text, int x, int y) {
        JButton button = new JButton(text) {
            // Override paintComponent to add rounded corners and shadows
            @Override
            protected void paintComponent(Graphics g) {
                // Set background color
                g.setColor(new Color(50, 150, 250));
                g.fillRoundRect(0, 0, getWidth(), getHeight(), 15, 15); // Rounded corners

                // Add shadow effect
                g.setColor(new Color(0, 0, 0, 50)); // Semi-transparent black
                g.fillRoundRect(5, 5, getWidth(), getHeight(), 15, 15); // Shadow

                // Call the parent method to render the text
                super.paintComponent(g);
            }
        };

        button.setBounds(x, y, 250, 40); // Set button size and position
        button.setFont(new Font("Tahoma", Font.BOLD, 20));
        button.setFocusPainted(false); // Remove focus outline
        button.setBorder(BorderFactory.createEmptyBorder()); // Remove border
        button.setContentAreaFilled(false); // Transparent button area
        button.setForeground(Color.WHITE);

        // Add MouseListener for hover effect
        button.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) {
                button.setBackground(new Color(30, 130, 230)); // Darker on hover
            }

            public void mouseExited(java.awt.event.MouseEvent evt) {
                button.setBackground(new Color(50, 150, 250)); // Reset to original
            }
        });

        return button;
    }

    public void actionPerformed(ActionEvent ae) {
        String text = ae.getActionCommand();
        
        if (text.equals("Add Customer Details")) {
            new AddCustomer();
        } else if (text.equals("Flight Details")) {
            new FlightInfo();
        } else if (text.equals("Book Flight")) {
            new BookFlight();
        } else if (text.equals("Journey Details")) {
            new JourneyDetails();
        } else if (text.equals("Cancel Ticket")) {
            new Cancel();
        } else if (text.equals("Boarding Pass")) {
            new BoardingPass();
        }
    }

    public static void main(String[] args) {
        new Home();
    }
}
