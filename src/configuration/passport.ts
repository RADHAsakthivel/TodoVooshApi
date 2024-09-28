import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../modules/Entity";
import { DataSource } from "typeorm";

export function passPortConfig(dbContext: DataSource): void {
  const googleClientId = process.env.TODO_GOOGLE_CLIENT_ID as string;
  const googleClientSecret = process.env.TODO_GOOGLE_CLIENT_SECRET as string;
  console.log("googleClientId =>", googleClientId, googleClientSecret);
  const userRepo = dbContext.getRepository(User);
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: "/auth/google/callback",
        scope: [
          process.env.TODO_GOOGLE_SCOPE_EMAIL as string,
          process.env.TODO_GOOGLE_SCOPE_PROFILE as string,
        ],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create a user in your database
          const mails = profile?.emails;
          if (mails?.length) {
            let userData = await userRepo.findOne({
              where: { email: mails[0].value },
            });
            if (!userData && profile?.emails?.length) {
              userData = userRepo.create({
                email: mails[0].value,
                firstName: `${profile?.name?.givenName} ${profile?.name?.familyName}`,
              });
              await userRepo.save(userData);
            }
            return done(null, userData || profile);
          }
          return done(null, profile);
        } catch (error) {
          console.error("Error during google authentication:", error);
          return done(error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
    done(null, user);
  });

  passport.deserializeUser(
    (id: any, done: (error: any, user?: any) => void) => {
      done(null, id);
    }
  );
}
