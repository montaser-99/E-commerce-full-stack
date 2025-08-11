import React, { useState, useEffect } from 'react'
import EditCategorymodel from '../components/EditCategorymodel'
import Uploadcategorymodel from '../components/Uploadcategorymodel'
import { SummaryApi } from '../common/SummaryApi'
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';


function Category() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [categories, setCategories] = useState([])
  const [editCategoryData, setEditCategoryData] = useState(null)

  const fetchCategories = async () => {
    try {
      const response = await Axios({
        url: SummaryApi.getallcategory.url,
        method: SummaryApi.getallcategory.method,
      })
      setCategories(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = () => {
    setShowAddModal(true)
  }


  const handleEditCategory = (category) => {
    setEditCategoryData(category)
    setShowEditModal(true)
  }


  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category")) {
      try {
        const response = await Axios({
          url: `/api/category/delete-category/${categoryId}`,
          method: 'DELETE',
        });
        if (response.data.success) {
        toast.success("Delete successfully");
          fetchCategories();
        } else {
        toast.error(response.data.message || "error has occured during delete");
        }
      } catch (error) {
        console.error(error);
        toast.error("error has occured during delete");
      }
    }
  };

  return (
    <>
      <section>
        <div className='container'>
            <div className='bg-light-green d-flex justify-content-between shadow-lg  p-3 '>
          <h2>Category</h2>
          <button className='btn btn-success' onClick={handleAddCategory}>Add category</button>
        </div>

   
        {showAddModal && (
          <Uploadcategorymodel
            show={showAddModal}
            close={() => setShowAddModal(false)}
            refreshCategories={fetchCategories}
          />
        )}


        {showEditModal && (
          <EditCategorymodel
            show={showEditModal}
            close={() => {
              setShowEditModal(false);
              setEditCategoryData(null);
            }}
            refreshCategories={fetchCategories}
            categoryData={editCategoryData}
          />
        )}

        <div className='row g-4 mt-4 justify-content-start overflow-hidden'>
          {categories.map((ele) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" key={ele._id}>
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="p-3">
                  <img
                    src={ele.image}
                    className="card-img-top"
                    alt={ele.name}
                    style={{ height: "140px", objectFit: "contain" }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between text-center pt-0">
                  <h6 className="card-title fw-semibold text-truncate" title={ele.name}>
                    {ele.name}
                  </h6>

                  <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                      className="btn btn-sm btn-outline-success px-3"
                      onClick={() => handleEditCategory(ele)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger px-3"
                      onClick={() => handleDeleteCategory(ele._id)}
                    >
                      <i className="bi bi-trash3 me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        </div>
      
      </section>
    </>
  )
}

export default Category
