import React, { useState } from 'react';
import { FiUser, FiLock, FiMenu } from 'react-icons/fi';
import PersonalizedSettingsForm from '../components/settings/PersonalizedSettingsForm';
import SecuritySettings from '../components/settings/SecuritySettings';

const SECTIONS = [
	{ key: 'personalized', label: 'Personalization', icon: <FiUser className='mr-2' /> },
	{ key: 'security', label: 'Security', icon: <FiLock className='mr-2' /> },
];

export default function SettingsPage({ initialData }) {
	const [section, setSection] = useState('personalized');
	const [showSidebar, setShowSidebar] = useState(false);

	const toggleSidebar = () => {
		setShowSidebar(!showSidebar);
	};

	return (
		<div className='flex flex-col bg-background text-foreground h-[89vh]'>
			<div className='flex items-center border-b border-border'>
				<div className='md:hidden'>
					<button 
						onClick={toggleSidebar} 
						className='p-6 focus:outline-none'
						aria-label='Toggle sidebar'
					>
						<FiMenu />
					</button>
				</div>
				<h1 className='text-xl font-bold p-6'>Settings</h1>
			</div>

			<div className='flex flex-1 overflow-hidden h-full relative'>
				{/* Sidebar */}
				<aside className={`absolute md:relative z-10 h-full w-64 border-r border-border bg-card flex flex-col px-2 py-2 ${showSidebar ? 'block' : 'hidden md:block'}`}>
					<div className='p-2 flex flex-col gap-1'>
						{SECTIONS.map((s) => (
							<button
								key={s.key}
								className={`flex items-center text-left px-3 py-2 rounded-md font-medium transition-colors ${
									section === s.key
										? 'bg-primary text-primary-foreground shadow-sm'
										: 'hover:bg-secondary hover:text-secondary-foreground text-foreground'
								}`}
								onClick={() => {
									setSection(s.key);
									if (window.innerWidth < 768) setShowSidebar(false);
								}}
							>
								{s.icon}
								{s.label}
							</button>
						))}
					</div>
				</aside>

				{/* Main Content */}
				<main className='flex-1 p-4 md:p-8 overflow-y-auto bg-background'>
					{section === 'personalized' && <PersonalizedSettingsForm initialData={initialData} />}
					{section === 'security' && <SecuritySettings />}
				</main>
			</div>
		</div>
	);
}
