import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, Grid, Activity, Plus } from 'lucide-react';

const NavigationBar = ({ onAddExpenseClick }) => {
  const location = useLocation();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'friends', label: 'Friends', icon: Users, path: '/friends' },
    { id: 'groups', label: 'Groups', icon: Grid, path: '/groups' },
    { id: 'activity', label: 'Activity', icon: Activity, path: '/activity' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Check if current path matches this nav item
          const isExactMatch = location.pathname === item.path;
          // For the home item, also match if pathname is just '/'
          const isActive = isExactMatch || (item.id === 'home' && location.pathname === '/');
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-green-500' : 'text-gray-500'
              }`}
              end={item.id === 'home'} // Only exact matching for home route
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} className={isActive ? 'text-green-500' : 'text-gray-500'} />
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
        
        <button
          onClick={onAddExpenseClick}
          className="flex flex-col items-center justify-center w-full h-full"
          aria-label="Add expense"
        >
          <div className="bg-green-500 rounded-full p-2">
            <Plus size={20} className="text-white" />
          </div>
          <span className="text-xs mt-1 text-gray-500">Add</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;