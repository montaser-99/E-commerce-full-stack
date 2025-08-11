import React, { useState } from 'react';
import { Axios } from '../Utils/Axios';
import { SummaryApi } from '../common/SummaryApi';
import toast from 'react-hot-toast';
import EditProductAdmin from '../components/EditProductAdmin';

function ProductCardAdmin({ data, fetchproductdata }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDelete = async () => {
        const isConfirm = window.confirm(`Are you sure you want to delete: ${data.name}?`);
        if (!isConfirm) return;

        try {
            const response = await Axios({
                url: SummaryApi.Deleteproduct.url,
                method: SummaryApi.Deleteproduct.method,
                data: { _id: data._id }
            });

            const { data: responseData } = response;
            // console.log(responseData);

            if (responseData.success) {
                toast.success(responseData.message);
                if (fetchproductdata) fetchproductdata();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = () => {
        setSelectedProduct(data);
        setShowEditModal(true);
    };

    return (
        <>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                <div className="card h-100 shadow-sm border-0 rounded-3" key={data._id}>
                    <div className="p-3">
                        <img
                            src={data.image[0]}
                            className="card-img-top"
                            alt={data.name}
                            style={{ height: "140px", objectFit: "contain" }}
                        />
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between text-center pt-0">
                        <h6 className="card-title fw-semibold text-truncate" title={data.name}>
                            {data.name}
                        </h6>

                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <button
                                className="btn btn-sm btn-outline-success px-3"
                                onClick={handleEdit}
                            >
                                <i className="bi bi-pencil-square me-1"></i>Edit
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger px-3"
                                onClick={handleDelete}
                            >
                                <i className="bi bi-trash3 me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && selectedProduct && (
                <EditProductAdmin
                    data={selectedProduct}
                    close={() => setShowEditModal(false)}
                    show={showEditModal}
                    fetchproductdata={fetchproductdata}
                />
            )}
        </>
    );
}

export default ProductCardAdmin;
