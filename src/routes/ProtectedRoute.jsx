import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { ShieldAlert, Ban } from 'lucide-react'; // Import the Ban icon for authorization errors

export const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuthStore();

  // 1. Authentication Check: Is the user logged in?
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          You must be logged in to view this page.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Go to Login
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 transition-transform transform hover:scale-105"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // 2. Authorization Check: Does the user have the required role?
  // This check is only performed if the `roles` prop is provided.
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <Ban className="h-16 w-16 text-orange-500 mb-4" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Permission Denied
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sorry, your account does not have the necessary permissions to access this page. 
          Your current role is <span className="font-semibold text-gray-900">{user.role}</span>.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-white text-gray-700 font-semibold border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  // 3. Success: User is authenticated and authorized.
  return children;
};

export default ProtectedRoute;