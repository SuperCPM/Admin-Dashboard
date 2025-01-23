import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import { CreditCard, DollarSign, Package, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { getStoredProducts, getStoredOrders, getStoredOrderItems } from "@/utils/localStorage";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DashboardPage = () => {
    const { theme } = useTheme();
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [unitSoldData, setUnitSoldData] = useState([]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

    useEffect(() => {
        // Get products count and products data
        const products = getStoredProducts();
        setTotalProducts(products.length);

        // Get orders data
        const orders = getStoredOrders();
        setTotalOrders(orders.length);

        // Get completed orders count and total sales
        const completedOrders = orders.filter(order => order.status === 'Completed');
        setTotalCompletedOrders(completedOrders.length);

        // Get order items and calculate sales data
        const orderItems = getStoredOrderItems();
        const completedOrderIds = completedOrders.map(order => order.id);

        // Calculate quantities per product
        const productQuantities = {};
        let totalUnitsSold = 0;
        products.forEach(product => {
            productQuantities[product.id] = {
                id: product.id,
                name: product.name,
                quantity: 0
            };
        });

        orderItems
            .filter(item => completedOrderIds.includes(item.orderId))
            .forEach(item => {
                if (productQuantities[item.productId]) {
                    productQuantities[item.productId].quantity += item.quantity;
                    totalUnitsSold += item.quantity;
                }
            });

        // Calculate unit sold percentages and prepare chart data
        const unitSoldChartData = Object.values(productQuantities)
            .map(product => ({
                name: product.name,
                value: product.quantity,
                percentage: ((product.quantity / totalUnitsSold) * 100).toFixed(2)
            }))
            .filter(product => product.value > 0)
            .sort((a, b) => b.value - a.value);

        setUnitSoldData(unitSoldChartData);

        // Set popular products (sorted by quantity)
        const popularProductsData = Object.values(productQuantities)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)
            .map((product, index) => ({
                ...product,
                rank: index + 1
            }));

        setPopularProducts(popularProductsData);

        // Calculate sales per product
        const productSales = {};
        let totalSalesAmount = 0;

        orderItems
            .filter(item => completedOrderIds.includes(item.orderId))
            .forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return;

                const itemTotalSale = item.quantity * item.price;
                totalSalesAmount += itemTotalSale;

                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        name: product.name,
                        value: 0
                    };
                }
                productSales[item.productId].value += itemTotalSale;
            });

        // Convert to array and calculate percentages
        const salesDataArray = Object.values(productSales)
            .map(item => ({
                ...item,
                percentage: ((item.value / totalSalesAmount) * 100).toFixed(2)
            }))
            .sort((a, b) => b.value - a.value);

        setSalesData(salesDataArray);
        setTotalSales(totalSalesAmount);

        // Set top products data
        const topProductsData = salesDataArray
            .slice(0, 10)
            .map((product, index) => ({
                id: index,
                name: product.name,
                total: product.value,
                count: orderItems
                    .filter(item => 
                        completedOrderIds.includes(item.orderId) && 
                        products.find(p => p.id === item.productId)?.name === product.name
                    )
                    .reduce((sum, item) => sum + item.quantity, 0),
                rank: index + 1
            }));

        setTopProducts(topProductsData);
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 dark:bg-slate-800 dark:border-gray-700">
                    <p className="font-medium text-slate-900 dark:text-white">
                        {payload[0].name}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                        Sales: ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                        {payload[0].payload.percentage}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="card h-[160px] flex flex-col">
                    <div className="card-header h-[70px]">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Products</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 flex-1 flex items-center">
                        <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalProducts}</p>
                    </div>
                </div>
                <div className="card h-[160px] flex flex-col">
                    <div className="card-header h-[70px]">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Completed Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 flex-1 flex items-center">
                        <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalCompletedOrders}</p>
                    </div>
                </div>
                <div className="card h-[160px] flex flex-col">
                    <div className="card-header h-[70px]">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <ShoppingBag size={26} />
                        </div>
                        <p className="card-title">Total Orders</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 flex-1 flex items-center">
                        <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">{totalOrders}</p>
                    </div>
                </div>
                <div className="card h-[160px] flex flex-col">
                    <div className="card-header h-[70px]">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title">Total Sales</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950 flex-1 flex items-center">
                        <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">${totalSales.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Sales Distribution</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">By total sales revenue</p>
                    </div>
                    <div className="card-body">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={salesData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                        onMouseEnter={(data, index) => {
                                            const slice = document.querySelector(`path[data-index="${index}"]`);
                                            if (slice) {
                                                slice.style.opacity = "0.8";
                                                slice.style.cursor = "pointer";
                                            }
                                        }}
                                        onMouseLeave={(data, index) => {
                                            const slice = document.querySelector(`path[data-index="${index}"]`);
                                            if (slice) {
                                                slice.style.opacity = "1";
                                            }
                                        }}
                                        label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = outerRadius + 25;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                            
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor={x > cx ? 'start' : 'end'}
                                                    dominantBaseline="middle"
                                                    fill={theme === 'dark' ? '#ffffff' : '#000000'}
                                                    style={{ 
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        filter: theme === 'dark' ? 'drop-shadow(0px 0px 1px rgba(0,0,0,0.5))' : 'none'
                                                    }}
                                                >
                                                    {`${percentage}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {salesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Units Sold Distribution</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">By quantity sold</p>
                    </div>
                    <div className="card-body">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={unitSoldData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                        onMouseEnter={(data, index) => {
                                            const slice = document.querySelector(`path[data-index="${index}"]`);
                                            if (slice) {
                                                slice.style.opacity = "0.8";
                                                slice.style.cursor = "pointer";
                                            }
                                        }}
                                        onMouseLeave={(data, index) => {
                                            const slice = document.querySelector(`path[data-index="${index}"]`);
                                            if (slice) {
                                                slice.style.opacity = "1";
                                            }
                                        }}
                                        label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = outerRadius + 25;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                            
                                            return (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor={x > cx ? 'start' : 'end'}
                                                    dominantBaseline="middle"
                                                    fill={theme === 'dark' ? '#ffffff' : '#000000'}
                                                    style={{ 
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        filter: theme === 'dark' ? 'drop-shadow(0px 0px 1px rgba(0,0,0,0.5))' : 'none'
                                                    }}
                                                >
                                                    {`${percentage}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {unitSoldData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 dark:bg-slate-800 dark:border-gray-700">
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {payload[0].name}
                                                        </p>
                                                        <p className="text-slate-700 dark:text-slate-200">
                                                            Units: {payload[0].value.toLocaleString()}
                                                        </p>
                                                        <p className="text-slate-700 dark:text-slate-200">
                                                            {payload[0].payload.percentage}% of total
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Top Products</p>
                    </div>
                    <div className="card-body">
                        <div className="flex flex-col gap-y-4">
                            {topProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between gap-x-4 rounded-lg border border-slate-200 p-4 transition-colors dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                            {product.rank}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-slate-500 transition-colors dark:text-slate-400">
                                                {product.count} units sold
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">
                                        ${product.total.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Popular Products</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Top 10 products by quantity sold</p>
                    </div>
                    <div className="card-body">
                        <div className="flex flex-col gap-y-4">
                            {popularProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between gap-x-4 rounded-lg border border-slate-200 p-4 transition-colors dark:border-slate-800"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                                            {product.rank}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 transition-colors dark:text-slate-50">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-slate-500 transition-colors dark:text-slate-400">
                                                {product.quantity.toLocaleString()} units sold
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardPage;
