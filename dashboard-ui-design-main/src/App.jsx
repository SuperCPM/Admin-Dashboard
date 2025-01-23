import { createBrowserRouter, RouterProvider, Navigate, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import DashboardPage from "@/routes/dashboard/page";
import OrdersPage from "@/routes/orders/page";
import OrderItemsPage from "@/routes/orders/order-items";
import NewOrderPage from "@/routes/orders/new-order";
import EditOrderPage from "@/routes/orders/edit-order";
import EditOrderItemPage from "@/routes/orders/edit-order-item";
import ProductCategoriesPage from "@/routes/products/categories";
import EditCategoryPage from "@/routes/products/edit-category";
import ProductsPage from "@/routes/products/page";
import EditProductPage from "@/routes/products/edit-product";
import PostsPage from "@/routes/posts/page";
import PostCategoriesPage from "@/routes/posts/categories";
import EditPostPage from "@/routes/posts/edit-post";
import EditPostCategoryPage from "@/routes/posts/edit-category";
import NewPostPage from "@/routes/posts/new";
import LoginPage from "@/routes/login/page";
import Layout from "@/routes/layout";
import UnauthorizedPage from "@/routes/unauthorized/page";

function AppRoutes() {
    const { isAuthenticated, userRole, login } = useAuth();

    const router = createBrowserRouter([
        {
            path: "/login",
            element: !isAuthenticated ? (
                <LoginPage onLogin={login} />
            ) : (
                <Navigate to="/" replace />
            ),
        },
        {
            path: "/unauthorized",
            element: isAuthenticated && userRole !== 'admin' ? (
                <UnauthorizedPage />
            ) : (
                <Navigate to="/login" replace />
            ),
        },
        {
            path: "/",
            element: isAuthenticated ? (
                userRole === 'admin' ? (
                    <ThemeProvider>
                        <Layout />
                    </ThemeProvider>
                ) : (
                    <Navigate to="/unauthorized" replace />
                )
            ) : (
                <Navigate to="/login" replace />
            ),
            children: [
                {
                    index: true,
                    element: <DashboardPage />,
                },
                {
                    path: "orders",
                    element: <OrdersPage />,
                },
                {
                    path: "order-items",
                    element: <OrderItemsPage />,
                },
                {
                    path: "orders/new",
                    element: <NewOrderPage />,
                },
                {
                    path: "orders/:id",
                    element: <EditOrderPage />,
                },
                {
                    path: "order-items/:id",
                    element: <EditOrderItemPage />,
                },
                {
                    path: "products",
                    element: <ProductsPage />,
                },
                {
                    path: "products/:id",
                    element: <EditProductPage />,
                },
                {
                    path: "product-categories",
                    element: <ProductCategoriesPage />,
                },
                {
                    path: "product-categories/:id",
                    element: <EditCategoryPage />,
                },
                {
                    path: "posts",
                    element: <PostsPage />,
                },
                {
                    path: "posts/categories",
                    element: <PostCategoriesPage />,
                },
                {
                    path: "posts/new",
                    element: <NewPostPage />,
                },
                {
                    path: "posts/:id",
                    element: <EditPostPage />,
                },
                {
                    path: "posts/categories/:id",
                    element: <EditPostCategoryPage />,
                },
            ],
        },
        {
            path: "*",
            element: <Navigate to="/login" replace />,
        },
    ]);

    return <RouterProvider router={router} />;
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
