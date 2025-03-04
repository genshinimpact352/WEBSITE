import nodemailer from "nodemailer";
import { Order } from "@shared/schema";

if (!process.env.EMAIL_PASSWORD) {
  throw new Error("EMAIL_PASSWORD environment variable must be set");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "2030.kevin.clyde@my.caslv.org",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const NOTIFICATION_EMAILS = [
  "2030.kevin.clyde@my.caslv.org",
  "k3vinc1des@gmail.com"
];

export async function sendOrderNotification(order: Order) {
  const itemsList = order.items
    .map(item => `
      Product ID: ${item.productId}
      Quantity: ${item.quantity}
      Color: ${item.color}
      Pattern: ${item.pattern}
      Special Details: ${item.details || 'None'}
    `).join('\n');

  const emailContent = `
    New Order Received!
    
    Order ID: ${order.id}
    Customer Email: ${order.customerEmail}
    Total: $${order.total}
    Discount Code Used: ${order.discountCode || 'None'}
    
    Items:
    ${itemsList}
    
    Payment ID: ${order.stripePaymentId}
  `;

  const emailPromises = NOTIFICATION_EMAILS.map(email =>
    transporter.sendMail({
      from: "2030.kevin.clyde@my.caslv.org",
      to: email,
      subject: `New Order #${order.id} - The Ratty Crochet`,
      text: emailContent,
    })
  );

  await Promise.all(emailPromises);
}
