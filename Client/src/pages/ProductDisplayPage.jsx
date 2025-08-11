import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import AddToCartButton from '../components/Addtocartbutton';

const ProductDisplayPage = () => {
  const { productId } = useParams();
  const [data, setData] = useState({
    name: '',
    image: [],
    price: 0,
    discount: 0,
    stock: 0,
    description: '',
  });
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.GetProductDetails,
        data: { productId },
      });
      const responseData = response?.data;
      if (responseData?.success) {
        setData(responseData.data);
        setImageIndex(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const scrollHorizontally = (offset) => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += offset;
    }
  };

  const finalPrice = (data.price - (data.price * data.discount) / 100).toFixed(2);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-4">
      <div className="row g-4">

        <div className="col-md-6">
          <div className="bg-white rounded border" style={{ minHeight: '60vh' }}>
            <img
              src={data.image[imageIndex]}
              alt={data.name}
              className="w-100 h-100 object-fit-contain"
              style={{ maxHeight: '60vh' }}
            />
          </div>

          <div className="d-flex justify-content-center gap-2 mt-3">
            {data.image.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={`rounded-circle cursor-pointer border ${idx === imageIndex ? 'bg-secondary' : 'bg-light'
                  }`}
                style={{ width: '12px', height: '12px', cursor: 'pointer' }}
              />
            ))}
          </div>

          <div className="position-relative mt-3">
            <div
              ref={imageContainer}
              className="d-flex gap-2 overflow-auto px-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {data.image.map((src, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 border rounded overflow-hidden"
                  style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                >
                  <img
                    src={src}
                    alt={`thumb-${idx}`}
                    className="w-100 h-100 object-fit-contain"
                    onClick={() => setImageIndex(idx)}
                  />
                </div>
              ))}
            </div>

            <button
              className="btn btn-light shadow position-absolute top-50 start-0 translate-middle-y"
              onClick={() => scrollHorizontally(-100)}
            >
              <FaAngleLeft />
            </button>

            <button
              className="btn btn-light shadow position-absolute top-50 end-0 translate-middle-y"
              onClick={() => scrollHorizontally(100)}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>


        <div className="col-md-6 d-flex flex-column gap-3">
          <h2>{data.name}</h2>

          <div className="d-flex align-items-center gap-3">
            <span className="fs-4 fw-bold text-success">${finalPrice}</span>
            <span className="text-muted text-decoration-line-through">${data.price}</span>
            {data.discount > 0 && (
              <span className="badge bg-danger">{data.discount}% OFF</span>
            )}
          </div>

          <p className="text-muted">{data.description}</p>

          {data.stock > 0 ? (
            <AddToCartButton product={data}/>
          ) : (
            <p className="text-danger fw-semibold mt-3">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayPage;
