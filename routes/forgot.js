var express = require('express');
var async = require('async');
var crypto = require('crypto');
var User = require('../Models/User')
var nodemailer = require('nodemailer');
var router = express.Router();

//Render Forgot Page
router.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user
    });
  });

//Forgot Password Controller 
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // reset link valid for 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport( {
          service: 'SendGrid',
          auth: {
            user: process.env.sendgridUser,
            pass: process.env.sendgridPass
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'manchind@deenstrong.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', `An e-mail has been sent to ${user.email}  with further instructions.`);
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

  module.exports = router;
