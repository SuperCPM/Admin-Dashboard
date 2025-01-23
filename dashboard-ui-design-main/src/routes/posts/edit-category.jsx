import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredPostCategories, setStoredPostCategories } from "@/utils/localStorage";

const EditPostCategoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        const categories = getStoredPostCategories();
        const categoryToEdit = categories.find((c) => c.id === id);
        
        if (!categoryToEdit) {
            navigate("/posts/categories");
            return;
        }

        setCategory(categoryToEdit);
    }, [id, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const categories = getStoredPostCategories();
        const updatedCategories = categories.map((c) =>
            c.id === id ? { ...c, ...category } : c
        );
        setStoredPostCategories(updatedCategories);
        navigate("/posts/categories");
    };

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                Edit Category
            </h1>

            <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-y-5">
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
                        value={category.name}
                        onChange={(e) =>
                            setCategory({ ...category, name: e.target.value })
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
                        value={category.description}
                        onChange={(e) =>
                            setCategory({ ...category, description: e.target.value })
                        }
                        className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/posts/categories")}
                        className="rounded-lg px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-5 py-2 text-slate-50 transition-colors hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostCategoryPage;
