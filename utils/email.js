const nodemailer = require('nodemailer');

const sendEmail = async (to, username, password) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Parmar Dixit <dixitparmar@gmail.com>',
    to: to,
    subject: 'Registration Successful', // email subject
    html: `
      <h1>Welcome to MyApp</h1>
      <p>Thank you for registering with MyApp. Here are your login credentials:</p>
      <p>Username: ${username}</p>
      <p>Password: ${password}</p>
      <p>Please keep this information secure and do not share it with anyone.</p>
      <p>Thank you for using MyApp!</p>
    ` 
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(to, username, password);
};

module.exports = sendEmail;
