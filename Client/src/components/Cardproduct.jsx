import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from './Addtocartbutton';
import { displaydiscount } from '../Utils/Displaypricediscount';

function Cardproduct({ data }) {
  return (
    <div
      className="card position-relative h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card mx-3"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: '2px solid green',
      }}
    >
      {/* بادج الخصم */}
      {data.discount > 0 && (
        <span
          className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2 shadow"
          style={{ fontSize: '0.85rem', borderRadius: '8px' }}
        >
          -{data.discount}%
        </span>
      )}

      {/* لينك المنتج */}
      <Link
        to={`/product-details/${data._id}`}
        className="text-decoration-none text-dark"
      >
        {/* صورة المنتج */}
        <div
          className="p-3 bg-light d-flex justify-content-center align-items-center"
          style={{ height: '180px' }}
        >
          <img
            src={data.image[0]}
            className="img-fluid"
            alt={data.name}
            style={{
              maxHeight: '150px',
              objectFit: 'contain',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="card-body text-center">
          <h6
            className="fw-semibold text-truncate mb-2"
            title={data.name}
            style={{ fontSize: '1rem' }}
          >
            {data.name}
          </h6>
          <div className="mb-2">
            <span className="fw-bold text-success me-2">
              ${displaydiscount(data.price, data.discount)}
            </span>
            {data.discount > 0 && (
              <span className="text-muted text-decoration-line-through">
                ${data.price}
              </span>
            )}
          </div>
          <div className="mb-3">
            {data.stock > 0 ? (
              <span className="badge bg-success">In Stock</span>
            ) : (
              <span className="badge bg-danger">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>

      {/* زر الإضافة للسلة */}
      <div className="px-3 pb-3">
        <AddToCartButton product={data} />
      </div>

      {/* تأثير هوفر */}
      <style>
        {`
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            border-color: transparent;
          }
          .product-card:hover img {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
}

export default Cardproduct;
