import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { useDispatch } from 'react-redux';
import { handleAddItemCart } from '../store/cartSlice';
import { fetchCartItem } from '../store/cartSlice';



const AddToCartButton = ({ product }) => {
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const itemInCart = cart.find(item => item.productId._id === product._id);
  const qty = itemInCart?.quantity || 0;

  const handleAdd = async e => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await Axios({ ...SummaryApi.AddToCart, data: { productId: product._id } });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async newQty => {
    if (!itemInCart) return;
    try {
      const res = await Axios({
        ...SummaryApi.UpdateCart,
        data: { _id: itemInCart._id, qty: newQty },
      });
      if (res.data.success) {
        toast.success("Quantity updated");
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async () => {
    if (!itemInCart) return;
    try {
      const res = await Axios({
        ...SummaryApi.DeleteCart,
        data: { _id: itemInCart._id },
      });
      if (res.data.success) {
        toast.success("Item removed");
        dispatch(fetchCartItem());
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-[150px]">
      {itemInCart ? (
        <div className="d-flex justify-content-between w-100 h-100">
          <button onClick={() => (qty === 1 ? deleteItem() : updateQty(qty - 1))} className="btn bg-success">
            <FaMinus />
          </button>
          <p className="flex-1 font-semibold px-1 flex items-center justify-center">{qty}</p>
          <button onClick={() => updateQty(qty + 1)} className="btn bg-success">
            <FaPlus />
          </button>
        </div>
      ) : (
        <button onClick={handleAdd} className="btn bg-success">
          {loading ? "loading" : "Add"}
        </button>
      )}
    </div>
  );
};


export default AddToCartButton;
