import './ExpenseFilter.css';
import React from 'react';

export default function ExpenseFilter(props) {
  const [category, setCategory] = React.useState(props.criteria.category || '');
  const [dateRange, setDateRange] = React.useState(props.criteria.dateRange || 'all');
  const [searchTerm, setSearchTerm] = React.useState(props.criteria.searchTerm || '');
  
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onFilterChange({
      category,
      dateRange,
      searchTerm
    });
  };
  
  const handleReset = () => {
    setCategory('');
    setDateRange('all');
    setSearchTerm('');
    props.onFilterChange({
      category: '',
      dateRange: 'all',
      searchTerm: ''
    });
  };

  return (
    <div className='expense_filter'>
      <h3>Filter Expenses</h3>
      <form onSubmit={handleSubmit}>
        <div className='filter_row'>
          <div className='filter_field'>
            <label>Category</label>
            <select value={category} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              <option value="food">Food & Drink</option>
              <option value="transportation">Transportation</option>
              <option value="housing">Housing</option>
              <option value="entertainment">Entertainment</option>
              <option value="utilities">Utilities</option>
              <option value="shopping">Shopping</option>
              <option value="healthcare">Healthcare</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className='filter_field'>
            <label>Date Range</label>
            <select value={dateRange} onChange={handleDateRangeChange}>
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        
        <div className='filter_row'>
          <div className='filter_field search_field'>
            <label>Search</label>
            <input 
              type="text" 
              placeholder="Search by description, amount, or person" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className='filter_actions'>
          <button type="submit" className='apply_filter'>Apply Filters</button>
          <button type="button" className='reset_filter' onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
}