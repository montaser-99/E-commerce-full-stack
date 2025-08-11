import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Axios } from '../Utils/Axios'
import Uploadimage from '../Utils/Uploadimage'
import toast from 'react-hot-toast';
import { SummaryApi } from '../common/SummaryApi';

function EditCategorymodel({ show, close, refreshCategories, categoryData }) {
  const [data, setData] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    if (categoryData) {
      setData({
        name: categoryData.name || '',
        image: categoryData.image || '',
      });
    }
  }, [categoryData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(oldData => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await Uploadimage(file);
      if(res?.data?.data?.url) {
        setData(prev => ({ ...prev, image: res.data.data.url }));
      }
    }
  };

  const handleSubmit = async () => {
  try {
    const payload = { ...data };
    if (categoryData && categoryData._id) {
      payload._id = categoryData._id;
    }

    const response = await Axios({
     ...SummaryApi.addcategory,
      data: payload,
    });

    if (response?.data?.success) {
      toast.success("Category updated successfully");
      refreshCategories();
      close();
    } else {
      toast.error(response?.data?.message || "Error");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};


  const isValid = data.name.trim() !== '' && data.image.trim() !== '';

  return (
    <Modal show={show} onHide={close} centered backdrop="static" size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Edit category</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            name="name"
            placeholder="Enter category name"
            value={data.name}
            onChange={handleOnChange}
            autoComplete="off"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
            <div className="border bg-light d-flex justify-content-center align-items-center"
              style={{ width: "150px", height: "150px", borderRadius: "8px" }}>
              {data.image ? (
                <img src={data.image} alt="category" className="img-fluid" style={{ maxHeight: "100%", maxWidth: "100%" }} />
              ) : (
                <span className="text-muted small">No image</span>
              )}
            </div>

            <label htmlFor="uploadCategoryImage" className="btn btn-outline-primary">
              Upload image
              <input
                type="file"
                id="uploadCategoryImage"
                className="d-none"
                onChange={handleUploadImage}
              />
            </label>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>close</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>Edit category</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCategorymodel;
