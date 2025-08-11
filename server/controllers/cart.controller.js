import CartProduct from "../models/cartproduct.model.js";
import User from "../models/user.model.js"
//     Add TO Cart
export const AddToCart = async (req, res) => {
    try {
        const userId = req.userid;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Provide productId",
                error: true,
                success: false,
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "You must login first",
                error: true,
                success: false,
            });
        }

        const existingItem = await CartProduct.findOne({ userId, productId });

        if (existingItem) {
        
            existingItem.quantity += 1;
            await existingItem.save();
            return res.json({
                data: existingItem,
                message: "Quantity updated",
                error: false,
                success: true,
            });
        }


        const cartItem = new CartProduct({
            productId,
            userId,
            quantity: 1,
        });

        const savedItem = await cartItem.save();

        
      

        return res.json({
            data: savedItem,
            message: "Item added successfully",
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
// //////
// Get Cart Items
export const Getcartitems = async (req, res) => {
    try {
        const userId = req.userid
        const CartItem = await CartProduct.find({ userId }).populate("productId")
        return res.json({
            data: CartItem,
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

// ////////////////////////
// Update Cart Item

export const Updatecartitem = async (req, res) => {
    try {
        const userId = req.userid;
        const { _id, qty } = req.body
        if (!_id || !qty === undefined) {
            return res.status(400).json({
                message: "provide _id, qty"
            })
        }
        const updateCartitem = await CartProduct.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })

        return res.json({
            message: "Update cart",
            success: true,
            error: false,
            data: updateCartitem
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }
}
// ////////////////////////
// Delete Cart Item
export const Deletecartitem = async (req, res) => {
    try {
        const userId = req.userid;
        const { _id } = req.body

        const deleteditem = await CartProduct.deleteOne({ _id, userId })
        return res.json({
            message: "Item remove",
            error: false,
            success: true,
            data: deleteditem
        })

    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }

}
// /////////////////////////////////////