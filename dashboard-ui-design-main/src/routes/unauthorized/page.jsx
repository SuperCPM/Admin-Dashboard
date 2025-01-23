import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage items
        window.location.reload(); // Force a page reload to clear any cached state
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Access Denied
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        You are not an Admin! You can't access the dashboard.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
