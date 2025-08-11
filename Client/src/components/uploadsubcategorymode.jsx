import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { SummaryApi } from '../common/SummaryApi';
import Uploadimage from '../Utils/Uploadimage';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';

function UploadSubcategorymodel({ show, onClose, onUpload }) {
  const [data, setData] = useState({
    name: '',
    image: '',
    categoryid: '',
  });

  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get('/api/category/');
        if (res?.data?.data) {
          setAllCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error.response?.data || error.message || error);
      }
    };

    fetchCategories();
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await Uploadimage(file);
      if (res?.data?.data?.url) {
        setData((prev) => ({
          ...prev,
          image: res.data.data.url,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const sendData = {
        name: data.name,
        image: data.image,
        category: data.categoryid,
      };

      const response = await Axios({
        url: SummaryApi.Addsubcategory.url,
        method: SummaryApi.Addsubcategory.method,
        data: sendData,
      });

      if (response?.data?.success) {
        toast.success("Subcategory added successfully");
        if (typeof onUpload === 'function') onUpload();
        if (typeof onClose === 'function') onClose();
      } else {
        toast.error(response?.data?.message || "Error occurred");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred during add");
    }
  };

  const isValid =
    data.name.trim() !== '' &&
    data.image.trim() !== '' &&
    data.categoryid.trim() !== '';

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add new Subcategory</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Subcategory Name */}
        <div className="mb-3">
          <label htmlFor="subcategoryName" className="form-label">
            Subcategory Name
          </label>
          <input
            type="text"
            className="form-control"
            id="subcategoryName"
            name="name"
            placeholder="Enter subcategory name"
            value={data.name}
            onChange={handleOnChange}
            autoComplete="off"
          />
        </div>

        {/* Parent Category */}
        <div className="mb-3">
          <label className="form-label">Select Parent Category</label>
          <select
            className="form-select"
            name="categoryid"
            value={data.categoryid}
            onChange={handleOnChange}
          >
            <option value="">-- Select a Category --</option>
            {allCategories.map((cat) => (
              <option value={cat._id} key={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
            <div
              className="border bg-light d-flex justify-content-center align-items-center"
              style={{ width: '150px', height: '150px', borderRadius: '8px' }}
            >
              {data.image ? (
                <img
                  src={data.image}
                  alt="subcategory"
                  className="img-fluid"
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
              ) : (
                <span className="text-muted small">No image</span>
              )}
            </div>

            <label htmlFor="uploadsubCategoryImage" className="btn btn-outline-primary">
              Upload image
              <input
                type="file"
                id="uploadsubCategoryImage"
                className="d-none"
                onChange={handleUploadImage}
              />
            </label>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
          Add Subcategory
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadSubcategorymodel;
