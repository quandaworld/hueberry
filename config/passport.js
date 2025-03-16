const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That username is not registered",
            });
          }

          // Check if password is correct using comparePassword method
          const isMatch = user.comparePassword(password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });
};

module.exports = passportConfig;
