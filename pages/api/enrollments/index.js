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
handler.put(async (req, res) => {
  const { courseId, lessonId, lastLesson = false } = req.body;
  const { db } = req;
  const userId = req.sessionUser.id;

  try {
    //get enrollment for the user
    const enrollment = await db.collection("enrollments").findOne({
      courseId: ObjectId(courseId),
      userId: ObjectId(userId),
    });

    if (!enrollment) {
      res.status(404);
      res.send();
      return;
    }

    const newCompletedLessons = [...enrollment.completedLessons, lessonId];
    //delete duplicate lessonIds
    const uniqueCompletedLessons = newCompletedLessons.filter(
      (lesson, index) => newCompletedLessons.indexOf(lesson) === index
    );

    const courseCompleted = lastLesson;

    //update completedlessons in the enrollment of the user
    await db.collection("enrollments").findOneAndUpdate(
      {
        courseId: ObjectId(courseId),
        userId: ObjectId(userId),
      },
      {
        $set: {
          completedLessons: uniqueCompletedLessons,
          courseCompleted,
        },
      },
      {
        returnOriginal: false,
      }
    );

    res.json({ message: "ok" });
  } catch (error) {
    res.status(500).end("Server error");
  }
});

export default handler;
