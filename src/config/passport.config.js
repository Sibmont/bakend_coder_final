import passport from "passport";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import local from "passport-local";
import usersModel from "../dao/managers/dbManagers/models/users.model.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import config from "./config.js";
import { passportStrategiesEnum } from "./enums.js";

// Create local strategy
const LocalStrategy = local.Strategy;

// Create jwt strategy
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  // Local Register implementation
  passport.use(
    passportStrategiesEnum.LOCALREGISTER,
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;
          const user = await usersModel.findOne({ username });

          if (user) return done(null, false);

          const lastLogin = new Date();

          const userToSave = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            last_login: lastLogin,
          };

          const result = await usersModel.create(userToSave);
          return done(null, result);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // Local Login implementation
  passport.use(
    passportStrategiesEnum.LOCALLOGIN,
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });

          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false);
          }

          const lastLogin = new Date();

          user.last_login = lastLogin;
          await usersModel.findOneAndUpdate(
            { email: username },
            { last_login: lastLogin }
          );
          // console.log(user);

          return done(null, user);
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  //   Github register implementation
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.b0c7adbc6d614b21",
        clientSecret: "1f81536d95d129fd9467c6105d9b2d10bee6cb5b",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          const user = await usersModel.findOne({ email });

          const lastLogin = new Date();

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email,
              last_login: lastLogin,
            };

            const result = await usersModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Incorrect credentials");
        }
      }
    )
  );

  // JWT "Current" authentication
  passport.use(
    passportStrategiesEnum.JWT,
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.PRIVATE_KEY_JWT,
      },
      async (jwt_payload, done) => {
        try {
          // const lastLogin = new Date();
          // jwt_payload.user.last_login = lastLogin;
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

export { initializePassport };
