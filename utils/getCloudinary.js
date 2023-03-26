//returns the cloudinary lib instance w the cloudinary config ready to use

import { v2 as cloudinary } from "cloudinary";

const getcloudinary = function () {
  if (process.env.CLOUDINARY_URL) {
    const {
      hostname: cloud_name,
      username: api_key,
      password: api_secret,
    } = new URL(process.env.CLOUDINARY_URL);

    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });

    return cloudinary;
  }
};

export default getcloudinary;
