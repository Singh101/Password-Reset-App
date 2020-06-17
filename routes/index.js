var express = require('express');
var router = express.Router();

//Render Home Page
router.get('/', function(req, res) {
    res.render('../views/index', { title: 'Express' });
  });

  //Create New User 
router.post('/', async (req, res)=>{
    const user = new user({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
  
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
  
    } catch (err){
        res.status(400).json({message: err.message})
  
    }
  
  })

  module.exports = router;
