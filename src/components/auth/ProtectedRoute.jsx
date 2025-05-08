import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../shared/loading';
const ProtectedRoute = () => {
	const { isAuthenticated, loading } = useAuth();
	// Show loading state while checking authentication
	if (loading) {
		return <Loading />;
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	// Render children if authenticated
	return <Outlet />;
};

export default ProtectedRoute;
