const User = require('./user.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

authFailed = (res) => {
  res.status(401).json({
    message: 'Authentication Failed!'
  });
}

module.exports = {
  signup : (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
        firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(user => {
            res.status(201).json({
              message: 'User created',
              user: user
            });
          }).catch(err => {
            res.status(500).send(err);
          });
      });
  },

  login : (req, res) => {
    let userResult;
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return authFailed(res);
        }
        userResult = user;
        return bcrypt.compare(req.body.password, user.password)
      })
      .then(compared => {
        if (!compared) {
          return authFailed(res);
        }
        const token = jwt.sign({ email: userResult.email, userId: userResult._id },
                        'this_is_for_temporary',
                        { expiresIn: '1h' });
        
        res.status(200).json({
          token: token
        })
      }).catch(err => {
        return authFailed(res);
      })
  }
}