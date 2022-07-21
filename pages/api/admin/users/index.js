//USERS API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import ncoptions from "@/config/ncoptions";
import { dateNowUnix } from "@/utils/dates";

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

//ADDS USER
handler.post(async (req, res) => {
  const db = req.db;
  const { name, email, roles } = req.body;
  try {
    const user = {
      name,
      email,
      createdAt: dateNowUnix(),
      updatedAt: dateNowUnix(),
      lastLogin: dateNowUnix(),
      emailVerified: false,
    };

    if (!roles) {
      user.roles = ["user"];
    } else {
      const rolesArray = roles.split(",");
      if (rolesArray.includes("admin")) {
        user.roles = ["user", "admin"];
      } else {
        user.roles = ["user"];
      }
    }

    await db.collection("users").insertOne(user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message, message: "Error Creando Usuario" });
  }
});

export default handler;
