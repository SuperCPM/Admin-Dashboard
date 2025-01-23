import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredPosts, setStoredPosts, getStoredPostCategories } from "@/utils/localStorage";

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({
        name: "",
        category: "",
        content: ""
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const posts = getStoredPosts();
        if (id !== "new") {
            const postToEdit = posts.find((p) => p.id === id);
            if (!postToEdit) {
                navigate("/posts");
                return;
            }
            setPost(postToEdit);
        }

        setCategories(getStoredPostCategories());
    }, [id, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const posts = getStoredPosts();
        
        if (id === "new") {
            navigate("/create-post");
            return;
        } else {
            const updatedPosts = posts.map((p) =>
                p.id === id ? { ...p, ...post } : p
            );
            setStoredPosts(updatedPosts);
        }
        
        navigate("/posts");
    };

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                {id === "new" ? "Add Post" : "Edit Post"}
            </h1>

            <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-y-5">
                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                        Post Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={post.name}
                        onChange={(e) => setPost({ ...post, name: e.target.value })}
                        className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        required
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="category"
                        className="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                        Category
                    </label>
                    <select
                        id="category"
                        value={post.category}
                        onChange={(e) => setPost({ ...post, category: e.target.value })}
                        className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        required
                    >
                        <option value="" className="bg-white dark:bg-slate-900">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id} className="bg-white dark:bg-slate-900">
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="content"
                        className="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={post.content}
                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                        className="min-h-[200px] rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/posts")}
                        className="rounded-lg px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-5 py-2 text-slate-50 transition-colors hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                    >
                        {id === "new" ? "Add" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostPage;
