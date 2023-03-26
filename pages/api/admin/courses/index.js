//STORES API ROUTE for logged in users ADMIN
const multer = require("multer"); // this is for uploading files
import nc from "next-connect"; // this is for handling requests middleware
import { getSession } from "next-auth/react"; // this is for getting the session
import clientPromise from "@/lib/mongodb"; // this is for connecting to the database
const { ObjectId } = require("mongodb"); // this is for converting strings to ObjectIds
import dateNowUnix from "@/utils/dates/dateNowUnix"; // this is for getting the current date in unix format
import ncoptions from "@/utils/ncoptions";
import getCloudinary from "@/utils/getCloudinary"; // this is for getting the cloudinary configuration
import parsemultiPartyForm from "@/utils/parsemultipartyform"; // this is for parsing the form data
const slugify = require("slugify"); // this is for creating slugs

const handler = nc(ncoptions); // this is for handling requests middleware
const upload = multer({ dest: "/tmp" });
const cloudinary = getCloudinary(); //gets configuration from utils/getcloudinary.js

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //parses form data using multiparty
  try {
    await parsemultiPartyForm(req);
  } catch (error) {
    console.log("error parsing form data request", error);
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

//LIST COURSES
handler.get(async (req, res) => {
  //GET all courses
  const db = req.db;
  const { page, sort, order, limit } = req.query;

  if (!page || !sort || !order || !limit) {
    console.error("You need to provide page, sort and order query params");
    res
      .status(400)
      .end("You need to provide page, sort and order query params");
    return;
  }

  const courses = await db
    .collection("courses")
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

  const coursesCount = await db.collection("courses").countDocuments();

  res.json({
    courses,
    count: coursesCount,
    totalPages: Math.ceil(coursesCount / Number(limit)),
  });
});

//NEW COURSE
handler.post(async (req, res) => {
  //POST new course
  //Creates new COURSE w cover images
  const db = req.db;
  const { name, description } = req.body;
  const session = req.sessionUser;

  try {
    //generate slug from name
    const slug = slugify(name, "_");

    //check if course exists
    const courseExists = await db.collection("courses").findOne({ slug });

    if (courseExists) {
      console.error("Course already exists");
      res.status(400).json({ message: "Course already exists" });
      return;
    }

    //create course
    const courseData = {
      name,
      description,
      slug,
      createdAt: dateNowUnix(),
      updatedAt: dateNowUnix(),
      userId: session.id ? ObjectId(session.id) : null,
    };

    if (req.files) {
      //setting up multer for uploads to cloudinary
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
          courseData.cover = coverUpload.secure_url;
        } catch (error) {
          console.log(
            "error uploading cover to cloudinary Admin Category Creation",
            error
          );
          res.status(500).json({ error });
          return;
        }
      }
    }

    //     //insert course
    await db.collection("courses").insertOne(courseData);
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("error", error);
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
