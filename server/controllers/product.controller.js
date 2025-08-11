import Product from "../models/product.js";
import mongoose from "mongoose";
// CREATE PRODUCT
export const Createproduct = async (req, res, next) => {
    try {
        // console.log(" Received request to create product");
        const product = req.body;
        const { name, image, category, sub_category, unit, price, description } = product;

        if (!name || !image[0] || !category[0] || !sub_category[0] || !unit || !price || !description) {
            console.log(" Missing required fields");
            return res.status(400).json({
                message: "Enter required fields",
                error: true,
                success: false
            });
        }

        const newproduct = new Product(product);
        const savedproduct = await newproduct.save();
        // console.log("Product saved:", savedproduct);

        return res.json({
            message: "Product Created Successfully",
            data: savedproduct,
            error: false,
            success: true
        });
    } catch (error) {
        // console.error("Error in Createproduct:", error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
// /////////////////////////////////
// GET ALL products
export const Getproducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, search } = req.body
        const query = search ? { $text: { $search: search } } : {}
        const skip = (page - 1) * limit
        const [data, totalCount] = await Promise.all(
            [
                Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("category sub_category"),
                // .populate([
                //     { path: 'category', select: 'name' },
                //     { path: 'subCategory', select: 'name' }
                // ]),
                Product.countDocuments(query)
            ]
        )
        return res.status(200).json({
            message: "Product data",
            error: false,
            success: true,
            totalcount: totalCount,
            totalNopages: Math.ceil(totalCount / limit),
            data: data

        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }
}
// ////////////
// UPDATE PRODUCT
export const UpdateProduct = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Please provide _id",
                error: true,
                success: false
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            error: false,
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// //////////
// Delete product 
export const DeleteProduct = async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            return res.status(400).json({
                message: "provide _id ",
                error: true,
                success: false,

            })
        }
        const updatedproduct = await Product.deleteOne({ _id })
        return res.status(200).json({
            message: "product deleted successfully ",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }
}
// //////////////////////////////////////////////////////////////
// Get products by category 
export const Getproductbycategory = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "provide _id",
                error: true,
                success: false,
            });
        }

        const product = await Product.find({ category: { $in: id } });

        if (!product || product.length === 0) {
            return res.status(404).json({
                message: "No products found for this category",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "Category product list",
            data: product,
            error: false,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};
// ///////////////

export const GetProductByCategoryAndSubCategory = async (req, res) => {
    try {
        let { categoryId, subCategoryId, page = 1, limit = 10 } = req.body;


        if (!Array.isArray(categoryId)) {
            categoryId = [categoryId];
        }

        if (!Array.isArray(subCategoryId)) {
            subCategoryId = [subCategoryId];
        }

        if (!categoryId.length || !subCategoryId.length) {
            return res.status(400).json({
                message: "Provide categoryId and subCategoryId",
                error: true,
                success: false,
            });
        }


        const query = {
            category: { $in: categoryId.map(id => new mongoose.Types.ObjectId(id)) },
            sub_category: { $in: subCategoryId.map(id => new mongoose.Types.ObjectId(id)) }
        };

        const skip = (page - 1) * limit;

        const [data, dataCount] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments(query),
        ]);

        return res.json({
            message: "Product list",
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            success: true,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};


// //////////////////////
export const GetproductbyId = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await Product.findOne({ _id: productId })
        if (!product) {
            return res.status(400).json({
                message: "NO Product Found ",
                error: true,
                success: false,
            });
        }
        return res.status(200).json({
            message: "this is product details",
            error: false,
            success: true,
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });

    }
}
// 


export const searchProduct = async (req, res) => {
    try {
        let { search, page, limit } = req.body;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = search
            ? search.trim().includes(" ")
                ? { $text: { $search: search }, publish: true } 
                : {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ],
                    publish: true
                } 
            : { publish: true };



        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category sub_category"),
            Product.countDocuments(query)
        ]);

        return res.status(200).json({
            message: "Product search results",
            success: true,
            error: false,
            data: products,
            totalCount,
            totalPage: Math.ceil(totalCount / limit),
            page,
            limit
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
};
