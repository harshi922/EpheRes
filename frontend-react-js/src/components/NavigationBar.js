// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { Home, Users, Grid, Activity, Plus } from 'lucide-react';

// const NavigationBar = ({ onAddExpenseClick }) => {
//   const location = useLocation();
  
//   const navItems = [
//     { id: 'home', label: 'Home', icon: Home, path: '/' },
//     { id: 'friends', label: 'Friends', icon: Users, path: '/friends' },
//     { id: 'groups', label: 'Groups', icon: Grid, path: '/groups' },
//     { id: 'activity', label: 'Activity', icon: Activity, path: '/activity' }
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
//       <div className="flex justify-around items-center h-16">
//         {navItems.map((item) => {
//           const Icon = item.icon;
//           // Check if current path matches this nav item
//           const isExactMatch = location.pathname === item.path;
//           // For the home item, also match if pathname is just '/'
//           const isActive = isExactMatch || (item.id === 'home' && location.pathname === '/');
          
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${
//                 isActive ? 'text-green-500' : 'text-gray-500'
//               }`}
//               end={item.id === 'home'} // Only exact matching for home route
//             >
//               {({ isActive }) => (
//                 <>
//                   <Icon size={24} className={isActive ? 'text-green-500' : 'text-gray-500'} />
//                   <span className="text-xs mt-1">{item.label}</span>
//                 </>
//               )}
//             </NavLink>
//           );
//         })}
        
//         <button
//           onClick={onAddExpenseClick}
//           className="flex flex-col items-center justify-center w-full h-full"
//           aria-label="Add expense"
//         >
//           <div className="bg-green-500 rounded-full p-2">
//             <Plus size={20} className="text-white" />
//           </div>
//           <span className="text-xs mt-1 text-gray-500">Add</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NavigationBar;

import React, { useState } from 'react';
import { Home, Users, Grid, Activity, User, LogOut, Plus } from 'lucide-react';

const NavigationBar = ({ onAddExpenseClick, activeTab = 'home' }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'friends', label: 'Friends', icon: Users, path: '/friends' },
    { id: 'groups', label: 'Groups', icon: Grid, path: '/groups' },
    { id: 'activity', label: 'Activity', icon: Activity, path: '/activity' }
  ];

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("amplify_auth_is_signed_in");
      window.location.href = "/signin";
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <a
                key={item.id}
                href={item.path}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                <Icon size={24} className={isActive ? 'text-green-500' : 'text-gray-500'} />
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            );
          })}
          
          {/* {onAddExpenseClick && (
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
          )}
          
          {!onAddExpenseClick && (
            <button
              onClick={toggleProfileMenu}
              className="flex flex-col items-center justify-center w-full h-full relative"
              aria-label="Profile"
            >
              <User size={24} className="text-gray-500" />
              <span className="text-xs mt-1 text-gray-500">Profile</span>
            </button>
          )} */}
          {onAddExpenseClick && (
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
              )}

              <button
                onClick={toggleProfileMenu}
                className="flex flex-col items-center justify-center w-full h-full relative"
                aria-label="Profile"
              >
                <User size={24} className="text-gray-500" />
                <span className="text-xs mt-1 text-gray-500">Profile</span>
              </button>

        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfileMenu && (
        <div className="fixed bottom-16 right-0 bg-white shadow-lg rounded-t-lg z-20 w-48 border border-gray-200">
          <div className="p-4">
            <a 
              href="/account" 
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowProfileMenu(false)}
            >
              <User size={18} className="mr-2" />
              <span>Account</span>
            </a>
            <button 
              onClick={handleSignOut}
              className="flex items-center p-2 hover:bg-gray-100 rounded-lg w-full text-left text-red-500"
            >
              <LogOut size={18} className="mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close the menu when clicking outside */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-25"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </>
  );
};

export default NavigationBar;