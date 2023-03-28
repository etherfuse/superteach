//sections API ROUTE for logged in users ADMIN
import nc from "next-connect"; // this is for handling requests middleware
import { getSession } from "next-auth/react"; // this is for getting the session
import clientPromise from "@/lib/mongodb"; // this is for connecting to the database
import dateNowUnix from "@/utils/dates/dateNowUnix"; // this is for getting the current date in unix format
import ncoptions from "@/utils/ncoptions";
import { ObjectId } from "mongodb"; // this is for converting strings to ObjectIds

const handler = nc(ncoptions); // this is for handling requests middleware

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //get session
  const session = await getSession({ req });
  if (session && session.user.roles.includes("admin")) {
    req.sessionUser = session.user;
    const client = await clientPromise; // this is for connecting to the database
    req.db = client.db();
    next();
  } else {
    res.status(401).end("Not authorized");
    return;
  }
});

//get section
handler.get(async (req, res) => {
  const { sectionId } = req.query;
  const { db } = req;

  try {
    const section = await db.collection("sections").findOne({
      _id: ObjectId(sectionId),
    });

    if (!section) {
      res.status(404).end("Section not found");
      return;
    }

    res.status(200).json(section);
  } catch (error) {
    console.error(error);
    res.status(500).end("An error occurred. Please try again later.");
  }
});

//edit section
handler.put(async (req, res) => {
  const { sectionId } = req.query;
  const { name, order } = req.body;
  const { db } = req;

  try {
    const section = await db.collection("sections").findOne({
      _id: ObjectId(sectionId),
    });

    if (!section) {
      res.status(404).end("Section not found");
      return;
    }

    await db.collection("sections").updateOne(
      {
        _id: ObjectId(sectionId),
      },
      {
        $set: {
          name,
          updatedAt: dateNowUnix(),
        },
      }
    );

    res.status(200).json({ message: "Section updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).end("An error occurred. Please try again later.");
  }
});

export default handler;
