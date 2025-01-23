import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "@/contexts/auth-context";

export const Header = ({ collapsed, setCollapsed }) => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="flex h-16 items-center justify-between gap-x-4 border-b border-slate-300 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-x-4">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="btn-ghost lg:hidden"
                >
                    <Menu size={24} />
                </button>
            </div>
            <div className="flex items-center gap-x-4">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {theme === "light" ? (
                        <Moon className="size-5 text-slate-900 dark:text-white" />
                    ) : (
                        <Sun className="size-5 text-slate-900 dark:text-white" />
                    )}
                </button>
                <button
                    onClick={handleLogout}
                    className="btn-ghost"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
