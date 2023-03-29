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

//get lesson
handler.get(async (req, res) => {
  const { lessonId, sectionId, courseId } = req.query;
  const { db } = req;

  try {
    const lesson = await db.collection("lessons").findOne({
      _id: ObjectId(lessonId),
    });

    if (!lesson) {
      res.status(404).end("lesson not found");
      return;
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).end("An error occurred. Please try again later.");
  }
});

//edit lesson
handler.put(async (req, res) => {
  const { sectionId, lessonId, courseId } = req.query;
  const { name, markdown, order } = req.body;
  const { db } = req;

  try {
    const lesson = await db.collection("lessons").findOne({
      _id: ObjectId(lessonId),
    });

    if (!lesson) {
      res.status(404).end("lesson not found");
      return;
    }

    await db.collection("lessons").updateOne(
      {
        _id: ObjectId(lessonId),
      },
      {
        $set: {
          name,
          markdown,
          updatedAt: dateNowUnix(),
        },
      }
    );

    res.status(200).json({ message: "Lesson updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).end("An error occurred. Please try again later.");
  }
});

export default handler;
