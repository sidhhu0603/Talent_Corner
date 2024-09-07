import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css';

const CACHE_DURATION = 60 * 5 * 1000; // Cache duration of 5 minutes

const Dashboard = ({ sidebarOpen }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25;
  const [searchTerm, setSearchTerm] = useState('');
  const [isBooleanSearch, setIsBooleanSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cacheKey = (page, search, booleanSearch) =>
    `dashboard_data_${page}_${search}_${booleanSearch}`;

  const isCacheValid = (cachedData) => {
    if (!cachedData || !cachedData.timestamp) return false;
    const currentTime = new Date().getTime();
    return currentTime - cachedData.timestamp < CACHE_DURATION;
  };

  const fetchData = async (page, search = '', booleanSearch = false) => {
    const offset = (page - 1) * recordsPerPage;
    setIsLoading(true);

    // Check local storage for cached data
    const cacheData = JSON.parse(localStorage.getItem(cacheKey(page, search, booleanSearch)));
    
    if (cacheData && isCacheValid(cacheData)) {
      // If cache is valid, use the cached data
      setData(cacheData.data);
      setFilteredData(cacheData.data);
      setIsLoading(false);
      return;
    }

    // If no valid cache, fetch from API
    try {
      const response = await axios.get(`https://talent-corner-b7v4.onrender.com/api/details`, {
        params: {
          offset,
          limit: recordsPerPage,
          search,
          booleanSearch
        }
      });
      setData(response.data);
      setFilteredData(response.data);

      // Cache the fetched data along with a timestamp
      localStorage.setItem(
        cacheKey(page, search, booleanSearch),
        JSON.stringify({ data: response.data, timestamp: new Date().getTime() })
      );
    } catch (error) {
      setError(error);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm, isBooleanSearch);
  }, [currentPage, isBooleanSearch]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCurrentPage(1); // Reset to the first page
      fetchData(1, '', isBooleanSearch);
    }
  }, [searchTerm, isBooleanSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page for new search
    fetchData(1, searchTerm, isBooleanSearch); // Fetch data for the new search term
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const toggleBooleanSearch = () => {
    setIsBooleanSearch(!isBooleanSearch);
  };

  const handleProfileClick = (contactNo) => {
    navigate(`/profiles/${contactNo}`);
  };

  return (
    <div className={sidebarOpen ? "page-content" : "page-content shifted"}>
      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, number, role, experience, location..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <i className="bi bi-search search-icon" onClick={handleSearch}></i>
        <div className="toggle-container">
          <span className="toggle-label">Boolean Search</span>
          <label className="switch">
            <input type="checkbox" checked={isBooleanSearch} onChange={toggleBooleanSearch} />
            <span className="slider"></span>
          </label>
          <span className="toggle-text">{isBooleanSearch ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="error">Error: {error.message}</div>
      ) : (
        <>
          <div className="table-container">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Experience</th>
                  <th scope="col">Location</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <i
                        className="bi bi-person-circle"
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                        onClick={() => handleProfileClick(row.contact_no)}
                      ></i>
                      {row.Name_1}
                    </td>
                    <td>{row.Role}</td>
                    <td>{row.years_of_experience}</td>
                    <td>{row.current_location}</td>
                    <td className="action-cell">
                      <a href={`https://wa.me/${row.contact_no}?text=${encodeURIComponent("Please send your updated CV")}`} target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-whatsapp icon-purple-dark"></i>
                      </a>
                      <a href={`mailto:${row.email_id}`} target="_blank">
                        <i className="bi bi-envelope icon-purple-dark"></i>
                      </a>
                      <a href={`tel:${row.contact_no}`}>
                        <i className="bi bi-telephone icon-purple-dark"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="button" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button className="button" onClick={handleNextPage}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
