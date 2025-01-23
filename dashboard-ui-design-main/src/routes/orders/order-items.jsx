import { useState, useEffect } from "react";
import { PencilLine, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStoredOrders, getStoredOrderItems, setStoredOrderItems, getStoredProducts } from "@/utils/localStorage";

const OrderItemsPage = () => {
    const navigate = useNavigate();
    const [orderItems, setOrderItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Load all necessary data
        setOrders(getStoredOrders());
        setOrderItems(getStoredOrderItems());
        setProducts(getStoredProducts());
    }, []);

    const getOrderNumber = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        return order ? order.orderNumber : 'Unknown Order';
    };

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    const handleDelete = (id) => {
        const updatedItems = orderItems.filter(item => item.id !== id);
        setOrderItems(updatedItems);
        setStoredOrderItems(updatedItems);
    };

    // Calculate item total
    const calculateItemTotal = (item) => {
        return item.price * item.quantity;
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Order Items</h1>
            </div>

            <div className="card">
                <div className="card-header">
                    <p className="card-title">All Order Items</p>
                </div>
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Order Number</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Product Name</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Quantity</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Price</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Total</th>
                                    <th className="px-4 py-2 text-left text-slate-900 dark:text-slate-50">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-200 dark:border-slate-800">
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{getOrderNumber(item.orderId)}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{getProductName(item.productId)}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">{item.quantity}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">${item.price.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-50">${calculateItemTotal(item).toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-x-2">
                                                <button 
                                                    onClick={() => navigate(`/order-items/${item.id}`)}
                                                    className="rounded-lg p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                                                >
                                                    <PencilLine size={16} />
                                                </button>
                                                <button 
                                                    className="rounded-lg p-2 text-red-500 dark:text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-red-900"
                                                    onClick={() => handleDelete(item.id)}
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

            {/* Order Items Summary */}
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Summary by Order</p>
                </div>
                <div className="card-body">
                    {Object.entries(
                        orderItems.reduce((acc, item) => {
                            const orderNumber = getOrderNumber(item.orderId);
                            if (!acc[orderNumber]) {
                                acc[orderNumber] = {
                                    itemCount: 0,
                                    totalAmount: 0,
                                };
                            }
                            acc[orderNumber].itemCount += 1;
                            acc[orderNumber].totalAmount += calculateItemTotal(item);
                            return acc;
                        }, {})
                    ).map(([orderNumber, summary]) => (
                        <div key={orderNumber} className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800 last:border-0">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-slate-50">{orderNumber}</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500">{summary.itemCount} items</p>
                            </div>
                            <p className="text-lg font-medium text-slate-900 dark:text-slate-50">${summary.totalAmount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderItemsPage;
