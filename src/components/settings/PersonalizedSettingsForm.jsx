import { useState, useEffect } from 'react';
import { FiClock, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api/ApiClient';

export default function PersonalizedSettingsForm({ initialData }) {
	const { user } = useAuth();
	
	// Initialize with props or user data from context, prioritizing props
	const defaultData = {
		name: user?.name || '',
		age: user?.age || '',
		occupation: user?.occupation || '',
		tone_preference: user?.tone_preference || 'casual',
		tech_familiarity: user?.tech_familiarity || 'moderate',
		parent_type: user?.parent_type || '',
		time_with_kids: user?.time_with_kids || '2',
		children: user?.children || [],
	};
	// Use initialData if provided, otherwise use user data from context
	const [userData, setUserData] = useState(initialData || defaultData);
	const [saved, setSaved] = useState(false);

	const saveUserDataMutation = apiClient.users.useUpdateProfile({
		onSuccess: () => {
			setSaved(true);
			setTimeout(() => setSaved(false), 3000);
		},
		onError: (error) => {
			console.error('Error saving user data:', error);
		},
	});

	// Update userData when user data changes
	useEffect(() => {
		if (user && !initialData) {
			setUserData(prevData => ({
				...prevData,
				...Object.fromEntries(
					Object.entries(defaultData).filter(([key, value]) => value !== '')
				)
			}));
		}
	}, [user, initialData]);

	const handleUserDataChange = (e) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleAddChild = () => {
		setUserData((prevData) => ({
			...prevData,
			children: [...prevData.children, { name: '', age: '', gender: '', description: '' }],
		}));
	};

	const handleChildChange = (index, field, value) => {
		const updatedChildren = [...userData.children];
		updatedChildren[index] = {
			...updatedChildren[index],
			[field]: value,
		};
		setUserData((prevData) => ({
			...prevData,
			children: updatedChildren,
		}));
	};

	const removeChild = (index) => {
		setUserData((prevData) => ({
			...prevData,
			children: prevData.children.filter((_, i) => i !== index),
		}));
	};

	const saveUserData = async (e) => {
		e.preventDefault();
		saveUserDataMutation.mutate(userData);
	};

	return (
		<form
			onSubmit={saveUserData}
			className='max-w-xl mx-auto space-y-6'
		>
			<div className='flex justify-between items-center mb-6'>
				<h3 className='text-xl font-semibold'>Personalized Settings</h3>
				{saved && (
					<div className='bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-2 rounded-md text-sm flex items-center'>
						<FiSave className='mr-2' /> Settings saved successfully!
					</div>
				)}
			</div>

			<div className='space-y-5 bg-card p-6 rounded-lg border border-border'>
				<h4 className='font-medium text-md mb-4'>Basic Information</h4>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Name
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={userData.name}
							onChange={handleUserDataChange}
							placeholder='Your name'
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						/>
					</div>
					<div>
						<label
							htmlFor='age'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Age
						</label>
						<input
							type='number'
							id='age'
							name='age'
							min='1'
							max='100'
							value={userData.age}
							onChange={handleUserDataChange}
							placeholder='Your age'
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						/>
					</div>
					<div>
						<label
							htmlFor='occupation'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Occupation
						</label>
						<input
							type='text'
							id='occupation'
							name='occupation'
							value={userData.occupation}
							onChange={handleUserDataChange}
							placeholder='Your occupation'
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						/>
					</div>
				</div>
			</div>

			<div className='space-y-5 bg-card p-6 rounded-lg border border-border'>
				<h4 className='font-medium text-md mb-4'>Preferences</h4>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='tone_preference'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Tone Preference
							{userData.tone_preference}
						</label>
						<select
							id='tone_preference'
							name='tone_preference'
							value={userData.tone_preference}
							onChange={handleUserDataChange}
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						>
							<option value='casual'>Casual</option>
							<option value='formal'>Formal</option>
							<option value='friendly'>Friendly</option>
							<option value='professional'>Professional</option>
						</select>
					</div>
					<div>
						<label
							htmlFor='tech_familiarity'
							className='block text-sm font-medium text-foreground mb-1'
						>
							Tech Familiarity
						</label>
						<select
							id='tech_familiarity'
							name='tech_familiarity'
							value={userData.tech_familiarity}
							onChange={handleUserDataChange}
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						>
							<option value='novice'>Novice</option>
							<option value='moderate'>Moderate</option>
							<option value='advanced'>Advanced</option>
							<option value='expert'>Expert</option>
						</select>
					</div>
				</div>
			</div>

			<div className='space-y-5 bg-card p-6 rounded-lg border border-border'>
				<h4 className='font-medium text-md mb-4'>Family Information</h4>
				<div>
					<label
						htmlFor='parent_type'
						className='block text-sm font-medium text-foreground mb-1'
					>
						Parent Type
					</label>
					<select
						id='parent_type'
						name='parent_type'
						value={userData.parent_type}
						onChange={handleUserDataChange}
						className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
					>
						<option value=''>Not a parent</option>
						<option value='mom'>Mom</option>
						<option value='dad'>Dad</option>
						<option value='guardian'>Guardian</option>
					</select>
				</div>

				{userData.parent_type && (
					<div>
						<label
							htmlFor='time_with_kids'
							className='flex items-center text-sm font-medium text-foreground mb-1'
						>
							<FiClock className='mr-2' /> Hours spent with kids daily
						</label>
						<select
							id='time_with_kids'
							name='time_with_kids'
							value={userData.time_with_kids}
							onChange={handleUserDataChange}
							className='mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
						>
							{[...Array(24).keys()].map((hour) => (
								<option
									key={hour}
									value={hour}
								>
									{hour} {hour === 1 ? 'hour' : 'hours'}
								</option>
							))}
						</select>
					</div>
				)}

				{userData.parent_type && (
					<div className='space-y-4 mt-4'>
						<div className='flex items-center justify-between'>
							<h4 className='text-sm font-medium text-foreground'>Children Information</h4>
							<button
								type='button'
								onClick={handleAddChild}
								className='text-sm text-primary hover:bg-primary/10 px-3 py-1 rounded-md flex items-center transition-colors'
							>
								<FiPlus className='mr-1' /> Add Child
							</button>
						</div>

						{userData.children.length === 0 && (
							<div className='text-center py-6 text-muted-foreground text-sm bg-muted/50 rounded-md'>
								No children added yet. Click "Add Child" to get started.
							</div>
						)}

						{userData.children.map((child, index) => (
							<div
								key={index}
								className='p-4 bg-muted rounded-md border border-border'
							>
								<div className='flex justify-between items-center mb-3'>
									<h5 className='text-sm font-medium text-foreground'>Child #{index + 1}</h5>
									<button
										type='button'
										onClick={() => removeChild(index)}
										className='text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded-md flex items-center transition-colors'
									>
										<FiTrash2 className='mr-1' /> Remove
									</button>
								</div>
								<div className='grid grid-cols-2 gap-3'>
									<div>
										<label className='block text-xs text-muted-foreground mb-1'>Name</label>
										<input
											type='text'
											value={child.name}
											onChange={(e) => handleChildChange(index, 'name', e.target.value)}
											className='mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
										/>
									</div>
									<div>
										<label className='block text-xs text-muted-foreground mb-1'>Age</label>
										<input
											type='number'
											min='0'
											max='30'
											value={child.age}
											onChange={(e) => handleChildChange(index, 'age', e.target.value)}
											className='mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
										/>
									</div>
									<div>
										<label className='block text-xs text-muted-foreground mb-1'>Gender</label>
										<select
											value={child.gender}
											onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
											className='mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
										>
											<option value=''>Select</option>
											<option value='male'>Male</option>
											<option value='female'>Female</option>
											<option value='other'>Other</option>
										</select>
									</div>
									<div className='col-span-2'>
										<label className='block text-xs text-muted-foreground mb-1'>Description</label>
										<textarea
											value={child.description}
											onChange={(e) => handleChildChange(index, 'description', e.target.value)}
											rows='2'
											className='mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground focus:ring-2 focus:ring-primary focus:border-primary'
											placeholder='Interests, personality, etc.'
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className='mt-6 flex justify-end'>
				<button
					type='submit'
					disabled={saveUserDataMutation.isPending}
					className='px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
				>
					<FiSave className='mr-2' />
					{saveUserDataMutation.isPending ? 'Saving...' : 'Save Settings'}
				</button>
			</div>
		</form>
	);
}
