import Address from "../models/address.model.js";
import User from "../models/user.model.js";

// ✅ Add Address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userid;
    const { address_line, city, state, pincode, country, mobile } = req.body;
     const existingAddress = await Address.findOne({
      userId,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
    });

    if (existingAddress) {
      return res.status(400).json({
        message: "Address already exists",
        success: false,
        error: true,
      });
    }


    const newAddress = new Address({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId,
    });

    const savedAddress = await newAddress.save();

    await User.findByIdAndUpdate(userId, {
      $push: { address_details: savedAddress._id }
    },{new:true});

    return res.json({
      message: "Address created successfully",
      success: true,
      error: false,
      data: savedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// ✅ Get All Addresses
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await Address.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      message: "List of addresses",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// ✅ Update Address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params; 
    const { address_line, city, state, pincode, country, mobile } = req.body;

  const updated = await Address.findOneAndUpdate(
  { _id: id, userId },
  { address_line, city, state, country, pincode, mobile },
  { new: true }
);

    return res.json({
      message: "Address updated successfully",
      success: true,
      error: false,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;


    const deleted = await Address.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({
        message: "Address not found",
        success: false,
        error: true,
      });
    }

   
    await User.findByIdAndUpdate(userId, {
      $pull: { address_details: id },
    });

  
    return res.json({
      message: "Address deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};
