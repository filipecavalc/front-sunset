"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProductById, getRandomProducts } from '@/utils/api';
import { Product, ProductPageProps } from '@/types';
import { Button, Card, CardContent, CardMedia, CircularProgress, Rating, Typography } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [randomProducts, setRandomProducts] = useState<Product[]>([]);
    const [rating, setRating] = useState<number | null>();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(parseInt(params.id));
            setProduct(data);
            setSelectedImage(data.images[0]);
        };

        const fetchRandomProducts = async () => {
            const data = await getRandomProducts();
            setRandomProducts(data);
        };

        fetchProduct();
        fetchRandomProducts();
    }, [params.id]);

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleProductClick = (id: number) => {
        router.push(`/products/${id}`);
    };

    if (!product) {
        return <CircularProgress />;
    }

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="product-page">
            <div className='product-info-plus-images'>
                <div className="product-images">
                    <div className="selected-image">
                        <img loading='lazy' src={selectedImage} alt={product.name} />
                    </div>
                    <div className="image-carousel">
                        {product.images.map((image, index) => (
                            <img
                                loading='lazy'
                                key={index}
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                onClick={() => handleImageClick(image)}
                                className={image === selectedImage ? 'selected' : ''}
                            />
                        ))}
                    </div>
                </div>
                <div className='product-info'>
                    <Typography variant="h5" >{product.name}</Typography >
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                    <div className='product-info-stock-price'>
                        <Typography variant='subtitle1'>Estoque: {product.stock}</Typography>
                        <Typography variant='subtitle1'>Preço: ${product.price}</Typography>
                    </div>
                    <Typography variant='body1'>{product.description}</Typography>
                </div>
            </div>
            <div className="random-products-carousel">
                <Typography variant="h6" gutterBottom>Produtos Relacionados</Typography>
                <Carousel responsive={responsive} infinite={true} autoPlay={true}>
                    {randomProducts.map((randomProduct) => (
                        <Card key={randomProduct.id} className="random-product-card">
                            <CardMedia loading='lazy' component="img" height="194" image={randomProduct.images[0]} alt={randomProduct.name} />
                            <CardContent>
                                <Typography variant='h6'>{randomProduct.name}</Typography>
                                <Typography variant='body1'>${randomProduct.price}</Typography>
                                <Button variant='contained' onClick={() => handleProductClick(randomProduct.id)}>Ver Produto</Button>
                            </CardContent>
                        </Card>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default ProductPage;