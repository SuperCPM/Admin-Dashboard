import { useState, useEffect } from "react";
import { PencilLine, Plus, Trash } from "lucide-react";
import { getStoredCategories, setStoredCategories } from "@/utils/localStorage";

const ProductCategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(getStoredCategories());
    }, []);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: ""
    });

    const handleDelete = (id) => {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        setStoredCategories(updatedCategories);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        const updatedCategories = [...categories, {
            id: newId,
            ...newCategory,
            productCount: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }];
        setCategories(updatedCategories);
        setStoredCategories(updatedCategories);
        setNewCategory({
            name: "",
            description: ""
        });
        setShowAddModal(false);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title text-slate-900 dark:text-slate-50">Product Categories</h1>
                <button 
                    className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <p className="card-title text-slate-900 dark:text-slate-50">All Categories</p>
                </div>
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Name</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Description</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Products</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Created Date</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b border-slate-200 dark:border-slate-800">
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{category.name}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{category.description}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{category.productCount}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{category.createdAt}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-x-2">
                                                <button 
                                                    className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    onClick={() => window.location.href = `/edit-category/${category.id}`}
                                                >
                                                    <PencilLine size={16} />
                                                </button>
                                                <button 
                                                    className="rounded-lg p-2 text-red-500 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900"
                                                    onClick={() => handleDelete(category.id)}
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

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">Add New Category</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Description</label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-50"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCategoriesPage;
