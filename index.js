const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
var nodeMailer = require('nodemailer');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
var Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
var upload = multer({
  storage: Storage,
}).array('Attachments', 12);
var email;
var subject;
var message;

app.use(express.static('client'));
app.post('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.post('/sendmail', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.send('Something went wrong!');
    } else {
      email = req.body.email;
      subject = req.body.subject;
      message = req.body.message;
      var path = req.files;
      //console.log(path);
      console.log(req.files);
      const transport = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: 'prohackerveer@gmail.com',
          pass: '(@$proveer3865@$)',
        },
      });

      var mailOptions = {
        from: 'prohackerveer@gmail.com',
        to: email,
        subject: subject,
        // cc: ,
        //replyTo: 'test@gmail.com',
        date: new Date('2000-01-01 00:00:00'),
        text: message,
        attachments: path,
      };
      console.log(mailOptions);
      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
          return res.redirect('/failed.html');
        } else {
          console.log('Email send');
          return res.redirect('/result.html');
        }
      });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Live at localhost:${PORT}`);
});
