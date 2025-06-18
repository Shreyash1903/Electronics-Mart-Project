import React, { useEffect, useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('User not authenticated. Please login.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/orders/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/invoice/${orderId}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_order_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Invoice download error :', error);
      alert('Could not download invoice. Please try again.');
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">🛒 My Orders</h2>

      {loading && <p className="orders-message">Loading orders...</p>}
      {error && <p className="orders-error">Error: {error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="orders-message">No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Products</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Order ID">{order.id}</td>
                  <td data-label="Products" className="product-list-cell">
                    {order.items && order.items.length > 0 ? (
                      <ul className="product-list">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="product-name">{item.product.name}</span> ×{' '}
                            <span className="product-qty">{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No items</span>
                    )}
                  </td>
                  <td data-label="Total">₹{order.total_price}</td>
                  <td
                    data-label="Status"
                    className={order.is_paid ? 'status-paid' : 'status-pending'}
                  >
                    {order.is_paid ? 'Paid' : 'Pending'}
                  </td>
                  <td data-label="Date">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td data-label="Invoice">
                    <button className="invoice-btn" onClick={() => downloadInvoice(order.id)}>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
