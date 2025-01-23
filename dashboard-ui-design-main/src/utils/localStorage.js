// Initial mock data
const initialProducts = [
    {
        id: 1,
        name: "Gaming Laptop X1",
        category: "Laptops",
        price: 1299.99,
        inStock: 15,
        description: "High-performance gaming laptop with RTX 3080",
        createdAt: "2025-01-16"
    },
    {
        id: 2,
        name: "Wireless Mouse Pro",
        category: "Peripherals",
        price: 49.99,
        inStock: 50,
        description: "Professional wireless mouse with ergonomic design",
        createdAt: "2025-01-16"
    },
    {
        id: 3,
        name: "4K Monitor 27\"",
        category: "Monitors",
        price: 399.99,
        inStock: 8,
        description: "27-inch 4K monitor with HDR support",
        createdAt: "2025-01-16"
    }
];

const initialOrderItems = [
    {
        id: 1,
        orderId: 1,
        productId: 1,
        quantity: 1,
        price: 1299.99
    },
    {
        id: 2,
        orderId: 2,
        productId: 2,
        quantity: 2,
        price: 49.99
    },
    {
        id: 3,
        orderId: 2,
        productId: 3,
        quantity: 1,
        price: 399.99
    }
];

const initialOrders = [
    {
        id: 1,
        orderNumber: "ORD-001",
        customerName: "John Doe",
        orderDate: "2025-01-16",
        status: "Pending"
    },
    {
        id: 2,
        orderNumber: "ORD-002",
        customerName: "Jane Smith",
        orderDate: "2025-01-16",
        status: "Completed"
    }
];

const initialCategories = [
    {
        id: 1,
        name: "Laptops",
        description: "Portable computers for work and gaming",
        productCount: 15,
        createdAt: "2025-01-16"
    },
    {
        id: 2,
        name: "Peripherals",
        description: "Computer accessories and input devices",
        productCount: 25,
        createdAt: "2025-01-16"
    },
    {
        id: 3,
        name: "Monitors",
        description: "Display screens for computers",
        productCount: 10,
        createdAt: "2025-01-16"
    }
];

// Products
export const getStoredProducts = () => {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(storedProducts);
};

export const setStoredProducts = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
};

// Order Items
export const getStoredOrderItems = () => {
    const storedOrderItems = localStorage.getItem('orderItems');
    if (!storedOrderItems) {
        localStorage.setItem('orderItems', JSON.stringify(initialOrderItems));
        return initialOrderItems;
    }
    return JSON.parse(storedOrderItems);
};

export const setStoredOrderItems = (orderItems) => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
};

// Calculate order total from order items
export const calculateOrderTotal = (orderId) => {
    const orderItems = getStoredOrderItems();
    return orderItems
        .filter(item => item.orderId === orderId)
        .reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Orders
export const getStoredOrders = () => {
    const storedOrders = localStorage.getItem('orders');
    let orders;
    if (!storedOrders) {
        orders = initialOrders;
        localStorage.setItem('orders', JSON.stringify(orders));
    } else {
        orders = JSON.parse(storedOrders);
    }
    
    // Add total to each order based on its items
    return orders.map(order => ({
        ...order,
        total: calculateOrderTotal(order.id)
    }));
};

export const setStoredOrders = (orders) => {
    // Remove total before storing as it's calculated dynamically
    const ordersToStore = orders.map(({ total, ...order }) => order);
    localStorage.setItem('orders', JSON.stringify(ordersToStore));
};

// Categories
export const getStoredCategories = () => {
    const storedCategories = localStorage.getItem('categories');
    if (!storedCategories) {
        localStorage.setItem('categories', JSON.stringify(initialCategories));
        return initialCategories;
    }
    return JSON.parse(storedCategories);
};

export const setStoredCategories = (categories) => {
    localStorage.setItem('categories', JSON.stringify(categories));
};

// Posts
export const getStoredPosts = () => {
    const posts = localStorage.getItem("posts");
    return posts ? JSON.parse(posts) : [];
};

export const setStoredPosts = (posts) => {
    localStorage.setItem("posts", JSON.stringify(posts));
};

// Post Categories
export const getStoredPostCategories = () => {
    const categories = localStorage.getItem("post_categories");
    return categories ? JSON.parse(categories) : [];
};

export const setStoredPostCategories = (categories) => {
    localStorage.setItem("post_categories", JSON.stringify(categories));
};
