"use client"

import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../utils/api';
import { getToken } from '../utils/auth';
import ProductForm from './ProductForm';
import Modal from 'react-modal';
import { Product } from '@/types';
import { Button, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

Modal.setAppElement('body'); 

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts(undefined, undefined, undefined, currentPage);
      setProducts(result.data);
      setTotalPages(result.totalPages);
    };

    fetchProducts();
  }, [currentPage, products]);

  const handleDelete = async (id: number) => {
    const token = getToken();
    if (!token) return;

    await deleteProduct(token, id);
    setProducts(products.filter((product: Product) => product.id !== id));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSave = async () => {
    const result = await getProducts(undefined, undefined, undefined, currentPage);
    setProducts(result.data);
    setTotalPages(result.totalPages);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className='top-admin-panel'>
        <h1>Admin Panel</h1>
        <Button variant="contained" onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}>Add New Product</Button>
      </div>
      <div className="product-list">
        {products.map((product: any) => (
          <div key={product.id} className="product-item">
          <Button variant="contained" onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} startIcon={<EditIcon />} />
          <Button variant="contained" onClick={() => handleDelete(product.id)} startIcon={<DeleteIcon />} />
            <p>{product.name}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <Pagination count={totalPages} variant="outlined" shape="rounded" onChange={(e, page) => { handlePageChange(page) }} />
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <ProductForm product={selectedProduct} onClose={() => setIsModalOpen(false)} onSave={handleSave}/>
      </Modal>
    </div>
  );
};

export default AdminPanel;
