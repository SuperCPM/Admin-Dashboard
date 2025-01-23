import { useState, useEffect } from "react";
import { PencilLine, Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredPosts, setStoredPosts, getStoredPostCategories } from "@/utils/localStorage";

const PostsPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        setPosts(getStoredPosts());
        setCategories(getStoredPostCategories());
    }, []);

    const handleDelete = (id) => {
        const updatedPosts = posts.filter(post => post.id !== id);
        setPosts(updatedPosts);
        setStoredPosts(updatedPosts);
    };

    const filteredPosts = selectedCategory === "all" 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <div className="flex items-center justify-between gap-x-5">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                    Posts
                </h1>
                <button
                    onClick={() => navigate('/posts/new')}
                    className="flex items-center gap-x-2 rounded-lg bg-slate-900 px-5 py-2 text-slate-50 transition-colors hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90"
                >
                    <Plus size={20} />
                    Add Post
                </button>
            </div>

            <div className="flex items-center gap-x-5">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                >
                    <option value="all" className="bg-white dark:bg-slate-900">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-white dark:bg-slate-900">
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => {
                    const category = categories.find(c => c.id === post.category);
                    return (
                        <div
                            key={post.id}
                            className="flex flex-col gap-y-5 rounded-lg border border-slate-300 p-5 dark:border-slate-700"
                        >
                            <div className="flex flex-col gap-y-1">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 truncate">
                                    {post.name}
                                </h2>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Category: {category ? category.name : 'Uncategorized'}
                                </p>
                                {post.createdAt && (
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        Created: {formatDate(post.createdAt)}
                                    </p>
                                )}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 line-clamp-3 break-words">
                                {post.content}
                            </p>
                            <div className="flex items-center justify-end gap-x-3">
                                <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="flex items-center gap-x-2 rounded-lg bg-slate-100 px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80"
                                >
                                    <PencilLine size={20} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="flex items-center gap-x-2 rounded-lg bg-red-100 px-5 py-2 text-red-700 transition-colors hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-500 dark:hover:bg-red-900/20"
                                >
                                    <Trash size={20} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PostsPage;
