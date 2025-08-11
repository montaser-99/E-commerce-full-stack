import Sub_Category from "../models/subcategory.model.js"
import Category from "../models/category.model.js"


// Add sub category 


export const AddSubCategory = async (req, res, next) => {
    try {
        const { name, image, category } = req.body
        if (!name || !image || !category) {
            return res.status(400).json({
                message: "Please provide all required fields: name, image, and category.",
                error: true,
                success: false
            })
        }
        const checkcategory = await Category.findById(category)
        if (!checkcategory) {
            return res.status(400).json({
                message: "The specified category does not exist",
                error: true,
                success: false
            })

        }

        const subCategoryData = {
            name,
            image,
            category: checkcategory._id,
        }
        const newSubCategory = new Sub_Category(subCategoryData)
        const savedSubcategory = await newSubCategory.save()
        if (!savedSubcategory) {
            return res.status(400).json({
                message: "unable to save",
                error: true,
                success: false
            })

        }
        return res.status(200).json({
            message: "SubCategory Added Successfully",
            error: false,
            success: true,
            data: savedSubcategory
        })
    }


    catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        })
    }


}
// /////////////
export const GetAllSubCategories = async (req, res, next) => {
    try {
        const data = await Sub_Category.find().sort({ createdAt: -1 })
        return res.json({
            message: "Sub Category data",
            data: data,
            error: false,
            success: true
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// /////////////
// Update category
export const UpdateSubcategory = async (req, res, next) => {
    try {
        const { _id, name, image, category } = req.body;

        // Validate ID
        if (!_id) {
            return res.status(400).json({
                message: "Please provide a valid _id.",
                error: true,
                success: false,
            });
        }

        // Check if subcategory exists
        const checkSub = await Sub_Category.findById(_id);
        if (!checkSub) {
            return res.status(404).json({
                message: "Subcategory not found. Check your _id.",
                error: true,
                success: false,
            });
        }

        // Update subcategory
        const updateSubCategory = await Sub_Category.findByIdAndUpdate(
            _id,
            { name, image, category },
            { new: true } // return updated document
        );

        return res.json({
            message: "Updated successfully",
            data: updateSubCategory,
            error: false,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};
///////////////////////
export const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Please provide subcategory ID.",
                error: true,
                success: false,
            });
        }
        const existingSub = await Sub_Category.findById(id);
        if (!existingSub) {
            return res.status(404).json({
                message: "Subcategory not found.",
                error: true,
                success: false,
            });
        }
        const deletedSub = await Sub_Category.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Subcategory deleted successfully.",
            data: deletedSub,
            error: false,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false,
        });
    }
};
// //////////////////////////////////////////////////////








