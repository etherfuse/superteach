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
  const { page, sort, order, limit, role } = req.query;

  if (!page || !sort || !order || !limit) {
    console.error("You need to provide page, sort and order query params");
    res
      .status(400)
      .end("You need to provide page, sort and order query params");
    return;
  }

  const users = await db
    .collection("users")
    .aggregate([
      {
        $match: {},
      },
      {
        $sort: {
          [sort]: order === "asc" ? 1 : -1,
        },
      },
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
    ])
    .toArray();

  const usersCount = await db.collection("users").countDocuments();

  res.json({
    users,
    count: usersCount,
    totalPages: Math.ceil(usersCount / limit),
  });
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
    console.error(error);
    res
      .status(500)
      .json({ error: error.message, message: "Error Creando Usuario" });
  }
});

export default handler;
