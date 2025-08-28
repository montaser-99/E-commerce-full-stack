import uploadImageClodinary from "../utils/uoloadimage.js";

export const UploadImageController = async (req, res) => {
  try {
    let fileInput;

    if (req.file) {
   
      fileInput = req.file.buffer;
    } else if (req.body.image) {

      fileInput = req.body.image; 
  
    } else {
      return res.status(400).json({
        message: "No image provided",
        error: true,
        success: false,
      });
    }

    const uploadimage = await uploadImageClodinary(fileInput);

    if (!uploadimage || !uploadimage.secure_url) {
      return res.status(500).json({
        message: "Image upload failed",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Upload done",
      data: uploadimage,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};
