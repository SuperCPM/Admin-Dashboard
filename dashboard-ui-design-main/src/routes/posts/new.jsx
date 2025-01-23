import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredPosts, setStoredPosts, getStoredPostCategories } from "@/utils/localStorage";

const CreatePostPage = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        name: "",
        category: "",
        content: ""
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(getStoredPostCategories());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const posts = getStoredPosts();
        
        const newPost = {
            id: crypto.randomUUID(),
            name: post.name,
            category: post.category,
            content: post.content,
            createdAt: new Date().toISOString()
        };
        
        setStoredPosts([...posts, newPost]);
        navigate("/posts");
    };

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                Create New Post
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
                        name="name"
                        value={post.name}
                        onChange={(e) => setPost({ ...post, name: e.target.value })}
                        className="input"
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
                        className="input"
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
                        name="content"
                        value={post.content}
                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                        className="input min-h-[150px] resize-y"
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
                        Create Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;
