import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Axios } from '../Utils/Axios';
import Uploadimage from '../Utils/Uploadimage';
import toast from 'react-hot-toast';

function EditSubcategoryModel({ show, onClose, onUpdate, subcategory, categories }) {
  const [data, setData] = useState({
    name: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    if (subcategory) {
      setData({
        name: subcategory.name || '',
        image: subcategory.image || '',
        category: subcategory.category || '',
      });
    }
  }, [subcategory]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(old => ({
      ...old,
      [name]: value
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await Uploadimage(file);
      if (res?.data?.data?.url) {
        setData(prev => ({ ...prev, image: res.data.data.url }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...data };
      if (subcategory && subcategory._id) {
        payload._id = subcategory._id;
      }

      const response = await Axios({
        url: '/api/sub-category/update-subcategory',
        method: 'PUT',
        data: payload,
      });

      if (response?.data?.success) {
        toast.success('Subcategory updated successfully');
        onUpdate();
        onClose();
      } else {
        toast.error(response?.data?.message || 'Error');
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const isValid = data.name.trim() !== '' && data.image.trim() !== '' && String(data.category).trim() !== '';

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Subcategory</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-4">
          <div className="col-12">
            <label className="form-label fw-semibold">Subcategory Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter subcategory name"
              value={data.name}
              onChange={handleOnChange}
              autoComplete="off"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Parent Category</label>
            <select
              className="form-select"
              name="category"
              value={data.category}
              onChange={handleOnChange}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Image</label>
            <div className="d-flex flex-column flex-md-row align-items-center gap-4">
              <div
                className="border bg-light d-flex justify-content-center align-items-center"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
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

              <label htmlFor="uploadSubcategoryImage" className="btn btn-outline-primary m-0">
                Upload Image
                <input
                  type="file"
                  id="uploadSubcategoryImage"
                  className="d-none"
                  onChange={handleUploadImage}
                />
              </label>
            </div>
          </div>
        </div>
      </Modal.Body>


      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
          Edit Subcategory
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditSubcategoryModel;
