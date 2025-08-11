import React, { useEffect, useState } from 'react';
import CardProduct from '../components/Cardproduct';
import { useLocation } from 'react-router-dom';
import { Axios } from '../Utils/Axios';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useLocation();
  const searchText = new URLSearchParams(params.search).get('q') || '';

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        method: "POST",
        url: "/api/product/search",
        data: {
          search: searchText,
          page: 1,
          limit: 20
        }
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      } else {
        setData([]);
      }

    } catch (error) {
     console.log(error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchData();
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchText]);

  return (
    <section className='bg-white'>
      <div className='container py-4'>
        <h5 className='fw-semibold mb-3'>
          Search Results: {data.length}
        </h5>

        <div className="row g-3">
          {
            data.map((p, index) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p?._id + "searchProduct" + index}>
                <CardProduct data={p} />
              </div>
            ))
          }

          {loading && <p className='text-center'>Loading....</p>}
        </div>

        {
          !loading && !data.length && (
            <div className='text-center mt-5'>
          
              <p className='fw-semibold mt-3'>No Data found</p>
            </div>
          )
        }
      </div>
    </section>
  );
};

export default SearchPage;
