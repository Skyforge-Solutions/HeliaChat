import { useState } from 'react';
import { FiClock } from 'react-icons/fi';

export default function UserSettingsForm({ onClose, initialData }) {
  const [userData, setUserData] = useState(initialData);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleAddChild = () => {
    setUserData({
      ...userData,
      children: [
        ...userData.children,
        { name: '', age: '', gender: '', description: '' }
      ]
    });
  };
  
  const handleChildChange = (index, field, value) => {
    const updatedChildren = [...userData.children];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value
    };
    
    setUserData({
      ...userData,
      children: updatedChildren
    });
  };
  
  const removeChild = (index) => {
    setUserData({
      ...userData,
      children: userData.children.filter((_, i) => i !== index)
    });
  };
  
  const saveUserData = (e) => {
    e.preventDefault();
    // Save to localStorage for persistence
    localStorage.setItem('heliaUserData', JSON.stringify(userData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-light dark:text-text-dark">Personal Settings</h3>
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={onClose}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form onSubmit={saveUserData}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age"
                  min="1"
                  max="100"
                  value={userData.age}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Occupation</label>
                <input 
                  type="text" 
                  id="occupation" 
                  name="occupation"
                  value={userData.occupation}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="tone_preference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tone Preference</label>
                <select 
                  id="tone_preference" 
                  name="tone_preference"
                  value={userData.tone_preference}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tech_familiarity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tech Familiarity</label>
                <select 
                  id="tech_familiarity" 
                  name="tech_familiarity"
                  value={userData.tech_familiarity}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                >
                  <option value="novice">Novice</option>
                  <option value="moderate">Moderate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="parent_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Type</label>
                <select 
                  id="parent_type" 
                  name="parent_type"
                  value={userData.parent_type}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                >
                  <option value="">Not a parent</option>
                  <option value="mom">Mom</option>
                  <option value="dad">Dad</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>
              
              {/* Time with kids section */}
              {userData.parent_type && (
                <div>
                  <label htmlFor="time_with_kids" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FiClock className="mr-2" /> Hours spent with kids daily
                  </label>
                  <select 
                    id="time_with_kids" 
                    name="time_with_kids"
                    value={userData.time_with_kids}
                    onChange={handleUserDataChange}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white"
                  >
                    {[...Array(24).keys()].map(hour => (
                      <option key={hour} value={hour}>
                        {hour} {hour === 1 ? 'hour' : 'hours'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Children section */}
              {userData.parent_type && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Children Information</h4>
                    <button 
                      type="button" 
                      onClick={handleAddChild}
                      className="text-sm text-primary-light dark:text-primary-dark hover:underline"
                    >
                      + Add Child
                    </button>
                  </div>
                  
                  {userData.children.map((child, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Child #{index + 1}</h5>
                        <button 
                          type="button"
                          onClick={() => removeChild(index)}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400">Name</label>
                          <input 
                            type="text"
                            value={child.name}
                            onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400">Age</label>
                          <input 
                            type="number"
                            min="0"
                            max="30"
                            value={child.age}
                            onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400">Gender</label>
                          <select
                            value={child.gender}
                            onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 dark:text-gray-400">Description</label>
                          <textarea
                            value={child.description}
                            onChange={(e) => handleChildChange(index, 'description', e.target.value)}
                            rows="2"
                            className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white"
                            placeholder="Interests, personality, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md text-black bg-primary-light dark:bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}