import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { Button, MenuItem, Pagination, Select, SelectChangeEvent, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';

const ProductGrid = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [searchParams, setSearchParams] = useState<{ name?: string, minPrice?: number, maxPrice?: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts(searchParams.name, searchParams.minPrice, searchParams.maxPrice, currentPage, 10, order);
      setProducts(result.data);
      setTotalPages(result.totalPages);
    };

    fetchProducts();
  }, [searchParams, currentPage, order]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get('name-field')?.toString();
    console.log('name - ', name);
    
    const minPrice = formData.get('minPrice') ? parseFloat(formData.get('minPrice') as string) : undefined;
    const maxPrice = formData.get('maxPrice') ? parseFloat(formData.get('maxPrice') as string) : undefined;
    setSearchParams({ name, minPrice, maxPrice });
    setCurrentPage(1);
  };

  const handleOrderChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as 'asc' | 'desc');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <form id='search-filter-product-form' name='search-filter-product-form' onSubmit={handleSearch}>
        <div className='search-row'>
          <TextField aria-label='search-name-filter' id='search-name-filter' variant="outlined" className='search-input' type="text" name="name-field" placeholder="Search by name" />
          <Button aria-label='submit search button' id='submit-search-filter' variant="contained" type="submit" startIcon={<SearchIcon />} className='search-button' />
        </div>
        <div className='filter-row'>
          <TextField aria-label='search-filter-min-price' id='search-filter-min-price' variant="outlined" type="number" name="minPrice" placeholder="Min price" className='price-field' />
          <TextField aria-label='search-filter-max-price' id='search-filter-max-price' variant="outlined" type="number" name="maxPrice" placeholder="Max price" className='price-field' />
          <Select aria-label="Sort by Price" id='dropdown-order-by-price' name='dropdown-order-by-price' onChange={handleOrderChange} value={order}>
            <MenuItem aria-label='Low to High' id='dropdown-option-low-to-high' value="asc">Price: Low to High</MenuItem>
            <MenuItem aria-label='High to Low' id='dropdown-option-high-to-low' value="desc">Price: High to Low</MenuItem>
          </Select>
        </div>
      </form>
      <div className="product-grid">
        {products.map((product: any) => (
          <Link href={`/products/${product.id}`} key={product.id} className="product-card">
            <img loading='lazy' src={product.images[0]} alt={product.name} />
            <div className='product-card-text'>
              <h3>{product.name}</h3>
              <p className="product-card-description">{product.description}</p>
              <p className="product-card-price">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <Pagination count={totalPages} variant="outlined" shape="rounded" onChange={(e, page) => { handlePageChange(page) }} />
      </div>
    </div>
  );
};

export default ProductGrid;
