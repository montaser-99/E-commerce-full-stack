import React, { useEffect, useState } from 'react'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import Cardproduct from "./Cardproduct"
import CustomSlider from './Slider';
import { Link, useNavigate } from 'react-router-dom';
function CategoryProductDisplay({ id, name, useSlider = true}) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();


  const fetchproductsmatch = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.Getproductbycategory.url,
        method: SummaryApi.Getproductbycategory.method,
        data: { id: id }
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string" && id.trim() !== "") {
      fetchproductsmatch();
    }
  }, [id]);

  return (
    <div className="mt-4">
      <h2 className="mb-3">{name}</h2>

      {useSlider ? (
        <CustomSlider
          data={data}
          slidesToShow={5}
          autoplay={false}
        />
      ) : (
        <div className="row g-3">
          {data.map((product) => (
            <Link
              to={`/product-details/${product._id}`}
              className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-decoration-none text-dark"
              key={product._id}
            >
              <Cardproduct data={product} />
            </Link>
          ))}
        </div>

      )}
    </div>
  );
}

export default CategoryProductDisplay;
