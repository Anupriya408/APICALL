import React, { useState } from 'react';
import axios from 'axios';

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let debounceTimer;
  return function (...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const RealTimeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to call API and set results
  const fetchSearchResults = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      const filteredResults = response.data.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Debounced search function
  const handleSearch = debounce((value) => {
    if (value) {
      fetchSearchResults(value);
    } else {
      setResults([]);
    }
  }, 500); 

  // Handle input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    handleSearch(value); 
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Real-time Search with debouncing and Promises.</h2>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users by name here..."
        style={{ padding: '10px', width: '100%', fontSize: '16px' }}
      />
      {loading && <p>Loading...</p>}
      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
        {results.length > 0 ? (
          results.map((user) => (
            <li key={user.id} style={{ padding: '8px 0', borderBottom: '1px solid black' }}>
              {user.name} ({user.email})
            </li>
          ))
        ) : (
          query && !loading && <li>No results found here</li>
        )}
      </ul>
    </div>
  );
};

export default RealTimeSearch;