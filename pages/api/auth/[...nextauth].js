import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import EmailProvider from "next-auth/providers/email";
import clientPromise from "@/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import dateNowUnix from "@/utils/dates/dateNowUnix";
import nodemailer from "nodemailer";
import html from "@/utils/emailtemplates/verify-email";
import sendinblueLib from "@/lib/sendinblueLib";

export default NextAuth({
  secret: process.env.BASE_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: { jwt: true }, // Use JSON Web Tokens for session instead of database sessions.
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async jwt(token, user, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      if (user?.roles) {
        token.roles = user.roles;
      }
      return token;
    },
    async session(session, token) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token?.roles) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  events: {
    signIn: async (ctx) => {
      //when sign in, update db with last sign in time
      const { user, isNewUser } = ctx;
      try {
        if (isNewUser) {
          user.roles = ["user"];
          user.createdAt = dateNowUnix();
          user.updatedAt = dateNowUnix();
          user.lastLogin = dateNowUnix();
        } else {
          user.lastLogin = dateNowUnix();
        }
        // Save the updated user to the database
        const client = await clientPromise;
        await client
          .db()
          .collection("users")
          .updateOne({ email: user.email }, { $set: user });

        console.info(`${user.email} logged in and updated in DB =>`);

        //send new user to sendinblue if new user
        //and add it to a list
        if (process.env.NODE_ENV === "production") {
          try {
            const sendinblueUser = {
              email: user.email,
              listIds: process.env.SENDINBLUE_LIST_IDS,
              attributes: {
                NAME: user.name || "",
              },
            };

            await sendinblueLib.createOrUpdateContact(sendinblueUser);
            console.info("user added to sendinblue and lists ");
          } catch (error) {
            console.error("error sending new user to sendinblue", error);
          }
        }
      } catch (error) {
        console.error(
          `Error udating user ${user.email} in signinevent:`,
          error
        );
      }
    },
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: "superhappydevhousemx@gmail.com",
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(server);
        sendVerificationEmail(transport, email, from, url, host);
      },
    }),

    // ...add more providers here
  ],
});

// EXTRA NEXT AUTH OVERRIDE FUNCTIONS
//function to send verification email using nodemailer and next-auth
const sendVerificationEmail = async (transport, email, from, url, host) => {
  try {
    await transport.sendMail({
      to: email,
      from,
      subject: `Log In in  ${host}`,
      text: `Log in in ${host}`,
      html: html({ url, host, email }),
    });
    console.info("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
