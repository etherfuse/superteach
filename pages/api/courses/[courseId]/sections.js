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
  if (session) {
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

//gets all sections for a course
handler.get(async (req, res) => {
  const { courseId } = req.query;
  const { db } = req;

  try {
    const sections = await db
      .collection("sections")
      .find({ courseId: ObjectId(courseId) })
      .sort({ order: 1 })
      .toArray();

    res.status(200).json(sections);
  } catch (error) {
    console.error(error);
    res.status(400).end("An error occurred");
  }
});

export default handler;
