import React, { useState, useEffect } from 'react'
import { SummaryApi } from '../common/SummaryApi'
import { Axios } from '../Utils/Axios';
import Uploadimage from '../Utils/Uploadimage';
import { IoIosCloudUpload } from "react-icons/io";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

function UploadProduct() {

    const [selectedcategories, setSelectedcategories] = useState([])
    const [selectedsubcategories, setSelectedsubcategories] = useState([])
    const [selectedOption, setSelectedOption] = useState("")
    const [selectedSubOption, setSelectedSubOption] = useState("")
    const [detailKey, setDetailKey] = useState("");
    const [detailFields, setDetailFields] = useState([]);
    const [detailValue, setDetailValue] = useState("");
    const allcategories = useSelector(state => state.product.Allcategories);
    const allsubcategories = useSelector(state => state.product.Allsubcategories);





    const [data, setData] = useState({
        name: "",
        image: [],
        category: [],
        sub_category: [],
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
        more_details: {},
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleAddDetail = () => {
        if (detailKey.trim() && detailValue.trim()) {
            const newField = { key: detailKey.trim(), value: detailValue.trim() };
            setDetailFields([...detailFields, newField]);
            setDetailKey("");
            setDetailValue("");
        } else {
            toast.error("you must fill key and value");
        }
    };
    const handleDeleteDetail = (index) => {
        setDetailFields(detailFields.filter((_, i) => i !== index));
    };


    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await Uploadimage(file);
            const imageurl = response?.data?.data?.secure_url;
            if (imageurl) {
                setData((prev) => ({
                    ...prev,
                    image: [...prev.image, imageurl],
                }));
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("unable to upload image");
        }
    };

    const handleDeleteImage = (index) => {
        setData((prev) => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("submit");

        if (!data.name.trim()) {
            toast.error("product name is required");
            return;
        }

        if (!data.price || Number(data.price) <= 0) {
            toast.error("price must be more than zero");
            return;
        }

        try {
            const productData = {
                ...data,
                category: selectedcategories.map(cat => cat._id),
                sub_category: selectedsubcategories.map(cat => cat._id),
                unit: data.unit,
                stock: Number(data.stock),
                price: Number(data.price),
                discount: Number(data.discount),
                more_details: detailFields.reduce((acc, field) => {
                    acc[field.key] = field.value;
                    return acc;
                }, {}),
                image: data.image,

            };
            // console.log("Data to send:", productData);
            const response = await Axios({
                url: SummaryApi.Addproduct.url,
                method: SummaryApi.Addproduct.method,
                data: productData,
                withCredentials: true


            });
            // console.log(response)



            toast.success("product added successfully");
            setData({
                name: "",
                image: [],
                category: [],
                sub_category: [],
                unit: "",
                stock: "",
                price: "",
                discount: "",
                description: "",
                more_details: {},
            });
        }
        catch (error) {
            // toast.error(حerror.message});
            console.log(error)
        }
    };

    const handlecategoryselect = (e) => {
        const selectedid = e.target.value
        const selectedCat = allcategories.find(cat => cat._id === selectedid)
        const check = selectedcategories.find(cat => cat._id === selectedid)

        if (selectedCat && !check) {
            setSelectedcategories([...selectedcategories, selectedCat])
        }


        setSelectedOption("")
    }

    const handlesubcategoryselect = (e) => {
        const selectedid = e.target.value
        const selectedCat = allsubcategories.find(cat => cat._id === selectedid)
        const check = selectedsubcategories.find(cat => cat._id === selectedid)

        if (selectedCat && !check) {
            setSelectedsubcategories([...selectedsubcategories, selectedCat])
        }


        setSelectedSubOption("")
    }

    const handleDeleteCategory = (id) => {
        setSelectedcategories(selectedcategories.filter(cat => cat._id !== id))
    }

    const handleDeletesubCategory = (id) => {
        setSelectedsubcategories(selectedsubcategories.filter(cat => cat._id !== id))
    }



    return (
        <>
            <section>
                <div className="container">
                    <div className="bg-light-green d-flex justify-content-between shadow-md p-3">
                        <h2>product</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                onChange={handleChange}
                                value={data.name}
                                className="form-control"
                                id="exampleInputEmail1"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="form-control"
                                value={data.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <div className="mb-3 d-flex flex-wrap gap-2">
                                {selectedcategories.map((cat) => (
                                    <span
                                        key={cat._id}
                                        className="badge bg-primary"
                                        style={{ padding: "8px", borderRadius: "20px", fontSize: "14px", cursor: "pointer" }}
                                        onClick={() => handleDeleteCategory(cat._id)}
                                    >
                                        {cat.name} &times;
                                    </span>
                                ))}
                            </div>
                            <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                                <select
                                    className="form-select"
                                    id="inputGroupSelect01"
                                    onChange={handlecategoryselect}
                                    value={selectedOption}
                                >
                                    <option value="">Choose...</option>
                                    {allcategories.map((cat, index) => (
                                        <option key={index} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">SubCategory</label>
                            <div className="mb-3 d-flex flex-wrap gap-2">
                                {selectedsubcategories.map((cat) => (
                                    <span
                                        key={cat._id}
                                        className="badge bg-secondary"
                                        style={{ padding: "8px", borderRadius: "20px", fontSize: "14px", cursor: "pointer" }}
                                        onClick={() => handleDeletesubCategory(cat._id)}
                                    >
                                        {cat.name} &times;
                                    </span>
                                ))}
                            </div>
                            <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
                                <select
                                    className="form-select"
                                    id="inputGroupSelect02"
                                    onChange={handlesubcategoryselect}
                                    value={selectedSubOption}
                                >
                                    <option value="">Choose...</option>
                                    {allsubcategories.map((cat, index) => (
                                        <option key={index} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* صف الحقول الصغيرة بشكل مرتب */}
                        <div className="row mb-3 g-3">
                            <div className="col-6 col-md-3">
                                <label className="form-label">Unit</label>
                                <input
                                    name="unit"
                                    value={data.unit}
                                    onChange={handleChange}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label">Stock</label>
                                <input
                                    name="stock"
                                    value={data.stock}
                                    onChange={handleChange}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label">Price</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={data.price}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-6 col-md-3">
                                <label className="form-label">Discount</label>
                                <input
                                    name="discount"
                                    type="number"
                                    value={data.discount}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label htmlFor="productImage" className="form-label d-block">Image</label>
                            <label
                                htmlFor="productImage"
                                className="border rounded d-flex flex-column align-items-center justify-content-center py-4 bg-light text-center"
                                style={{ cursor: "pointer" }}
                            >
                                <IoIosCloudUpload size={40} className="mb-2 text-primary" />
                                <p className="mb-0">Click to upload image</p>
                            </label>
                            <input
                                type="file"
                                id="productImage"
                                className="d-none"
                                accept="image/*"
                                onChange={handleUploadImage}
                            />
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                {data.image.map((img, index) => (
                                    <div
                                        key={index}
                                        className="position-relative"
                                        style={{ width: "120px", height: "120px" }}
                                    >
                                        <img
                                            src={img}
                                            className="w-100 h-100 rounded"
                                            style={{ objectFit: "cover" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-close position-absolute top-0 end-0 m-1"
                                            onClick={() => handleDeleteImage(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">More details</label>
                            <div className="d-flex flex-column flex-md-row gap-2 mb-2">
                                <input
                                    type="text"
                                    value={detailKey}
                                    onChange={(e) => setDetailKey(e.target.value)}
                                    className="form-control"
                                    placeholder="Key"
                                />
                                <input
                                    type="text"
                                    value={detailValue}
                                    onChange={(e) => setDetailValue(e.target.value)}
                                    className="form-control"
                                    placeholder="Value"
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddDetail}
                                >
                                    Add
                                </button>
                            </div>

                            <div>
                                {detailFields.map((field, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-1"
                                    >
                                        <span>{field.key}: {field.value}</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteDetail(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                </div>
            </section>
        </>

    )
}

export default UploadProduct;
