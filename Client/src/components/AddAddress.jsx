import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';

function AddAddressModal({ show, onClose, onAdd }) {
  const [data, setData] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    mobile: '',
  });

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
        url: '/api/address',
        method: 'POST',
        data: data,
      });

      if (response?.data?.success) {
        toast.success('Address added successfully');
        onAdd(response.data.data);
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
    data.address_line.trim() &&
    data.city.trim() &&
    data.state.trim() &&
    data.country.trim() &&
    data.pincode.trim() &&
    String(data.mobile).trim().length >= 8;

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="md">
      <Modal.Header closeButton>
        <Modal.Title>Add New Address</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Address Line</label>
            <input
              type="text"
              className="form-control"
              name="address_line"
              placeholder="Street, Building, etc."
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
              placeholder="City"
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
              placeholder="State"
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
              placeholder="Country"
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
              placeholder="Postal Code"
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
              placeholder="Phone number"
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
          Add Address
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddAddressModal;
