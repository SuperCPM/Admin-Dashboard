import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredOrders, setStoredOrders, getStoredProducts, getStoredOrderItems, setStoredOrderItems } from "@/utils/localStorage";
import { Plus, Trash } from "lucide-react";

const NewOrderPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orderData, setOrderData] = useState({
        customerName: "",
        status: "Pending",
        items: [{ productId: "", quantity: 1 }]
    });

    useEffect(() => {
        setProducts(getStoredProducts());
    }, []);

    const handleAddItem = () => {
        setOrderData({
            ...orderData,
            items: [...orderData.items, { productId: "", quantity: 1 }]
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = orderData.items.filter((_, i) => i !== index);
        setOrderData({
            ...orderData,
            items: newItems
        });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...orderData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'quantity' ? parseInt(value) || 0 : value
        };
        setOrderData({
            ...orderData,
            items: newItems
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get existing orders and order items
        const orders = getStoredOrders();
        const orderItems = getStoredOrderItems();
        
        // Create new order
        const newOrderId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        const newOrder = {
            id: newOrderId,
            orderNumber: `ORD-${String(newOrderId).padStart(3, '0')}`,
            customerName: orderData.customerName,
            orderDate: new Date().toISOString().split('T')[0],
            status: orderData.status
        };

        // Create new order items
        const newOrderItems = orderData.items
            .filter(item => item.productId && item.quantity > 0)
            .map((item, index) => {
                const product = products.find(p => p.id === parseInt(item.productId));
                return {
                    id: orderItems.length + index + 1,
                    orderId: newOrderId,
                    productId: parseInt(item.productId),
                    quantity: item.quantity,
                    price: product ? product.price : 0
                };
            });

        // Save everything
        setStoredOrders([...orders, newOrder]);
        setStoredOrderItems([...orderItems, ...newOrderItems]);

        // Navigate back to orders page
        navigate('/orders');
    };

    // Calculate total
    const calculateTotal = () => {
        return orderData.items.reduce((total, item) => {
            const product = products.find(p => p.id === parseInt(item.productId));
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Create New Order</h1>
            
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Order Details</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Customer Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                value={orderData.customerName}
                                onChange={(e) => setOrderData({...orderData, customerName: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-900 dark:text-slate-50">Status</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                value={orderData.status}
                                onChange={(e) => setOrderData({...orderData, status: e.target.value})}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-slate-900 dark:text-slate-50">Order Items</label>
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="flex items-center gap-x-2 rounded-lg bg-blue-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                                >
                                    <Plus size={14} />
                                    Add Item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {orderData.items.map((item, index) => (
                                    <div key={index} className="flex gap-x-2 items-start">
                                        <div className="flex-1">
                                            <select
                                                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                                value={item.productId}
                                                onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - ${product.price}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {orderData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-slate-900 dark:text-slate-50">Total:</span>
                                <span className="text-lg font-medium text-slate-900 dark:text-slate-50">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => navigate('/orders')}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Create Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewOrderPage;
