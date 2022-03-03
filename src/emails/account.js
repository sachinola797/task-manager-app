const sgMail = require('@sendgrid/mail');
const sender = 'sachinola797@gmail.com';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: sender,
    subject: 'Welcome to Task Manager App',
    html: `
      Hi ${name},<br><br>
      Welcome to our app.<br><br>
      Team TM
    `,
  })
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

const sendDepartureEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: sender,
    subject: 'Cancel Email',
    html: `
      Hi ${name},<br><br>
      We will miss you.<br><br>
      Team TM
    `,
  })
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

// const msg = {
//   to: 'sachin.olla@affle.com', // Change to your recipient
//   from: 'sachinola797@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   // text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

// sgMail.send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

module.exports = {
  sendWelcomeEmail,
  sendDepartureEmail,
}