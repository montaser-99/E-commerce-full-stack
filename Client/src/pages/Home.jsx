
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CustomSlider from '../components/Slider';
import CategoryProductDisplay from '../components/CategoryProductDisplay';
import { valideURLConvert } from "../Utils/validURLconverter";
import toast from 'react-hot-toast';
function Home() {
  const navigate = useNavigate();

  const categoryData = useSelector(state => state.product.Allcategories);
  const subcategoryData = useSelector(state => state.product.Allsubcategories);

  const Redirectproductlistpage = (id, cat) => {
    const subcategory = subcategoryData.find(sub =>
      Array.isArray(sub.category) && sub.category.some(c => c == id)
    );

    // console.log("Found subcategory:", subcategory);

    if (!subcategory) {
      toast.error("No subcategory found for this category");
      return;
    }

    const url = `/product/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };



  const CategoryCard = ({ data }) => (
    <div
      className="text-center px-2"
      onClick={() => Redirectproductlistpage(data._id, data.name)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className="mx-auto bg-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
        style={{ width: '120px', height: '120px', overflow: 'hidden' }}
      >
        <img
          src={data.image}
          alt={data.name}
          className="img-fluid"
          style={{ height: '100%', width: '100%', objectFit: 'contain' }}
        />
      </div>
      <p className="mt-2 fw-medium text-truncate" title={data.name}>
        {data.name}
      </p>
    </div>
  );

  return (
    <>
      <Hero />
      <section className="container-fluid mt-5">
        <h2 className="text-center fw-medium my-3">
          Our <span className="text-success">Categories</span>
        </h2>
        <div className="bg-success mx-auto mb-3" style={{ height: 5, width: 220 }}></div>

        <CustomSlider
          data={categoryData}
          CardComponent={CategoryCard}
          slidesToShow={6}
          autoplay={true}
        />

      </section>


      <div className='container mt-5'>
        <div className='row'>
          {
            Array.isArray(categoryData) && categoryData.length > 0 ? (
              categoryData.map((cat, index) => (
                <CategoryProductDisplay
                  id={cat._id}
                  name={cat.name}
                  key={index}
                />
              ))
            ) : (
              <p> Loading Categories ....</p>
            )
          }
        </div>
      </div>

    </>
  );
}

export default Home;
