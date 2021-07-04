const nodemailer = require('nodemailer')
const config = require('../config')

exports.sendMail = (title, to, html) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: config.email.host.address,
      pass: config.email.host.password,
      clientId: config.oauth.clientId,
      clientSecret: config.oauth.clientSecret,
      refreshToken: config.oauth.refreshToken,
    }
  });

  let mailOptions = {
    from: config.email.host.address,
    to: to,
    subject: title,
    html: html,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {

    }
  });

}