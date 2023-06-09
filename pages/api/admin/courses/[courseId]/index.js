//STORES API ROUTE for logged in users ADMIN
const multer = require("multer"); // this is for uploading files
import nc from "next-connect"; // this is for handling requests middleware
import { getSession } from "next-auth/react"; // this is for getting the session
import clientPromise from "@/lib/mongodb"; // this is for connecting to the database
import dateNowUnix from "@/utils/dates/dateNowUnix"; // this is for getting the current date in unix format
import ncoptions from "@/utils/ncoptions";
import getCloudinary from "@/utils/getCloudinary"; // this is for getting the cloudinary configuration
import parseMultiPartyForm from "@/utils/parseMultiPartyForm"; // this is for parsing the form data
import { ObjectId } from "mongodb"; // this is for converting strings to ObjectIds

const handler = nc(ncoptions); // this is for handling requests middleware
const upload = multer({ dest: "/tmp" });
const cloudinary = getCloudinary(); //gets configuration from utils/getcloudinary.js

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //parses form data using multiparty
  try {
    await parseMultiPartyForm(req);
  } catch (error) {
    console.info("error parsing form data request", error);
    res.status(500).json({ error });
    return;
  }

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

//GET SPECIFIC COURSE
handler.get(async (req, res) => {
  const { courseId } = req.query;
  const { db } = req;

  if (!courseId) {
    res.status(400).end("No course id provided");
    return;
  }

  try {
    const course = await db
      .collection("courses")
      .aggregate([
        {
          $match: {
            _id: ObjectId(courseId),
            isPublic: true,
          },
        },
        {
          $lookup: {
            from: "sections",
            let: { course_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$courseId", "$$course_id"],
                  },
                },
              },
              {
                $lookup: {
                  from: "lessons",
                  localField: "_id",
                  foreignField: "sectionId",
                  as: "lessons",
                },
              },
            ],
            as: "sections",
          },
        },
        {
          $addFields: {
            sections: {
              $filter: {
                input: "$sections",
                as: "section",
                cond: { $ne: ["$$section._id", null] },
              },
            },
          },
        },
      ])
      .toArray();

    console.log(course);

    res.status(200).json(course[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

//UPDATE COURSE
handler.put(async (req, res) => {
  const db = req.db;
  const { courseId } = req.query;

  const { name, description, isPublic } = req.body;
  if (!courseId) {
    res.status(400).end("No course id provided");
    return;
  }

  const courseNewData = {
    name,
    description,
    isPublic: isPublic === "true" ? true : false,
    updatedAt: dateNowUnix(),
  };

  try {
    //check if course exists
    const course = await db
      .collection("courses")
      .findOne({ _id: ObjectId(courseId) });

    if (!course) {
      res.status(404).end("Course not found");
      return;
    }

    const { slug } = course;

    //Check files
    if (req.files) {
      const { cover } = req.files;
      if (cover) {
        upload.single("cover");
        //upload image to cloudinary
        try {
          const coverUpload = await cloudinary.uploader.upload(cover[0].path, {
            folder: `courses_${process.env.NODE_ENV}`,
            public_id: `${slug}/cover`,
            overwrite: true,
            width: 1920,
            height: 1080,
            crop: "fill",
            format: "jpg",
          });
          console.info("uploaded cover to cloudinary", coverUpload.secure_url);
          courseNewData.cover = coverUpload.secure_url;
        } catch (error) {
          console.error(
            "error uploading cover to cloudinary Admin Category Creation",
            error
          );
          res.status(500).json({ error });
          return;
        }
      }
    }

    //update course
    const courseUpdated = await db.collection("courses").findOneAndUpdate(
      { _id: ObjectId(courseId) }, //filter
      { $set: courseNewData }, //update
      { returnOriginal: false } //return updated document
    );

    res.status(200).json(courseUpdated.value);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

//this is because we have formdata instead of json
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
