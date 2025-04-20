import React, { useState } from 'react';
import { Home, Users, UserCircle, Activity, Plus } from 'lucide-react';

const NavigationBar = ({ activePage, onNavigate, onAddExpenseClick }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  // Add button menu options
  const addOptions = [
    { label: 'Expense', action: onAddExpenseClick },
    { label: 'Group', action: () => onNavigate('groups-new') }
  ];
  
  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'friends', label: 'Friends', icon: UserCircle },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      {/* Main Navigation */}
      <div className="flex justify-around items-center h-16">
        {navItems.slice(0, 2).map(item => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activePage === item.id ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        
        {/* Add Button */}
        <div className="relative w-full flex justify-center">
          <button 
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="absolute -top-5 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
          
          {/* Add Menu (appears when add button is clicked) */}
          {showAddMenu && (
            <div className="absolute bottom-16 bg-white rounded-lg shadow-lg p-2 border">
              {addOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    setShowAddMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {navItems.slice(2, 4).map(item => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activePage === item.id ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* Overlay to close add menu when clicking outside */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 bg-transparent z-10" 
          onClick={() => setShowAddMenu(false)}
        />
      )}
    </div>
  );
};

export default NavigationBar;