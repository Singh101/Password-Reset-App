var express = require('express');
var router = express.Router();
var User = require('../Models/User')

//Render Login Page
router.get('/login', function(req, res) {
    res.render('login', {
      user: req.user
    });
  });

//Login Controller
  router.post('/login', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        req.flash('error', 'No account with that email address exists.');
        return res.redirect('/login');
      } else {
          if (user.password===req.body.password){
            req.flash('success','Welcome!')
            return res.redirect('/')
          } else {
            req.flash('error','Incorrect password')
            return res.redirect('/login')
          }
        
      }
  })});
    module.exports = router;
