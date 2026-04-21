import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/User.model";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Configure the Google strategy for use by Passport.
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      proxy: true, // IMPORTANT: Needed for Render SSL termination
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error("No email found from Google profile"));
        }

        // Find existing user by googleId or email
        let user = await UserModel.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (user) {
          // If user exists but doesn't have googleId linked, link it now
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = "google";
            await user.save();
          }
          return done(null, user);
        }

        // If no user exists, create a new one
        user = await UserModel.create({
          email: email,
          name: profile.displayName || "Google User",
          googleId: profile.id,
          authProvider: "google",
          role: "user",
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
