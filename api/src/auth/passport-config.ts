import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export default function configurePassport(passport: any) {
  passport.use(
    new LocalStrategy(
      async (
        username: string,
        password: string,
        done: (error: any, user?: any, info?: any) => void
      ) => {
        try {
          const user = await User.findOne({
            username: new RegExp(`^${username}$`, "i"),
          });
          if (!user) return done(null, false, { message: "User not found" });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
            return done(null, false, { message: "Incorrect password" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(
    async (id: string, done: (error: any, user?: any) => void) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  );
}
