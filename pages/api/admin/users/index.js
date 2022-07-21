//USERS API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";

const handler = nc(ncoptions);

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  //TODO: check later how to check using JWT instead of session...
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

//GET USERS
handler.get(async (req, res) => {
  const db = req.db;
  //get all users sorted by newest

  const users = await db
    .collection("users")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  res.json(users);
});

export default handler;
