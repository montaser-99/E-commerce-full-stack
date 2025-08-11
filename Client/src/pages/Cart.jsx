import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { fetchCartItem } from '../store/cartSlice';
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { displaydiscount } from '../Utils/Displaypricediscount';

function Cart() {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.cart);

    const subtotal = cart.reduce((acc, item) => {
        const discountedPrice = displaydiscount(item.productId.price, item.productId.discount);
        return acc + discountedPrice * item.quantity;
    }, 0);

    const shipping = 50;
    const total = subtotal + shipping;
    
    const updateCartQty = async (cartItemId, newQuantity) => {
        try {
            await Axios({
                url: SummaryApi.UpdateCart.url,
                method: SummaryApi.UpdateCart.method,
                data: { _id: cartItemId, qty: newQuantity }
            });
            dispatch(fetchCartItem());
        } catch (err) {
            console.log(err);
            toast.error("Error updating quantity");
        }
    };

    const deleteCartItem = async (cartItemId) => {
        try {
            await Axios({
                url: SummaryApi.DeleteCart.url,
                method: SummaryApi.DeleteCart.method,
                data: { _id: cartItemId }
            });
            toast.success("Item removed from cart");
            dispatch(fetchCartItem());
        } catch (error) {
            toast.error("Failed to delete item");
            console.log(error);
        }
    };

    if (!cart || cart.length === 0) {
        return (
            <div className="container vh-100">
                <h2 className="text-center text-xl my-5 py-5 display-1">Your cart is empty</h2>
                <div className="d-flex justify-content-center">
                    <Link to="/" className='btn-1 text-decoration-none'>Back to Home Page</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row row-cols-5 fw-bold">
                <div className="col">Product</div>
                <div className="col">Price</div>
                <div className="col">Quantity</div>
                <div className="col">Subtotal</div>
                <div className="col">Action</div>
            </div>

            {cart.map((item) => {
                const discountedPrice = displaydiscount(item.productId.price, item.productId.discount);
                return (
                    <div key={item._id} className="row row-cols-5 bg-white mb-3 p-3 shadow align-items-center">
                        <div className="col d-flex align-items-center gap-2 flex-column flex-sm-row">
                            <img src={item.productId.image[0]} alt={item.productId.name} style={{ height: "54px", width: "54px" }} />
                            <span>{item.productId.name}</span>
                        </div>
                        <div className="col">
                            ${discountedPrice}
                        </div>
                        <div className="col d-flex align-items-center gap-2">
                            <span>{item.quantity}</span>
                            <div className="d-flex flex-column">
                                <button className="btn p-0" onClick={() => updateCartQty(item._id, item.quantity + 1)}>
                                    <FaArrowUp />
                                </button>
                                <button className="btn p-0" onClick={() => item.quantity > 1 && updateCartQty(item._id, item.quantity - 1)}>
                                    <FaArrowDown />
                                </button>
                            </div>
                        </div>
                        
                        <div className="col">
                            ${Math.floor(discountedPrice * item.quantity)}
                        </div>
                        <div className="col">
                            <button className="btn btn-danger btn-sm" onClick={() => deleteCartItem(item._id)}>
                                <FaTrashAlt /> Delete
                            </button>
                        </div>
                    </div>
                );
            })}

            <div className="row d-flex justify-content-between">
                <div className="col-auto">
                    <Link to="/" className="btn border border-dark">Return To Shop</Link>
                </div>
            </div>

            <div className="row d-flex justify-content-between py-5 my-5">
                <div className="col-lg-4 col-md-12 col-sm-1 border border-2 border-dark p-4">
                    <h2 className="my-3">Cart Total</h2>
                    <div className="d-flex justify-content-between align-items-center my-2">
                        <p>Subtotal:</p>
                        <p>${Math.floor(subtotal)}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center my-2">
                        <p>Shipping:</p>
                        <p>${shipping}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center my-2 fw-bold">
                        <span>Total:</span>
                        <span>${Math.floor(total)}</span>
                    </div>
                    <div className="text-center">
                        <Link to="/checkout" className="btn-1 d-block mx-auto my-4 text-decoration-none">
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
