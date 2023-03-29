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

handler.post(async (req, res) => {
  const { courseId, sectionId } = req.query;
  const { title, markdown } = req.body;
  const { db } = req;
  const { id: userId } = req.sessionUser;

  try {
    const newLesson = {
      title,
      markdown,
      createdAt: dateNowUnix(),
      updatedAt: dateNowUnix(),
      createdBy: ObjectId(userId),
      updatedBy: ObjectId(userId),
      courseId: ObjectId(courseId),
      sectionId: ObjectId(sectionId),
    };

    //get lessons of the section to define the order
    const lessons = await db
      .collection("lessons")
      .find({ sectionId: ObjectId(sectionId) })
      .toArray();

    //define order
    if (lessons.length > 0) {
      newLesson.order = lessons[lessons.length - 1].order + 1;
    } else {
      newLesson.order = 1;
    }

    //save lesson in lessons collection with courseId and sectionId as references
    await db.collection("lessons").insertOne(newLesson);
    res.status(200).end("Lesson created");
  } catch (error) {
    console.error(error);
    res.status(500).end("Error creating lesson");
  }
});

export default handler;
