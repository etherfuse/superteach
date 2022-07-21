//USERS API ROUTE for logged in users
import nc from "next-connect";
import clientPromise from "@/lib/mongodb";
import { dateNowUnix } from "@/utils/dates";
import getCloudinary from "@/config/cloudinary";
import parsemultiPartyForm from "@/utils/parseMultiPartyForm";
const multer = require("multer");
import ncoptions from "@/config/ncoptions";
import { getSession } from "next-auth/react";
const { ObjectId } = require("mongodb");

const upload = multer({ dest: "/tmp" });
const handler = nc(ncoptions); //middleware next conect handler
const cloudinary = getCloudinary(); //gets configuration from utils/getcloudinary.js

//MIDDLEWARE
handler.use(async (req, res, next) => {
  //gets session and connects to DB Client if authenticated
  //parses form data using multiparty
  try {
    await parsemultiPartyForm(req);
  } catch (error) {
    console.log("error parsing form data request", error);
    res.status(500).json({ error });
    return;
  }

  //get session to check access
  const session = await getSession({ req });
  if (session) {
    req.sessionUser = session.user;
    const client = await clientPromise;
    req.db = client.db();
    next();
  } else {
    res.status(401).end("You are not authorized");
    return;
  }
});

//GET USER
handler.get(async (req, res) => {
  const { id } = req.query;
  const db = req.db;
  if (id == req.sessionUser.id) {
    const { name, email, image, updatedAt } = await db
      .collection("users")
      .findOne({ _id: ObjectId(id) });
    res.json({ name, email, image, updatedAt });
  } else {
    console.log("Can´t read profile, id from query does not match session id");
    res.status(401).end("You are trying to read a different user profile");
  }
});

//PUT USER
handler.put(async (req, res) => {
  //updates user profile name using email and id from session
  const db = req.db;
  const { name } = req.body;
  const { email } = req.sessionUser;

  const { id } = req.query;
  //check if id from query matches session id
  if (id == req.sessionUser.id) {
    //object to update in db after uploading image (if exists)
    const user = {
      name,
      updatedAt: dateNowUnix(),
    };

    //update user profile picture in cloudinary
    if (req.files) {
      //setting up multer for uploads to cloudinary
      const { userImage } = req.files;
      if (userImage) {
        upload.single("userImage");
        try {
          const userImageUpload = await cloudinary.uploader.upload(
            userImage[0].path,
            {
              folder: `users_${process.env.NODE_ENV}`,
              public_id: `${id}/profile`,
              overwrite: true,
              width: 250,
              height: 250,
              crop: "fill",
              format: "jpg",
            }
          );
          user.image = userImageUpload.secure_url;
        } catch (error) {
          console.log("error uploading profile image to cloudinary", error);
        }
      }
    }
    //update userProfile in DB
    const { value } = await db
      .collection("users")
      .findOneAndUpdate({ email: email, _id: ObjectId(id) }, { $set: user });

    // return user only with email, name and image values from value object
    console.log(`User ${value.email} updated profile successfully`);
    res.json({
      message: "User updated successfully",
      user: {
        email: value.email,
        name: value.name,
        image: value.image,
      },
    });
  } else {
    console.log(
      "Can´t update profile, id from query does not match session id"
    );
    res.status(401).end("You are trying to update a different user profile");
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
