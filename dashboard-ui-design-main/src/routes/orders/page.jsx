import { useState, useEffect } from "react";
import { PencilLine, Plus, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { getStoredOrders, setStoredOrders, getStoredOrderItems, getStoredProducts } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        setOrders(getStoredOrders());
        setOrderItems(getStoredOrderItems());
        setProducts(getStoredProducts());
    }, []);

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Unknown Product';
    };

    const getOrderItems = (orderId) => {
        return orderItems.filter(item => item.orderId === orderId);
    };

    const handleDelete = (id) => {
        const updatedOrders = orders.filter(order => order.id !== id);
        setOrders(updatedOrders);
        setStoredOrders(updatedOrders);
    };

    const toggleOrderExpand = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Orders</h1>
                <button 
                    className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    onClick={() => navigate('/orders/new')}
                >
                    <Plus size={16} />
                    Add Order
                </button>
            </div>

            <div className="card">
                <div className="card-header">
                    <p className="card-title">All Orders</p>
                </div>
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="table-head"></th>
                                    <th className="table-head">Order Number</th>
                                    <th className="table-head">Order Date</th>
                                    <th className="table-head">Customer</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Total</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <>
                                        <tr key={order.id} className="table-row">
                                            <td className="table-cell">
                                                <button
                                                    onClick={() => toggleOrderExpand(order.id)}
                                                    className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                                                >
                                                    {expandedOrders[order.id] ? (
                                                        <ChevronUp size={16} />
                                                    ) : (
                                                        <ChevronDown size={16} />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="table-cell">{order.orderNumber}</td>
                                            <td className="table-cell">{formatDate(order.orderDate)}</td>
                                            <td className="table-cell">{order.customerName}</td>
                                            <td className="table-cell">
                                                <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                                    order.status === 'Completed' 
                                                        ? "bg-green-500/20 text-green-500" 
                                                        : order.status === 'Pending'
                                                            ? "bg-yellow-500/20 text-yellow-500"
                                                            : "bg-red-500/20 text-red-500"
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="table-cell">${getOrderItems(order.id).reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</td>
                                            <td className="table-cell">
                                                <div className="flex items-center gap-x-2">
                                                    <button 
                                                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                    >
                                                        <PencilLine size={16} />
                                                    </button>
                                                    <button 
                                                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                                                        onClick={() => handleDelete(order.id)}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedOrders[order.id] && (
                                            <tr>
                                                <td colSpan="7" className="p-4 bg-slate-100 dark:bg-slate-800">
                                                    <div className="text-sm">
                                                        <div className="font-medium mb-2 text-slate-900 dark:text-slate-50">Products in Order:</div>
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="text-slate-900 dark:text-slate-50">
                                                                    <th className="text-left px-2">Product</th>
                                                                    <th className="text-left px-2">Quantity</th>
                                                                    <th className="text-left px-2">Price</th>
                                                                    <th className="text-left px-2">Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {getOrderItems(order.id).map((item) => (
                                                                    <tr key={item.id} className="text-slate-900 dark:text-slate-50">
                                                                        <td className="px-2">{getProductName(item.productId)}</td>
                                                                        <td className="px-2">{item.quantity}</td>
                                                                        <td className="px-2">${item.price.toFixed(2)}</td>
                                                                        <td className="px-2">${(item.price * item.quantity).toFixed(2)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
