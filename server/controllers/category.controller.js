import Category from "../models/category.model.js"
import Sub_Category from "../models/subcategory.model.js"
import Product from "../models/product.js"




export const AddCategory = async (req, res, next) => {
    try {
        const { name, image } = req.body

        if (!name || !image) {
            return res.status(400).json({
                message: "please add name and image for category",
                error: true,
                success: false
            })
        }
        const categorydata = {
            name,
            image
        }
        const category = await Category.findOne({ name })
        if (category) {
            return res.status(400).json({
                message: "this category already exist",
                error: true,
                success: false
            })
        }
        const newCategory = new Category(categorydata)
        const savedcategory = await newCategory.save()
        if (!savedcategory) {
            return res.status(400).json({
                message: "failed to save category",
                error: true,
                success: false
            })

        }
        return res.status(200).json({
            message: "category added successfully ",
            error: false,
            success: true
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
//  GET ALL CATEGORIES
export const GetAllCategories = async (req, res, next) => {
    try {
        const data = await Category.find().sort({ createdAt: -1 })
        return res.json({
            data: data,
            error: false,
            success: true
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

// /////UPDATE CATEGORY
export const updateCategory = async (req, res) => {
    try {
        const { _id, name, image } = req.body

        const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            { name, image },
            { new: true }
        )

        return res.json({
            message: "Updated Category",
            success: true,
            error: false,
            data: updatedCategory
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

///////////////
// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;


        const checkSubCategory = await Sub_Category.find({
            category: { "$in": [id] }
        }).countDocuments();

        const checkProduct = await Product.find({
            category: { "$in": [id] }
        }).countDocuments();

        if (checkSubCategory > 0 || checkProduct > 0) {
            return res.status(400).json({
                message: "Category is already in use, can't delete",
                error: true,
                success: false
            });
        }

        const deletedCategory = await Category.deleteOne({ _id: id });

        if (deletedCategory.deletedCount === 0) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

        return res.json({
            message: "Delete category successfully",
            data: deletedCategory,
            error: false,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true
        });
    }
};
