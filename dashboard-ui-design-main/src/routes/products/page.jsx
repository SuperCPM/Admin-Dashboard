import { useState, useEffect } from "react";
import { PencilLine, Plus, Trash } from "lucide-react";
import { getStoredProducts, setStoredProducts, getStoredCategories } from "@/utils/localStorage";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        setProducts(getStoredProducts());
        setCategories(getStoredCategories());
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "",
        price: "",
        inStock: "",
        description: ""
    });

    const handleDelete = (id) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        setStoredProducts(updatedProducts);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const updatedProducts = [...products, {
            id: newId,
            ...newProduct,
            price: parseFloat(newProduct.price),
            inStock: parseInt(newProduct.inStock),
            createdAt: new Date().toISOString().split('T')[0]
        }];
        setProducts(updatedProducts);
        setStoredProducts(updatedProducts);
        setNewProduct({
            name: "",
            category: "",
            price: "",
            inStock: "",
            description: ""
        });
        setShowAddModal(false);
    };

    const filteredProducts = selectedCategory === "all" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Products</h1>
                <button 
                    className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    onClick={() => {
                        setCategories(getStoredCategories());
                        setShowAddModal(true);
                    }}
                >
                    <Plus size={16} />
                    Add Product
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <p className="card-title">All Products</p>
                    <div className="flex items-center gap-x-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-50">Filter by Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">Name</th>
                                    <th className="table-head">Category</th>
                                    <th className="table-head">Price</th>
                                    <th className="table-head">In Stock</th>
                                    <th className="table-head">Description</th>
                                    <th className="table-head">Created Date</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="table-row">
                                        <td className="table-cell">{product.name}</td>
                                        <td className="table-cell">{product.category}</td>
                                        <td className="table-cell">${product.price.toFixed(2)}</td>
                                        <td className="table-cell">
                                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                product.inStock > 10 
                                                    ? "bg-green-500/20 text-green-500" 
                                                    : product.inStock > 0
                                                        ? "bg-yellow-500/20 text-yellow-500"
                                                        : "bg-red-500/20 text-red-500"
                                            }`}>
                                                {product.inStock} units
                                            </span>
                                        </td>
                                        <td className="table-cell">{product.description}</td>
                                        <td className="table-cell">{product.createdAt}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-2">
                                                <button 
                                                    className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                                    onClick={() => window.location.href = `/edit-product/${product.id}`}
                                                >
                                                    <PencilLine size={16} />
                                                </button>
                                                <button 
                                                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-4 dark:bg-slate-900">
                        <h2 className="mb-4 text-xl font-medium text-slate-900 dark:text-slate-50">Add New Product</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Category</label>
                                <select
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">In Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                    value={newProduct.inStock}
                                    onChange={(e) => setNewProduct({...newProduct, inStock: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Description</label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
