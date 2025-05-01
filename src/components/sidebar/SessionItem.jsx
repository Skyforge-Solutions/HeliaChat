import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiMoreVertical } from 'react-icons/fi';
import SessionDropdownMenu from './SessionDropdownMenu';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../../services/api/ApiClient';

export default function SessionItem({ session, collapsed, formatDate }) {
	const { chatId } = useParams();
	const [openMenu, setOpenMenu] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [newName, setNewName] = useState('');
	const dropdownRef = useRef();
	const inputRef = useRef();
	const { mutate: renameSession } = apiClient.chat.useRenameSession();

	const toggleMenu = (e) => {
		e.stopPropagation();
		setOpenMenu(!openMenu);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOpenMenu(false);
			}
		};

		if (openMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openMenu]);

	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isRenaming]);

	const startRenaming = () => {
		setNewName(session.name);
		setIsRenaming(true);
		setOpenMenu(false);
	};

	const handleRename = (e) => {
		e.preventDefault();
		// Check if newName exists, is not empty after trimming, and is different from current name
		if (newName && newName.trim() && newName.trim() !== session.name) {
			renameSession({
				chatId: session.id,
				name: newName.trim()
			});
			setIsRenaming(false);
		} else if (!newName || !newName.trim()) {
			// If name is empty, revert to original name
			setNewName(session.name);
			setIsRenaming(false);
		} else {
			// If name is unchanged, just exit rename mode
			setIsRenaming(false);
		}
	};

	return (
		<div
			ref={dropdownRef}
			className={`flex items-center justify-between rounded-md px-2 py-2 ${
				chatId === session.id ? 'bg-secondary' : 'hover:bg-secondary/50'
			}`}
		>
			{isRenaming ? (
				<form
					onSubmit={handleRename}
					className='flex-1'
				>
					<input
						ref={inputRef}
						type='text'
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						className='w-full bg-background border border-input rounded px-2 py-1 text-sm text-foreground'
						onBlur={() => setIsRenaming(false)}
					/>
				</form>
			) : (
				<Link
					to={`/chat/${session.id}`}
					className={`flex items-center flex-1 text-left ${collapsed ? 'justify-center' : 'truncate'}`}
					title={collapsed ? session.name : ''}
				>
					<FiMessageSquare
						className={`${collapsed ? 'mr-0' : 'mr-2'} flex-shrink-0 text-foreground`}
					/>
					{!collapsed && (
						<>
							<span className='truncate text-foreground'>{session.name}</span>
							<span className='ml-2 text-xs text-muted-foreground'>
								{formatDate(session.created_at)}
							</span>
						</>
					)}
				</Link>
			)}

			{!collapsed && !isRenaming && (
				<button
					onClick={toggleMenu}
					className='p-1 text-muted-foreground hover:text-foreground'
				>
					<FiMoreVertical size={16} />
				</button>
			)}

			{openMenu && !collapsed && (
				<SessionDropdownMenu
					sessionId={session.id}
					sessionName={session.name}
					onRename={startRenaming}
				/>
			)}
		</div>
	);
}
