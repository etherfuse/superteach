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

//edit order of sections
handler.put(async (req, res) => {
  const { courseId, sectionId } = req.query;
  const { oldIndex, newIndex } = req.body;
  const { db } = req;

  try {
    //get the section that is being moved from sections
    const section = await db.collection("sections").findOne({
      _id: ObjectId(sectionId),
    });

    //if the section is not found
    if (!section) {
      res.status(400).end("Section not found");
      return;
    }

    //reorder sections using the oldIndex and newIndex of the section
    if (oldIndex < newIndex) {
      //move down
      await db.collection("sections").updateMany(
        {
          courseId: ObjectId(courseId),
          order: { $gt: oldIndex, $lte: newIndex },
        },
        { $inc: { order: -1 } }
      );
    } else {
      //move up
      await db.collection("sections").updateMany(
        {
          courseId: ObjectId(courseId),
          order: { $gte: newIndex, $lt: oldIndex },
        },
        { $inc: { order: 1 } }
      );
    }

    //update the section order
    await db
      .collection("sections")
      .updateOne({ _id: ObjectId(sectionId) }, { $set: { order: newIndex } });

    res.status(200).json("Section order updated");
  } catch (error) {
    console.error(error);
    res.status(500).end("An error occurred. Please try again later.");
  }
});

export default handler;
