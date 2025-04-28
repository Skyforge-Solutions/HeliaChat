import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MobileMenuButton from '../sidebar/MobileMenuButton';
import SearchBar from '../sidebar/SearchBar';
import SessionItem from '../sidebar/SessionItem';
import ClearAllConfirmation from '../sidebar/ClearAllConfirmation';
import apiClient from '../../services/api/ApiClient';

export default function Sidebar({ collapsed }) {
	const { data: sessions, isLoading: isSessionsLoading } = apiClient.chat.useGetSessions();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showClearConfirm, setShowClearConfirm] = useState(false);
	const navigate = useNavigate();


	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
		}).format(date);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleClearAllSessions = () => {
		setShowClearConfirm(false);
		clearAllSessions();
	};

	// Filter sessions based on search query
	const [filteredSessions, setFilteredSessions] = useState([]);
	
	useEffect(() => {
		if (!isSessionsLoading && sessions) {
			const filtered = sessions.filter((session) =>
				session.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredSessions(filtered);
		}
	}, [sessions, searchQuery, isSessionsLoading]);

	return (
		<>
			{/* Mobile menu button - now as a component */}
			<MobileMenuButton
				isMobileMenuOpen={isMobileMenuOpen}
				toggleMobileMenu={toggleMobileMenu}
			/>

			{/* Sidebar */}
			<div
				className={`fixed top-12 left-0 h-[calc(100vh-48px)] ${
					collapsed ? 'w-16' : 'w-64'
				} bg-background transform ${
					isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				}  ease-in-out md:relative z-10 pt-4 pb-4 flex flex-col`}
			>
				<div className={`px-2 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
					<button
						onClick={() => navigate('/chat/new')}
						className={`${
							collapsed ? 'p-2' : 'w-full'
						} flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity shadow-sm`}
						title='New Chat'
					>
						<FiPlus size={16} /> {!collapsed && <span className='font-medium'>New Chat</span>}
					</button>
				</div>

				{/* Search bar - now as a component */}
				{!collapsed && (
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
				)}

				<div className='flex-1 overflow-y-auto px-2'>
					{!collapsed && (
						<h2 className='text-sm font-medium text-muted-foreground px-2 py-2'>Chat History</h2>
					)}
					<ul className='space-y-1'>
            
            {isSessionsLoading ? (
              <li className='text-center text-sm text-muted-foreground'>
                Loading...
              </li>
            ) : (
              filteredSessions.length === 0 && (
                <li className='text-center text-sm text-muted-foreground'>
                  No chats found
                </li>
              )
            )}
            
						{filteredSessions.map((session) => (
							<li
								key={session.id}
								className='relative'
							>
								<SessionItem
									session={session}
									collapsed={collapsed}
									formatDate={formatDate}
								
								/>
							</li>
						))}
					</ul>
				</div>

				{/* Footer section - hidden when collapsed */}
				{!collapsed && (
					<div className='mt-auto px-4 py-2 text-xs text-muted-foreground'>
						<div className='pt-2'>
							<button
								onClick={() => setShowClearConfirm(true)}
								className='w-full text-left py-1 px-2 rounded hover:bg-secondary transition-colors text-destructive'
							>
								<span>Clear all chats</span>
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Clear all chats confirmation modal - now as a component */}
			{showClearConfirm && (
				<ClearAllConfirmation
					onClose={() => setShowClearConfirm(false)}
					onConfirm={handleClearAllSessions}
				/>
			)}
		</>
	);
}
