import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredOrderItems, setStoredOrderItems, getStoredProducts } from "@/utils/localStorage";

const EditOrderItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderItem, setOrderItem] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const items = getStoredOrderItems();
        // Convert the URL param id to a number since localStorage uses number IDs
        const item = items.find(i => i.id === Number(id));
        if (item) {
            setOrderItem(item);
        }
        setProducts(getStoredProducts());
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const items = getStoredOrderItems();
        const updatedItems = items.map(item => 
            item.id === Number(id) ? orderItem : item
        );
        setStoredOrderItems(updatedItems);
        navigate("/order-items");
    };

    if (!orderItem) {
        return (
            <div className="flex flex-col gap-y-5 p-5">
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                    Order Item Not Found
                </h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-5 p-5">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                Edit Order Item
            </h1>

            <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-y-5">
                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="product"
                        className="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                        Product
                    </label>
                    <select
                        id="product"
                        value={orderItem.productId}
                        onChange={(e) => setOrderItem({ ...orderItem, productId: Number(e.target.value) })}
                        className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        required
                    >
                        <option value="" className="bg-white dark:bg-slate-900">Select a product</option>
                        {products.map((product) => (
                            <option 
                                key={product.id} 
                                value={product.id}
                                className="bg-white dark:bg-slate-900"
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-y-2">
                    <label
                        htmlFor="quantity"
                        className="text-sm font-medium text-slate-900 dark:text-slate-50"
                    >
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={orderItem.quantity}
                        onChange={(e) => setOrderItem({ ...orderItem, quantity: parseInt(e.target.value) })}
                        className="rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-slate-900 dark:text-slate-50 dark:border-slate-700"
                        min="1"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-x-3">
                    <button
                        type="button"
                        onClick={() => navigate("/order-items")}
                        className="rounded-lg px-5 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-500 px-5 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditOrderItemPage;
