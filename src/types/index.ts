export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
}

export interface User {
    username: string;
    password: string;
    role: 'user' | 'admin';
}

export interface LoginResponse {
    token: string;
}

export interface ProductFormProps {
    product: Product | null;
    onClose: () => void;
    onSave: () => void;
}

export interface ProductPageProps {
    params: { id: string };
}