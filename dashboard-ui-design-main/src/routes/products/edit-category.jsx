import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditCategoryPage = () => {
    const { id } = useParams();
    const [category, setCategory] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        // Mock data - in a real app, you would fetch this from your API
        setCategory({
            name: "Laptops",
            description: "Portable computers for work and gaming"
        });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle category update logic here
        console.log("Updating category:", category);
        window.location.href = '/product-categories';
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title text-white">Edit Category</h1>
            
            <div className="card">
                <div className="card-header">
                    <p className="card-title text-white">Category Details</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Category Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={category.name}
                                onChange={(e) => setCategory({...category, name: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Description</label>
                            <textarea
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={category.description}
                                onChange={(e) => setCategory({...category, description: e.target.value})}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => window.location.href = '/product-categories'}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Update Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryPage;
