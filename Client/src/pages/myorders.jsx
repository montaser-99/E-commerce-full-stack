import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/order/my-orders", {
        withCredentials: true,
      });
      setOrders(response.data?.data || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );

  if (!orders || orders.length === 0)
  return (
    <div className="text-center mt-5">
      <h4 className="text-muted">You have no orders yet 🛒</h4>
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <span className="badge bg-success">Paid</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "failed":
        return <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold text-primary border-bottom pb-2">
        🛍 My Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="card mb-4 shadow-sm border-0"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Order #{order.orderId}</h5>
              {getStatusBadge(order.payment_status)}
            </div>

            <div className="mb-2">
              <strong>Total:</strong>{" "}
              <span className="text-success fw-bold">
                {order.totalAmt} EGP
              </span>
            </div>
            <div className="mb-3 text-muted">
              <small>
                Ordered on: {new Date(order.createdAt).toLocaleString()}
              </small>
            </div>

            <div className="row g-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="col-md-6 col-sm-12">
                  <div
                    className="border rounded p-2 h-100 shadow-sm bg-light d-flex align-items-center"
                    style={{
                      borderRadius: "10px",
                      transition: "transform 0.2s",
                    }}
                  >
                    <img
                      src={item.product_details.image[0]}
                      alt={item.product_details.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <p className="fw-semibold mb-1">
                        {item.product_details.name}
                      </p>
                      <p className="text-muted small mb-0">
                        Qty: <strong>{item.quantity}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
