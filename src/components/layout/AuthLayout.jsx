import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an auth hook
import Loading from '../shared/loading';
const AuthLayout = () => {
	const { isAuthenticated, isProfileLoading } = useAuth(); // Get authentication status

	if (isProfileLoading) {
		return <Loading />;
	}
	// If user is already authenticated, redirect to home page
	if (isAuthenticated) {
		return (
			<Navigate
				to='/'
				replace
			/>
		);
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-background'>
			<div className='w-full max-w-md mx-auto'>
				<Outlet />
			</div>
		</div>
	);
};

export default AuthLayout;
