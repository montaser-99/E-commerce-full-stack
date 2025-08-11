import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import Uploadimage from '../Utils/Uploadimage'
import toast from 'react-hot-toast'
import { SummaryApi } from '../common/SummaryApi'
import { useSelector } from 'react-redux'
import { Axios } from '../Utils/Axios';
import { IoIosCloudUpload } from "react-icons/io"



function EditProductAdmin({ show, close, data: propsData, fetchproductdata }) {
    const [data, setData] = useState({
        ...propsData,
        // more_details: propsData.more_details || {}
    })
    const [selectedsubcategories, setSelectedsubcategories] = useState([])
    const [selectedOption, setSelectedOption] = useState("")
    const allCategory = useSelector(state => state.product.Allcategories)
    const allSubCategory = useSelector(state => state.product.Allsubcategories)
    const [selectedcategories, setSelectedcategories] = useState([])
    const [selectedSubOption, setSelectedSubOption] = useState("")
    // console.log(allCategory)


    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const isValid = data.name && data.price > 0 && data.image.length > 0

    // //////////
    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        const response = await Uploadimage(file)
        const { data: imageresponse } = response
        const imageUrl = imageresponse.data.url
        setData((prev) => {
            return {
                ...prev,
                image: [...prev.image, imageUrl]
            }

        })

    }
    const handleDeleteImage = (index) => {
        setData((prev) => ({
            ...prev,
            image: prev.image.filter((_, i) => i !== index),
        }));
    };
    const handlecategoryselect = (e) => {
        const selectedid = e.target.value
        const selectedCat = allCategory.find(cat => cat._id === selectedid)
        const check = selectedcategories.find(cat => cat._id === selectedid)

        if (selectedCat && !check) {
            setSelectedcategories([...selectedcategories, selectedCat])
        }

        setSelectedOption("")
    }


    const handlesubcategoryselect = (e) => {
        const selectedid = e.target.value
        const selectedCat = allSubCategory.find(cat => cat._id === selectedid)
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





    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("data", data)

        try {
            const updatedData = {
                ...data,
                categories: selectedcategories.map(cat => cat._id),
                subcategories: selectedsubcategories.map(cat => cat._id)
            }
            const response = await Axios({
                ...SummaryApi.Updateproduct,
                data: updatedData
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (close) {
                    close()
                }
                fetchproductdata()

                setData({
                    ...propsData,
                    more_details: propsData.more_details || {}
                })


            }
        } catch (error) {
            console.log(error)
        }



    }

    return (

        <>
            <Modal show={show} onHide={close} centered backdrop="static" size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>update product</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={handleSubmit} >
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                            <input type="text"
                                name="name"
                                onChange={handleChange}
                                value={data.name}
                                className="form-control"
                                id="exampleInputEmail1" />
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
                            <div className="mb-3">
                                {[...data.category, ...selectedcategories].map((cat) => (
                                    <span
                                        key={cat._id}
                                        className="badge bg-primary me-2"
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
                                    {allCategory.map((cat, index) => (
                                        <option key={index} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">SubCategory</label>
                            <div className="mb-3">
                                {[...data.sub_category, ...selectedsubcategories].map((cat) => (
                                    <span
                                        key={cat._id}
                                        className="badge bg-secondary me-2"
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
                                    {allSubCategory.map((cat, index) => (
                                        <option key={index} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='d-flex justify-content-between mb-3'>
                            <div>
                                <label>unit</label>
                                <input
                                    name="unit"
                                    value={data.unit}
                                    onChange={handleChange}

                                    type='number' />

                            </div>
                            <div>
                                <label>stock</label>
                                <input
                                    name="stock"
                                    value={data.stock}
                                    onChange={handleChange}

                                    type='number' />

                            </div>
                            <div>
                                <label>price</label>
                                <input
                                    name="price"
                                    type='number'
                                    value={data.price}
                                    onChange={handleChange} />

                            </div>
                            <div>
                                <label>discount</label>
                                <input
                                    name="discount"
                                    type='number'
                                    value={data.discount}
                                    onChange={handleChange}


                                />

                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label
                                htmlFor="productImage"
                                className="form-label d-block"
                            >
                                Image
                            </label>
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
                            <div className="row mt-3 g-2">
                                {data.image?.length ? (
                                    data.image.map((img, index) => (
                                        <div className="col-auto" key={index}>
                                            <img
                                                src={img}
                                                className="img-fluid border rounded-md"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                alt={`image-${index}`}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No image available</p>
                                )}
                            </div>


                        </div>
                    </form>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>close</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>Update Product</Button>
                </Modal.Footer>
            </Modal>



        </>
    )
}

export default EditProductAdmin
