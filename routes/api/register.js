// Author:       Michael Torres
// Filename:     register.js
// Description:  The purpose of this file is to route to the register route

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

// @route     GET api/users/register
// @desc      Register a user route
// @access    Public
router.get('/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Authenticate user & get token
// @access    Public
router.post(
  '/login',
  [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'Password field cannot be empty').exists(),
  ],
  async (req, res) => {
    // Handle response
    const errors = validationResult(req);

    // check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      let user = await User.findOne({email});

      if (!user) {
        return res.status(400).json({errors: [{msg: 'Invalid credentials!'}]});
      }

      const passWordsMatch = await bcrypt.compare(password, user.password);

      if (!passWordsMatch) {
        return res.status(400).json({errors: [{msg: 'Invalid credentials!'}]});
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(data, config.secretOrKey, {expiresIn: 360000}, (err, token) => {
        if (err) throw err;
        res.json({token});
      });
    } catch (err) {
      console.error(err.message).send('Server Error');
    }
  }
);

module.exports = router;
