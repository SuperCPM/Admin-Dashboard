import { useState, useEffect } from "react";
import { PencilLine, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { getStoredPostCategories, setStoredPostCategories } from "@/utils/localStorage";

const PostCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        setCategories(getStoredPostCategories());
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();
        const category = {
            id: crypto.randomUUID(),
            ...newCategory,
        };
        const updatedCategories = [...categories, category];
        setCategories(updatedCategories);
        setStoredPostCategories(updatedCategories);
        setShowAddModal(false);
        setNewCategory({ name: "", description: "" });
    };

    const handleDelete = (id) => {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
        setStoredPostCategories(updatedCategories);
    };

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <div className="flex items-center justify-between gap-x-5">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                    Post Categories
                </h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-x-2 rounded-lg bg-slate-900 px-5 py-2 text-slate-50 transition-colors hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex flex-col gap-y-5 rounded-lg border border-slate-300 p-5 dark:border-slate-700"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                                {category.name}
                            </h2>
                            <p className="text-slate-700 dark:text-slate-300">
                                {category.description}
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-x-3">
                            <Link
                                to={`/posts/categories/${category.id}/edit`}
                                className="flex items-center gap-x-2 rounded-lg bg-slate-100 px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80"
                            >
                                <PencilLine size={20} />
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="flex items-center gap-x-2 rounded-lg bg-red-100 px-5 py-2 text-red-700 transition-colors hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-500 dark:hover:bg-red-900/20"
                            >
                                <Trash size={20} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-5 dark:bg-slate-900">
                        <h2 className="mb-5 text-xl font-semibold text-slate-900 dark:text-slate-50">
                            Add Category
                        </h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-y-5">
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-slate-900 dark:text-slate-50"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, name: e.target.value })
                                    }
                                    className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-slate-900 dark:text-slate-50"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={newCategory.description}
                                    onChange={(e) =>
                                        setNewCategory({ ...newCategory, description: e.target.value })
                                    }
                                    className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end gap-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-lg px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-slate-900 px-5 py-2 text-slate-50 transition-colors hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCategoriesPage;
