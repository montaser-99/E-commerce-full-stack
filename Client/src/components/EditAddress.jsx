import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';

function EditAddressModal({ show, onClose, onEdit, addressData }) {
  const [data, setData] = useState({ ...addressData });

  useEffect(() => {
    if (addressData) setData(addressData);
  }, [addressData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await Axios({
        url: `/api/address/${data._id}`,
        method: 'PUT',
        data: data,
      });

      if (response?.data?.success) {
        toast.success('Address updated successfully');
       onEdit(response.data.data)
        onClose();
      } else {
        toast.error(response?.data?.message || 'Error');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const isValid =
    data.address_line?.trim() &&
    data.city?.trim() &&
    data.state?.trim() &&
    data.country?.trim() &&
    data.pincode?.trim() &&
    String(data.mobile)?.trim().length >= 8;

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Address</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Address Line</label>
            <input
              type="text"
              className="form-control"
              name="address_line"
              value={data.address_line}
              onChange={handleOnChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">City</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={data.city}
              onChange={handleOnChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">State</label>
            <input
              type="text"
              className="form-control"
              name="state"
              value={data.state}
              onChange={handleOnChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={data.country}
              onChange={handleOnChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Pincode</label>
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={data.pincode}
              onChange={handleOnChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Mobile</label>
            <input
              type="tel"
              className="form-control"
              name="mobile"
              value={data.mobile}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditAddressModal;
