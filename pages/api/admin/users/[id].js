//USERS API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
const { ObjectId } = require("mongodb");
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

//GET USER if it has an ID
handler.get(async (req, res) => {
  const { id } = req.query;
  const db = req.db;
  if (id) {
    //returns a single user with store basic data, if is owner of a store
    const user = await db.collection("users").findOne({ _id: ObjectId(id) });
    const store = await db
      .collection("stores")
      .findOne(
        { ownerId: ObjectId(id) },
        { projection: { _id: 1, slug: 1, name: 1 } }
      );

    if (store) {
      user.store = store;
    }

    res.json(user);
  } else {
    //return error if no id
    res.status(400).end("No userid provided");
  }
});

export default handler;
