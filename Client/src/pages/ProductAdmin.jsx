import React, { useEffect, useState } from 'react'
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import ProductCardAdmin from '../components/productCardAdmin';

function ProductAdmin() {
    const [productData, setProductData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [search, setSearch] = useState("")

    const fetchproductdata = async () => {
        try {
            const response = await Axios({
                url: SummaryApi.Getproducts.url,
                method: SummaryApi.Getproducts.method,
                data: {
                    page,
                    limit: 12,
                    search
                }
            })
            const { data: responseData } = response
            // console.log(responseData)
            if (responseData.success) {
                setTotalPageCount(responseData.totalNopages)
                setProductData(responseData.data)
            }
        } catch (error) {
            // console.log(error)
        }
    }


    useEffect(() => {
        fetchproductdata()
    }, [page])



    const handleprevious = () => {
        if (page > 1) {
            setPage(prev => prev - 1)
        }
    }
    const handlenext = () => {
        if (page < totalPageCount) {
            setPage(prev => prev + 1)
        }
    }

    return (

        <>
            {
                productData.length > 0 ? (
                    <>
                        <div className='row g-4 mt-4 justify-content-start overflow-hidden'>

                            {

                                productData.map((ele, i) => {
                                    return (
                                        <ProductCardAdmin key={ele._id} data={ele} fetchproductdata={fetchproductdata} />
                                    )
                                })
                            }
                        </div>

                        <div className="d-flex justify-content-between my-5">
                            <button onClick={handleprevious} className="btn btn-outline-primary">
                                Previous
                            </button>

                            <button className="btn btn-light w-100 mx-3" disabled>
                                {page}/{totalPageCount}
                            </button>

                            <button onClick={handlenext} className="btn btn-outline-primary">
                                Next
                            </button>
                        </div>
                    </>

                ) : <p>there is no products</p>
            }



        </>
    )
}

export default ProductAdmin
