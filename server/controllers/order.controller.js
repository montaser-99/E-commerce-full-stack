import Product from '../models/product.js';
import Order from '../models/order.model.js';
import CartProduct from '../models/cartproduct.model.js';
import Address from '../models/address.model.js';
import User from '../models/user.model.js';
import Stripe from "stripe";
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const shippingFee = 50;

function pricewithDiscount(price, discount) {
  return Math.floor(price - (price * discount) / 100);
}


export async function CashOnDeliveryOrder(req, res) {
  try {
    const userId = req.userid;
    console.log("User ID from token:", userId, "Type:", typeof userId);

    const { list_items, addressId } = req.body;

    let subTotalAmt = 0;

    const products = await Promise.all(
      list_items.map(async (item) => {
        const product = await Product.findById(item.productId?._id || item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId._id}`);

        const quantity = item.quantity;
        const priceAfterDiscount = pricewithDiscount(product.price, product.discount);
        const totalForThisProduct = priceAfterDiscount * quantity;

        subTotalAmt += totalForThisProduct;

        return {
          productId: product._id,
          quantity,
          product_details: {
            name: product.name,
            image: product.image,
          },
        };
      })
    );

    const totalAmt = subTotalAmt + shippingFee;

    const orderData = {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      products,
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt,
      totalAmt,
    };

    const newOrder = await Order.create(orderData);

   
    const cartBefore = await CartProduct.find({ userId: new mongoose.Types.ObjectId(userId) });
    // console.log("Cart before delete:", cartBefore);

    const deleteResult = await CartProduct.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    // console.log("Delete result:", deleteResult);

    const cartAfter = await CartProduct.find({ userId: new mongoose.Types.ObjectId(userId) });
    // console.log("Cart after delete:", cartAfter);

    await User.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.json({
      message: "Order placed successfully",
      success: true,
      error: false,
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function getUserOrders(req, res) {
  try {
    const userId = req.userid;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    return res.json({
      message: "Orders fetched successfully",
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch orders",
      success: false,
      error: true,
    });
  }
}

// ✅ Stripe Session
export const Onlinepayment = async (req, res) => {
  const { cartItems, addressId } = req.body;

  try {
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product_details.name,
          images: [item.product_details.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: req.userId,
        addressId: addressId || '',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Stripe session creation failed",
      error: true,
      success: false,
    });
  }
};

// ✅ Stripe Webhook
export async function webhookStripe(req, res) {
    console.log("✅ Stripe Webhook Triggered");
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(" Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const userId = session.metadata.userId;

    const orderProduct = await getOrderProductItems({
      lineItems,
      userId,
      addressId: session.metadata.addressId,
      paymentId: session.payment_intent,
      payment_status: session.payment_status,
    }); 

    const order = await Order.insertMany(orderProduct);
    console.log("✅ Order created from Stripe:", order);


    if (Boolean(order[0])) {
      await User.findByIdAndUpdate(userId, { shopping_cart: [] });
      await CartProduct.deleteMany({ userId });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

// ✅ Helper: بناء الأوردر بناءً على بيانات Stripe
async function getOrderProductItems({ lineItems, userId, addressId, paymentId, payment_status }) {
  let subTotalAmt = 0;

  const products = await Promise.all(
    lineItems.data.map(async (item) => {
      const product = await Product.findOne({ name: item.description });
      if (!product) throw new Error(`Product not found for name: ${item.description}`);

      const quantity = item.quantity;
      const priceAfterDiscount = pricewithDiscount(product.price, product.discount);
      const total = priceAfterDiscount * quantity;

      subTotalAmt += total;

      return { 
        productId: product._id,
        quantity,
        product_details: {
          name: product.name,
          image: product.image,
        },
      };
    })
  );

  const totalAmt = subTotalAmt + shippingFee;

  return [{
    userId,
    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
    products,
    paymentId,
    payment_status,
    delivery_address: addressId,
    subTotalAmt,
    totalAmt,
  }];
}
