import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Axios } from '../Utils/Axios'
import { SummaryApi } from '../common/SummaryApi'
import { useParams, Link } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import Cardproduct from '../components/Cardproduct'

function ProductListPage() {
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [DisplaySubCatory, setDisplaySubCategory] = useState([])
    const [loading, setLoading] = useState(false)

    const params = useParams()
    //   console.log(params)
    const AllSubCategories = useSelector(state => state.product.Allsubcategories)

    const categoryId = params.category.split("-").slice(-1)[0]
    const subCategoryId = params.subCategory.split("-").slice(-1)[0]
    const subCategory = params?.subCategory?.split("-")
    const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")
    const allCategories = useSelector(state => state.product.Allcategories)
    const category = allCategories.find(cat => cat._id === categoryId)
    const categoryName = category?.name || "category"



    const fetchProductdata = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.Getproductbycategoryandsubcategory,
                data: {
                    categoryId: categoryId.trim(),
                    subCategoryId: subCategoryId.trim(),
                    page,
                    limit: 8,
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                if (responseData.page == 1) {
                    setData(responseData.data)
                } else {
                    setData(prev => [...prev, ...responseData.data])
                }
                setTotalPage(responseData.totalCount)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchProductdata()
    }, [params, page])

    useEffect(() => {
        const sub = AllSubCategories.filter(s =>
            s.category?.some(cat => cat.toString() === categoryId)
        )
        setDisplaySubCategory(sub)
    }, [params, AllSubCategories])


    return (<>

        <div className='container-fluid'>
            <div className="row flex-column flex-md-row min-vh-100 ">
                {/* Sidebar */}
                <div
                    className="col-12 col-md-2 bg-light rounded p-3 order-1"
                    style={{ minHeight: "200px" }}
                >
                    <h5>Subcategories</h5>
                    <ul className="list-group">
                        {DisplaySubCatory.map((sub) => (
                            <Link
                                to={`/product/${categoryName}-${categoryId}/${sub.name}-${sub._id}`}
                                key={sub._id}
                                className={`list-group-item list-group-item-action ${sub._id === subCategoryId ? 'active bg-primary text-white' : ''}`}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </ul>
                </div>

                {/* Content Area */}
                <div className="col-12 col-md-10 bg-white rounded shadow-sm p-3 flex-grow-1 order-2 order-md-2">
                    <div className="col-md-9">
                        <div className="row">
                            {loading ? (
                                <div className="text-center mt-5">
                                    <Spinner animation="border" />
                                </div>
                            ) : data.length === 0 ? (
                                <p>No products found.</p>
                            ) : (
                                data.map((product) => (
                                    <Link className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product._id}
                                        to={`/product-details/${product._id}`}
                                    >
                                        <Cardproduct data={product} />
                                    </Link>
                                ))
                            )}
                        </div>

                        {page * 8 < totalPage && (
                            <div className="text-center mt-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setPage(page + 1)}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>

                </div>


            </div>

        </div>
    </>
    )
}

export default ProductListPage
