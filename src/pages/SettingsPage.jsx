import React, { useState } from 'react';
import { FiUser, FiLock, FiSettings } from 'react-icons/fi';
import PersonalizedSettingsForm from '../components/settings/PersonalizedSettingsForm';
import SecuritySettings from '../components/settings/SecuritySettings';

const SECTIONS = [
	{ key: 'personalized', label: 'Personalization', icon: <FiUser className='mr-2' /> },
	{ key: 'security', label: 'Security', icon: <FiLock className='mr-2' /> },
];

export default function SettingsPage({ initialData }) {
	const [section, setSection] = useState('personalized');

	return (
		<div className='flex flex-col bg-background text-foreground  h-[89vh]'>
			<h1 className='text-xl font-bold p-6 border-b border-border'>Settings</h1>

			<div className='flex flex-1 overflow-hidden h-full'>
				{/* Sidebar */}
				<aside className='w-64 border-r border-border bg-card flex flex-col px-2 py-2'>
					<div className='p-2 flex flex-col gap-1'>
						{SECTIONS.map((s) => (
							<button
								key={s.key}
								className={`flex items-center text-left px-3 py-2 rounded-md font-medium transition-colors ${
									section === s.key
										? 'bg-primary text-primary-foreground shadow-sm'
										: 'hover:bg-secondary hover:text-secondary-foreground text-foreground'
								}`}
								onClick={() => setSection(s.key)}
							>
								{s.icon}
								{s.label}
							</button>
						))}
					</div>
				</aside>

				{/* Main Content */}
				<main className='flex-1 p-8 overflow-y-auto bg-background'>
					{section === 'personalized' && <PersonalizedSettingsForm initialData={initialData} />}
					{section === 'security' && <SecuritySettings />}
				</main>
			</div>
		</div>
	);
}
