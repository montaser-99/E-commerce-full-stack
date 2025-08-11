import uploadImageClodinary from "../utils/uoloadimage.js"

export const UploadImageController = async (req, res, next) => {
    try {
        const file = req.file
        const uploadimage = await uploadImageClodinary(file)
        if (!uploadimage || !uploadimage.secure_url) {
            return res.status(500).json({
                message: "Image upload failed",
                error: true,
                success: false
            });
        }
        return res.json({
            message: "Upload done",
            data: uploadimage,
            success: true,
            error: false
        });


    }
    catch (error) { 
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        })

    }



}
