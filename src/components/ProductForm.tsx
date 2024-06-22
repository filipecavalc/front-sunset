import React, { useEffect, useState } from 'react';
import { addProduct, updateProduct } from '../utils/api';
import { getToken } from '../utils/auth';
import { Button, TextField } from '@mui/material';
import { ProductFormProps } from '@/types';

const ProductForm = ({ product, onClose, onSave }: ProductFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setOldImages(product.images);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setOldImages([]);
      setNewImages([]);
      setImagePreviews([]);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveOldImage = (image: string) => {
    setOldImages(oldImages.filter(img => img !== image));
  };

  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return;

    const productData = new FormData();
    productData.append('name', name);
    productData.append('description', description);
    productData.append('price', price);
    productData.append('stock', stock);
    oldImages.forEach(image => productData.append('oldImages', image));
    newImages.forEach(image => productData.append('images', image));

    try {
      if (product) {
        await updateProduct(token, product.id, productData);
      } else {
        await addProduct(token, productData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving product', err);
    }

    onSave();
    onClose();
  };

  const shouldRenderCurrentImages = () => {
    if (oldImages.length > 0) {
      return (
        <div className='current-image-section'>
          <h3>Current Images</h3>
          <div className='current-image-list'>
            {oldImages.map((image, index) => (
              <div key={index} className='current-image-content'>
                <img loading='lazy' src={image} alt="Old Preview" width="100" />
                <Button variant="contained" type="button" onClick={() => handleRemoveOldImage(image)}>Remove</Button>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <div className='product-form'>
      <h1>{product ? 'Edit Product' : 'Add Product'}</h1>
      <TextField variant="outlined" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField variant="outlined" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <TextField variant="outlined" type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <TextField variant="outlined" type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
      />
      {shouldRenderCurrentImages()}
      <div>
        <h3>New Images</h3>
        {imagePreviews.map((preview, index) => (
          <img loading='lazy' key={index} src={preview} alt="Preview" width="100" />
        ))}
      </div>
      <div className='product-form-confirm-section'>
        <Button variant="contained" onClick={handleSubmit}>{product ? 'Save' : 'Add'}</Button>
        <Button variant="contained" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default ProductForm;
