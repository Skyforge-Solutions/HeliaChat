import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSettings } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileMenuButton from '../sidebar/MobileMenuButton';
import SearchBar from '../sidebar/SearchBar';
import SessionItem from '../sidebar/SessionItem';
import ClearAllConfirmation from '../sidebar/ClearAllConfirmation';
import apiClient from '../../services/api/ApiClient';

export default function Sidebar({ collapsed, toggleSidebar }) {
	const { data: sessions, isLoading: isSessionsLoading } = apiClient.chat.useGetSessions();
	const { mutateAsync: clearAllSessions } = apiClient.chat.useDeleteAllSessions();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showClearConfirm, setShowClearConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

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

	const handleClearAllSessions = async () => {
		if (!sessions || sessions.length === 0) {
			setShowClearConfirm(false);
			return;
		}
		
		setIsDeleting(true);
		
		try {
			// Use the clearAllSessions endpoint instead of deleting one by one
			await clearAllSessions();
			
			// Navigate to new chat if we're currently in a chat that was deleted
			if (location.pathname.startsWith('/chat/') && location.pathname !== '/chat/new') {
				navigate('/chat/new');
			}
		} catch (error) {
			console.error('Error deleting sessions:', error);
		} finally {
			setIsDeleting(false);
			setShowClearConfirm(false);
		}
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

	// Close mobile menu when navigating
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Generate skeleton items for loading state
	const renderSkeletons = () => {
		return Array(5)
			.fill(0)
			.map((_, index) => (
				<li
					key={`skeleton-${index}`}
					className='animate-pulse'
				>
					<div
						className={`flex items-center p-3 rounded-md hover:bg-accent/50 ${collapsed ? 'justify-center' : ''}`}
					>
						<div className='w-8 h-8 bg-muted rounded-md'></div>
						{!collapsed && (
							<div className='ml-3 flex-1 flex items-center gap-2'>
								<div className='h-6  bg-muted rounded w-2/5 '></div>
								<div className='h-6  bg-muted rounded w-1/5 '></div>
							</div>
						)}
					</div>
				</li>
			));
	};

	return (
		<>
			{/* Mobile menu button */}
			<MobileMenuButton
				isMobileMenuOpen={isMobileMenuOpen}
				toggleMobileMenu={toggleMobileMenu}
			/>

			{/* Sidebar */}
			<div
				className={`fixed top-12 left-0 h-[calc(100vh-48px)] ${
					collapsed ? 'w-16' : 'w-64'
				} bg-background border-r border-border transform ${
					isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				} transition-all duration-300 ease-in-out md:relative z-10 pt-4 pb-4 flex flex-col`}
			>
				<div className={`px-2 py-2 ${collapsed ? 'flex justify-center' : ''}`}>
					<button
						onClick={() => navigate('/chat/new')}
						className={`${
							collapsed ? 'p-2' : 'w-full'
						} flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm`}
						title='New Chat'
					>
						<FiPlus size={16} /> {!collapsed && <span className='font-medium'>New Chat</span>}
					</button>
				</div>

				{/* Search bar */}
				{!collapsed && (
					<SearchBar
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
				)}

				<div className='flex-1 overflow-y-auto px-2 scrollbar-thin'>
					{!collapsed && (
						<h2 className='text-sm font-medium text-muted-foreground px-2 py-2'>Chat History</h2>
					)}
					<ul className='space-y-1'>
						{isSessionsLoading || isDeleting ? (
							renderSkeletons()
						) : filteredSessions.length === 0 ? (
							<li className='text-center text-sm text-muted-foreground py-4'>
								{searchQuery ? 'No matching chats found' : 'No chats found'}
							</li>
						) : (
							filteredSessions.map((session) => (
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
							))
						)}
					</ul>
				</div>

				{/* Footer section - hidden when collapsed */}
				{!collapsed && (
					<div className='mt-auto border-t border-border pt-2 px-4 	'>
						<button
							onClick={() => setShowClearConfirm(true)}
							className='w-full flex items-center text-left py-2 px-2 rounded hover:bg-destructive/10 transition-colors text-destructive'
							title="Clear all chats"
							disabled={isDeleting || isSessionsLoading || !sessions?.length}
						>
							<FiTrash2 className="mr-2" size={14} />
							<span className="text-sm">{isDeleting ? 'Deleting...' : 'Clear all chats'}</span>
						</button>
						
						
					</div>
				)}
			</div>

			{/* Clear all chats confirmation modal */}
			{showClearConfirm && (
				<ClearAllConfirmation
					onClose={() => setShowClearConfirm(false)}
					onConfirm={handleClearAllSessions}
					isDeleting={isDeleting}
				/>
			)}
		</>
	);
}
