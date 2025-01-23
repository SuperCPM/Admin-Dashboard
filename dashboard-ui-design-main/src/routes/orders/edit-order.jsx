import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStoredOrders, setStoredOrders } from "@/utils/localStorage";

const EditOrderPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({
        orderNumber: "",
        customerName: "",
        orderDate: "",
        total: "",
        status: ""
    });

    useEffect(() => {
        const orders = getStoredOrders();
        const foundOrder = orders.find(o => o.id === parseInt(id));
        if (foundOrder) {
            setOrder({
                ...foundOrder,
                total: foundOrder.total.toString(),
                orderDate: foundOrder.orderDate.split('T')[0] // Convert to YYYY-MM-DD format for date input
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const orders = getStoredOrders();
        const updatedOrders = orders.map(o => {
            if (o.id === parseInt(id)) {
                return {
                    ...o,
                    ...order,
                    total: parseFloat(order.total),
                    orderDate: new Date(order.orderDate).toISOString() // Store as ISO string
                };
            }
            return o;
        });
        setStoredOrders(updatedOrders);
        window.location.href = '/orders';
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title text-white">Edit Order</h1>
            
            <div className="card">
                <div className="card-header">
                    <p className="card-title text-white">Order Details</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Order Number</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={order.orderNumber}
                                onChange={(e) => setOrder({...order, orderNumber: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Customer Name</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={order.customerName}
                                onChange={(e) => setOrder({...order, customerName: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Order Date</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={order.orderDate}
                                onChange={(e) => setOrder({...order, orderDate: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Total</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={order.total}
                                onChange={(e) => setOrder({...order, total: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">Status</label>
                            <select
                                className="w-full rounded-lg border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-900 text-white"
                                value={order.status}
                                onChange={(e) => setOrder({...order, status: e.target.value})}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => window.location.href = '/orders'}
                                className="rounded-lg bg-slate-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditOrderPage;
