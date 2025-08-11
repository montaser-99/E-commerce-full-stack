import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAddressModal from "./AddAddress";
import EditAddressModal from "./EditAddress";
import { handleAddAddress, setAllAddresses } from "../store/addressSlice";
import { MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";

function AddressList({ mode = "manage", onSelect }) {
    const dispatch = useDispatch();
    const addressList = useSelector((state) => state.address.addressList);

    const [openAddAddress, setOpenAddAddress] = useState(false);
    const [editAddressData, setEditAddressData] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const selectedAddress = addressList[selectedIndex];

    const handleEdit = (item) => {
        setEditAddressData(item);
    };

    const handleSelect = (index) => {
        setSelectedIndex(index);
        if (onSelect) {
            onSelect(addressList[index]);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this address?");
        if (!confirm) return;

        try {
            const res = await axios.delete(`/api/address/${id}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Address deleted successfully");

                // remove from addressList manually instead of refetching
                const updatedList = addressList.filter((addr) => addr._id !== id);
                dispatch(setAllAddresses(updatedList));
            } else {
                toast.error(res.data.message || "Delete failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };


    return (
        <div>
            {addressList.map((item, index) => (
                <div
                    key={item._id || index}
                    className={`card mb-3 p-3 ${selectedIndex === index ? "border-primary" : ""}`}
                    onClick={() => mode === "select" && handleSelect(index)}
                    style={{ cursor: mode === "select" ? "pointer" : "default" }}
                >
                    <div className="form-check">
                        {mode === "select" && (
                            <input
                                className="form-check-input"
                                type="radio"
                                name="addressRadio"
                                checked={selectedIndex === index}
                                onChange={() => handleSelect(index)}
                            />
                        )}
                        <label className="form-check-label ms-2 w-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{item.address_line}</strong>
                                    <div>{item.city}, {item.state}</div>
                                    <div>{item.country} - {item.pincode}</div>
                                    <div>{item.mobile}</div>
                                </div>
                                {mode === "manage" && (
                                    <div className="d-flex gap-2">
                                        <MdEdit
                                            size={20}
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(item);
                                            }}
                                        />
                                        <MdDelete
                                            size={20}
                                            style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item._id);
                                            }}
                                        />
                                    </div>
                                )}

                            </div>
                        </label>
                    </div>
                </div>
            ))}

            <div
                className="card p-3 text-center border border-secondary"
                style={{ cursor: "pointer" }}
                onClick={() => setOpenAddAddress(true)}
            >
                + Add Address
            </div>

            {/* Modals */}
            <AddAddressModal
                show={openAddAddress}
                onClose={() => setOpenAddAddress(false)}
                onAdd={(newAddress) => {
                    dispatch(handleAddAddress(newAddress));
                    setOpenAddAddress(false);
                }}
            />

            <EditAddressModal
                show={!!editAddressData}
                onClose={() => setEditAddressData(null)}
                addressData={editAddressData}
                onEdit={(updatedAddress) => {
                    const updatedList = addressList.map((addr) =>
                        addr._id === updatedAddress._id ? updatedAddress : addr
                    );
                    dispatch(setAllAddresses(updatedList));
                    setEditAddressData(null);
                }}
            />

        </div>
    );
}

export default AddressList;
