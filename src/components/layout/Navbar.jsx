import { useState, useEffect } from 'react';
import { FiCreditCard, FiLogOut } from 'react-icons/fi';
import ThemeSwitcher from '../navbar/ThemeSwitcher';
import UserProfileMenu from '../navbar/UserProfileMenu';
import SettingsModal from '../settings/SettingsModal';
import { useAuth } from '../../context/AuthContext';
import { useCredits } from '../../context/CreditContext';
import logo from '../../assets/logo.svg';
import apiClient from '../../services/api/ApiClient';

export default function Navbar() {
	const { user, logout } = useAuth();
	const { credits ,} = useCredits();
	const [showSettingsModal, setShowSettingsModal] = useState(false);

	const handleOpenSettings = () => {
		setShowSettingsModal(true);
	};

	const handleCloseSettings = () => {
		setShowSettingsModal(false);
	};

	// Close settings modal on escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape' && showSettingsModal) {
				setShowSettingsModal(false);
			}
		};

		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [showSettingsModal]);

	// Update UserProfileMenu to pass onLogout
	const userWithDefaults = {
		name: user?.name || 'User',
		email: user?.email || '',
		credits: credits || 0,
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
							<span>{credits} credits</span>
						</div>

						<ThemeSwitcher />
						<UserProfileMenu
							user={userWithDefaults}
							onOpenUserSettings={handleOpenSettings}
							onLogout={logout}
						/>
					</div>
				</div>
			</nav>

			{/* Settings Modal */}
			{showSettingsModal && (
				<SettingsModal
					onClose={handleCloseSettings}
				/>
			)}
		</>
	);
}
