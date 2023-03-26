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
  const slug = req?.query?.slug;
  if (!slug) {
    res.status(400).end("No slug provided");
    return;
  }

  try {
    //get course from db
    const course = await req.db.collection("courses").findOne({ slug });
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

//UPDATE COURSE
handler.put(async (req, res) => {
  const db = req.db;
  const { slug } = req.query;
  const { name, description } = req.body;
  if (!slug) {
    res.status(400).end("No course slug provided");
    return;
  }

  const courseNewData = {
    name,
    description,
    updatedAt: dateNowUnix(),
  };

  try {
    //check if course exists
    const course = await db.collection("courses").findOne({ slug });

    if (!course) {
      res.status(404).end("Course not found");
      return;
    }

    //Check files
    if (req.files) {
      const { cover } = req.files;
      console.log("cover", cover);
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
          console.log("uploaded cover to cloudinary", coverUpload.secure_url);
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
      { slug }, //filter
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
