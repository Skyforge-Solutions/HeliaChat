import { useState, useEffect } from 'react';
import { FiCreditCard, FiLogOut } from 'react-icons/fi';
import ThemeSwitcher from '../navbar/ThemeSwitcher';
import UserProfileMenu from '../navbar/UserProfileMenu';
import UserSettingsForm from '../navbar/UserSettingsForm';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

export default function Navbar() {
	const { user, logout } = useAuth();
	const [showUserDataForm, setShowUserDataForm] = useState(false);

	// Initialize user data from localStorage if available
	const [userData, setUserData] = useState(() => {
		const savedUserData = localStorage.getItem('heliaUserData');
		if (savedUserData) {
			try {
				return JSON.parse(savedUserData);
			} catch (e) {
				console.error('Error parsing user data:', e);
				return getDefaultUserData();
			}
		}
		return getDefaultUserData();
	});

	function getDefaultUserData() {
		return {
			name: user?.name || '',
			age: '',
			occupation: '',
			tone_preference: 'casual',
			tech_familiarity: 'moderate',
			parent_type: '',
			time_with_kids: '2',
			children: [],
		};
	}

	const handleOpenUserSettings = () => {
		setShowUserDataForm(true);
	};

	const handleCloseUserSettings = () => {
		setShowUserDataForm(false);
		// Refresh user data from localStorage if it was updated
		const savedUserData = localStorage.getItem('heliaUserData');
		if (savedUserData) {
			try {
				setUserData(JSON.parse(savedUserData));
			} catch (e) {
				console.error('Error parsing user data:', e);
			}
		}
	};

	// Close user data form on escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape' && showUserDataForm) {
				setShowUserDataForm(false);
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [showUserDataForm]);

	// Update UserProfileMenu to pass onLogout
	const userWithDefaults = {
		name: user?.name || 'User',
		email: user?.email || '',
		credits: user?.credits || 0,
		subscriptionType: user?.subscriptionType || 'Free',
		language: user?.language || 'English',
	};

	return (
		<>
			<nav className='fixed top-0 w-full bg-background px-4 py-2 z-10'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center ml-11'>
						<img
							src={logo}
							alt='HeliaChat Logo'
							className='h-8'
						/>
					</div>

					<div className='flex items-center space-x-4'>
						<div className='text-sm text-muted-foreground hidden sm:flex items-center'>
							<FiCreditCard className='mr-1' />
							<span>{userWithDefaults.credits} credits</span>
						</div>

						<ThemeSwitcher />
						<UserProfileMenu
							user={userWithDefaults}
							onOpenUserSettings={handleOpenUserSettings}
							onLogout={logout}
						/>
					</div>
				</div>
			</nav>

			{/* User Settings Form */}
			{showUserDataForm && (
				<UserSettingsForm
					onClose={handleCloseUserSettings}
					initialData={userData}
				/>
			)}
		</>
	);
}
