import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddressList from "../components/AddressList";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { displaydiscount } from '../Utils/Displaypricediscount';
import { fetchCartItem } from '../store/cartSlice';
import { useDispatch } from "react-redux";
function Checkout() {
  const cartList = useSelector((state) => state.cart.cart);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const totalOriginalPrice = cartList.reduce((acc, item) => {
    return acc + (item.productId.price * item.quantity);
  }, 0);

  const totalAmount = cartList.reduce((acc, item) => {
    const discountedPrice = displaydiscount(item.productId.price, item.productId.discount);
    return acc + discountedPrice * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const items = cartList.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post(
        "/api/order/cash",
        {
          addressId: selectedAddress._id,
          list_items: items,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Order placed successfully");
        dispatch(fetchCartItem());

        navigate("/profile/my-orders");
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    const items = cartList.map((item) => ({
      product_details: {
        name: item.productId.name,
        image: item.productId.image[0],
      },
      price: item.productId.price,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post(
        "/api/order/online-payment",
        {
          cartItems: items,
          addressId: selectedAddress._id,
        },
        { withCredentials: true }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Failed to redirect to payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing online payment");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Checkout</h3>
      <div className="row g-4">
        {/* Addresses Section */}
        <div className="col-md-8">
          <h5 className="mb-3">Select Delivery Address</h5>
          <AddressList
            mode="select"
            onSelect={(address) => {
              setSelectedAddress(address);
            }}
          />
        </div>

        {/* Order Summary Section */}
        <div className="col-md-4">
          <h5 className="mb-3">Order Summary</h5>
          <div className="card p-3">
            {cartList.map((item) => {
              const originalPrice = item.productId.price * item.quantity;
              const discountedPrice = displaydiscount(item.productId.price, item.productId.discount) * item.quantity;
              return (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <span>{item.productId.name} x {item.quantity}</span>
                    <br />
                    <small className="text-muted text-decoration-line-through">
                      ${originalPrice.toFixed(2)}
                    </small>
                    <br />
                    <small className="fw-bold text-success">
                      ${discountedPrice.toFixed(2)}
                    </small>
                  </div>
                  <img
                    src={item.productId.image[0]}
                    alt=""
                    className="w-25 h-auto rounded"
                  />
                </div>
              );
            })}
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <div className="text-end">
                <div className="text-muted text-decoration-line-through">
                  ${totalOriginalPrice.toFixed(2)}
                </div>
                <div className="text-success">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <button
              className="mt-3 w-100 btn btn-primary"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
            >
              Place Order
            </button>

            <button
              className="mt-2 w-100 btn btn-success"
              onClick={handleOnlinePayment}
              disabled={!selectedAddress}
            >
              Pay Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
