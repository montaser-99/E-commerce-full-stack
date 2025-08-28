import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageClodinary = async (image) => {
  try {

    if (Buffer.isBuffer(image)) {
      const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Montaser" }, (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          })
          .end(image);
      });

      return uploadImage;
    }

    if (typeof image === "string") {
      const uploadImage = await cloudinary.uploader.upload(image, {
        folder: "Montaser",
      });
      return uploadImage;
    }

    throw new Error("Invalid image input");
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

export default uploadImageClodinary;
