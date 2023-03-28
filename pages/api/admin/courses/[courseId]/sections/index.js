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

//add new section
handler.post(async (req, res) => {
  const { courseId } = req.query;
  const { name } = req.body;
  const { db } = req;
  const { _id } = req.sessionUser;

  try {
    const course = await db
      .collection("courses")
      .findOne({ _id: ObjectId(courseId) });

    if (!course) {
      res.status(400).end("Course not found");
      return;
    }

    //get the last section in the course to get the order
    const lastSection = await db
      .collection("sections")
      .findOne({ courseId: ObjectId(courseId) }, { sort: { order: -1 } });

    const newSection = {
      name,
      createdAt: dateNowUnix(),
      createdBy: ObjectId(_id),
      updatedAt: dateNowUnix(),
      courseId: ObjectId(courseId),
      order: lastSection ? lastSection.order + 1 : 0,
    };

    await db.collection("sections").insertOne(newSection);
    res.status(200).json("Section added");
  } catch (error) {
    console.error(error);
    res.status(400).end("An error occurred");
  }
});

export default handler;
