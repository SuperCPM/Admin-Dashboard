import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredProducts, setStoredProducts, getStoredCategories } from "@/utils/localStorage";

const EditProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        category: "",
        price: "",
        inStock: "",
        description: ""
    });
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const products = getStoredProducts();
        const foundProduct = products.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct({
                ...foundProduct,
                price: foundProduct.price ? foundProduct.price.toString() : "",
                inStock: foundProduct.inStock ? foundProduct.inStock.toString() : ""
            });
        } else {
            setNotFound(true);
        }
        setCategories(getStoredCategories());
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const products = getStoredProducts();
        const updatedProducts = products.map(p => {
            if (p.id === parseInt(id)) {
                return {
                    ...p,
                    ...product,
                    price: parseFloat(product.price) || 0,
                    inStock: parseInt(product.inStock) || 0
                };
            }
            return p;
        });
        setStoredProducts(updatedProducts);
        navigate('/products');
    };

    if (notFound) {
        return (
            <div className="flex flex-col gap-y-4">
                <h1 className="title text-white">Product Not Found</h1>
                <div className="card">
                    <div className="card-body">
                        <p className="text-white">The product you're trying to edit does not exist.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title text-white">Edit Product</h1>
            
            <div className="card">
                <div className="card-header">
                    <p className="card-title text-white">Product Details</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Product Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={product.name || ""}
                                onChange={(e) => setProduct({...product, name: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Category</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={product.category || ""}
                                onChange={(e) => setProduct({...product, category: e.target.value})}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={product.price || ""}
                                onChange={(e) => setProduct({...product, price: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">In Stock</label>
                            <input
                                type="number"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={product.inStock || ""}
                                onChange={(e) => setProduct({...product, inStock: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Description</label>
                            <textarea
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={product.description || ""}
                                onChange={(e) => setProduct({...product, description: e.target.value})}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => navigate('/products')}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductPage;
