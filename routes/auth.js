const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// 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

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.json({ error: 'Please add all the fields.' });
  }
  User.findOne({ email: email })
    .then((saveUser) => {
      if (saveUser) {
        return res.json({ error: 'User already exists with that email.' });
      }
      bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({ name, email, password: hashPassword, pic });

        user
          .save()
          .then((user) => {
            res.json({ message: 'Saved successfuly.' });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: 'Please add email or password.' });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.json({ error: 'Invalid email or password.' });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          const { _id, name, email, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, pic },
          });
        } else {
          return res.json({ error: 'Invalid email or password.' });
        }
      })
      .catch((err) => console.log(err));
  });
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.json({ error: "User don't exists with that email." });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user
        .save()
        .then((result) => {
          transporter.sendMail({
            to: result.email,
            from: 'nta.cntt1997@gmail.com',
            subject: 'password reset',
            html: `
          <p>Your requested for password reset</p>
          <h5>Click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
          `,
          });
          res.json({ message: 'check your email' });
        })
        .catch((err) => console.log(err));
    });
  });
});
module.exports = router;
