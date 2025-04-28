import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const { user, logout } = useAuth();

	const toggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	return (
		<div className='h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark'>
			<Navbar
				user={user}
				onLogout={logout}
			/>
			<div className='flex flex-1 overflow-hidden'>
				<div
					className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0 md:w-16' : 'w-0 md:w-64'}`}
				>
					<Sidebar collapsed={sidebarCollapsed} />
				</div>

				<button
					onClick={toggleSidebar}
					className='hidden md:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 z-30 bg-gray-200 dark:bg-gray-700 rounded-full p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
					style={{
						left: sidebarCollapsed ? '3.5rem' : '15rem',
						transition: 'left 0.3s ease',
					}}
				>
					{sidebarCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
				</button>

				<main className='flex-1 overflow-hidden'>
					<Outlet context={{ sidebarCollapsed }} />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
