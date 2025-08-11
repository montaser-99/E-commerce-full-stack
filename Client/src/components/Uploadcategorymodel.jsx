import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { SummaryApi } from '../common/SummaryApi'
import Uploadimage from '../Utils/Uploadimage'
import { Axios } from '../Utils/Axios'
import toast from 'react-hot-toast';

function Uploadcategorymodel({ show, close, refreshCategories }) {
  const [data, setData] = useState({
    name: '',
    image: '',
  });
  // console.log("category data:", data);


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
      if (res?.data?.data?.url) {
        setData(prev => ({
          ...prev,
          image: res.data.data.url,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.addcategory.url,
        method: SummaryApi.addcategory.method,
        data: data,
      });

      if (response?.data?.success) {
        toast.success("Category Added successfully");
        refreshCategories();
        close();
      } else {
        toast.error(response?.data?.message || "error has occured");
      }
    } catch (error) {
      console.error(error);
      toast.error("error has occured during add");
    }
  };

  const isValid = data.name.trim() !== '' && data.image.trim() !== '';

  return (
    <Modal show={show} onHide={close} centered backdrop="static" size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Add new category</Modal.Title>
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
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>Add category</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Uploadcategorymodel;
