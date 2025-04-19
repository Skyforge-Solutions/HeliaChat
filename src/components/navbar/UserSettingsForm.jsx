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
      <div className="bg-background rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-foreground">Personal Settings</h3>
            <button 
              type="button" 
              className="text-muted-foreground hover:text-foreground"
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
                <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={userData.name}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-foreground">Age</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age"
                  min="1"
                  max="100"
                  value={userData.age}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                />
              </div>
              
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-foreground">Occupation</label>
                <input 
                  type="text" 
                  id="occupation" 
                  name="occupation"
                  value={userData.occupation}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                />
              </div>
              
              <div>
                <label htmlFor="tone_preference" className="block text-sm font-medium text-foreground">Tone Preference</label>
                <select 
                  id="tone_preference" 
                  name="tone_preference"
                  value={userData.tone_preference}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="tech_familiarity" className="block text-sm font-medium text-foreground">Tech Familiarity</label>
                <select 
                  id="tech_familiarity" 
                  name="tech_familiarity"
                  value={userData.tech_familiarity}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
                >
                  <option value="novice">Novice</option>
                  <option value="moderate">Moderate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="parent_type" className="block text-sm font-medium text-foreground">Parent Type</label>
                <select 
                  id="parent_type" 
                  name="parent_type"
                  value={userData.parent_type}
                  onChange={handleUserDataChange}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
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
                  <label htmlFor="time_with_kids" className="flex items-center text-sm font-medium text-foreground">
                    <FiClock className="mr-2" /> Hours spent with kids daily
                  </label>
                  <select 
                    id="time_with_kids" 
                    name="time_with_kids"
                    value={userData.time_with_kids}
                    onChange={handleUserDataChange}
                    className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground"
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
                    <h4 className="text-sm font-medium text-foreground">Children Information</h4>
                    <button 
                      type="button" 
                      onClick={handleAddChild}
                      className="text-sm text-primary hover:underline"
                    >
                      + Add Child
                    </button>
                  </div>
                  
                  {userData.children.map((child, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium text-foreground">Child #{index + 1}</h5>
                        <button 
                          type="button"
                          onClick={() => removeChild(index)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-muted-foreground">Name</label>
                          <input 
                            type="text"
                            value={child.name}
                            onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground">Age</label>
                          <input 
                            type="number"
                            min="0"
                            max="30"
                            value={child.age}
                            onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground">Gender</label>
                          <select
                            value={child.gender}
                            onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                            className="mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-muted-foreground">Description</label>
                          <textarea
                            value={child.description}
                            onChange={(e) => handleChildChange(index, 'description', e.target.value)}
                            rows="2"
                            className="mt-1 block w-full px-2 py-1 bg-background border border-input rounded-md text-xs text-foreground"
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
                className="px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-background hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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