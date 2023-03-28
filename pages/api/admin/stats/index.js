//Stats API ROUTE for logged in users
import nc from "next-connect";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
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
    res.status(401).end("No tienes permiso para esta acción");
    return;
  }
});

//GET STATS
handler.get(async (req, res) => {
  const db = req.db;
  //returns count of users
  const users = await db.collection("users").countDocuments();
  const courses = await db.collection("courses").countDocuments();
  const stats = [
    { name: "users", nameEs: "usuarios", stat: users },
    { name: "courses", nameEs: "cursos", stat: courses },
  ];

  return res.json(stats);
});

export default handler;
