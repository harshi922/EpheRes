import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';

const ExpenseFilter = ({ criteria, onFilterChange }) => {
  const [category, setCategory] = useState(criteria.category || '');
  const [dateRange, setDateRange] = useState(criteria.dateRange || 'all');
  const [searchTerm, setSearchTerm] = useState(criteria.searchTerm || '');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({
      category,
      dateRange,
      searchTerm
    });
  };
  
  const handleReset = () => {
    setCategory('');
    setDateRange('all');
    setSearchTerm('');
    onFilterChange({
      category: '',
      dateRange: 'all',
      searchTerm: ''
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          {/* Basic Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search expenses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <Filter size={18} />
            </button>
          </div>
          
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Tag size={16} className="mr-1" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Housing">Housing</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Filter Actions */}
          {showAdvancedFilters && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Apply Filters
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ExpenseFilter;