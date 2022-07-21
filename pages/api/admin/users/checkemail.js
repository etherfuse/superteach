//For Check availability of user using email (only for admins)
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
const { ObjectId } = require("mongodb");
import ncoptions from "@/config/ncoptions";
const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  const session = await getSession({ req });
  if (session && session.user.roles.includes("admin")) {
    req.sessionUser = session.user;
    const client = await clientPromise;
    req.db = client.db();
    next();
  } else {
    res.status(401).end("You don't have permission to do this");
    return;
  }
});

handler.post(async (req, res) => {
  const { email } = req.body;
  const db = req.db;
  if (email) {
    try {
      const user = await db.collection("users").findOne({ email });
      if (user) {
        res.json({ available: false });
      } else {
        res.json({ available: true });
      }
      return;
    } catch (error) {
      res.status(500).end({ error: error.message });
      return;
    }
  }

  res.status(400).end("No email provided");
});

export default handler;
