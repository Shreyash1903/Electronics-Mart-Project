import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch product:', error);
      });
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <img
        src={`http://localhost:8000${product.image}`}
        alt={product.name}
        className="product-detail-image"
      />
      <p><strong>Price :</strong> ₹ {Number(product.price).toFixed(2)}</p>
      <p><strong>Description :</strong> {product.description}</p>
    </div>
  );
};

export default ProductDetail;
