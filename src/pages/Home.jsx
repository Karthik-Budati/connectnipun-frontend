

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo.png';
import default1 from '../assets/default1.jpg';
import default2 from '../assets/default2.jpg';
import default3 from '../assets/default3.jpg';

const defaultImages = [default1, default2, default3];
const bannerQuotes = [
  'Empowering India, One Skill at a Time.',
  'Skilled Hands Build a Stronger Nation.',
  'Your Local Worker is Just a Click Away.'
];

function Home() {
  const [workers, setWorkers] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searched, setSearched] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterSuggestions, setFilterSuggestions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const workersPerPage = 3;

   useEffect(() => {
    fetch('https://connectnipun-backend.onrender.com/api/workers')
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        console.log('Fetched data:', data);
        setWorkers(sortedData);
        const uniqueMandals = [...new Set(data.map(w => w.mandal))].map(m => ({ value: m, type: 'mandal' }));
        const uniqueVillages = [...new Set(data.map(w => w.village))].map(v => ({ value: v, type: 'village' }));
        const combinedOptions = [...uniqueMandals, ...uniqueVillages].sort((a, b) => a.value.localeCompare(b.value));
        setFilterOptions(combinedOptions);
        {console.log("State data from workers:", workers)}
      })
      .catch((err) => console.error('Error fetching workers:', err));
  }, []);
//   useEffect(() => {
//   const getData = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/workers");
//       const data = await res.json();
//       setWorkers(data);
//       console.log("Fetched data (inside async):", data); // ✅ This should print
//     } catch (err) {
//       console.error("Error fetching:", err);
//     }
//   };

//   getData();
// }, []);

   
//   useEffect(() => {
//   const fetchWorkers = async () => {
//     try {
//       const res = await fetch('https://connect-nipun.onrender.com/api/workers'); // 🔁 CHANGED HERE
//       const data = await res.json();
//       console.log('Fetched workers:', data);
//       setWorkers(data);
//     } catch (err) {
//       console.error('Error fetching workers:', err);
//     }
//   };

//   fetchWorkers();
// }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % defaultImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const match = workers.filter(
        (w) =>
          w.name.toLowerCase().includes(query.toLowerCase()) ||
          w.skill.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(match.map((w) => `${w.name} (${w.skill})`).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query, workers]);

  useEffect(() => {
    if (filterQuery.length > 0) {
      const match = filterOptions.filter(
        (opt) => opt.value.toLowerCase().includes(filterQuery.toLowerCase())
      );
      setFilterSuggestions(match.map(opt => `${opt.value} (${opt.type})`).slice(0, 5));
    } else {
      setFilterSuggestions([]);
    }
  }, [filterQuery, filterOptions]);

  const handleSearch = () => {
    if (!query.trim()) {
      setFilteredWorkers([]);
      setSearched(false);
      return;
    }

    let matches = workers.filter(
      (w) =>
        w.name.toLowerCase().includes(query.toLowerCase()) ||
        w.skill.toLowerCase().includes(query.toLowerCase())
    );

    if (selectedFilter && filterType) {
      matches = matches.filter(
        (w) => w[filterType].toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    matches.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredWorkers(matches);
    setSearched(true);
    setCurrentPage(1);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setQuery('');
    setFilterQuery('');
    setSelectedFilter('');
    setFilterType('');
    setFilteredWorkers([]);
    setSearched(false);
    setSuggestions([]);
    setFilterSuggestions([]);
    setCurrentPage(1);
    setCurrentImageIndex(0);
  };

  const handleSuggestionClick = (sug) => {
    const [_, skillWithParens] = sug.split(' (');
    const skill = skillWithParens.replace(')', '');
    setQuery(skill);
    setSuggestions([]);
    handleSearch();
  };

  const handleFilterSuggestionClick = (sug) => {
    const [value, type] = sug.split(' (');
    setSelectedFilter(value);
    setFilterType(type.replace(')', ''));
    setFilterQuery(value);
    setFilterSuggestions([]);
  };

  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      <div className="navbar">
        <div className="logo-section">
          <img src={logo} alt="Connect Nipun Logo" className="logo-img" />
          <span className="brand-name">Connect Nipun</span>
        </div>
        <div className="nav-buttons">
          <Link to="/register">
            <button className="btn">Login or Register</button>
          </Link>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by skill or name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
            />
            <button className="btn" onClick={handleSearch}>Search</button>
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((sug, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick(sug)}>{sug}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <marquee className="marquee">
        Skilled Workers to Your Doorstep — Connect Nipun
      </marquee>

      {!searched && (
        <div className="rotating-banner">
          <div className="banner-wrapper">
            <img
              src={defaultImages[currentImageIndex]}
              alt="Banner"
              className="banner-img"
            />
            <div className="banner-quote">
              <p>{bannerQuotes[currentImageIndex]}</p>
            </div>
          </div>
        </div>
      )}

      {searched && (
        <div className="filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Filter by Mandal or Village"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            {filterSuggestions.length > 0 && (
              <ul className="suggestions">
                {filterSuggestions.map((sug, idx) => (
                  <li key={idx} onClick={() => handleFilterSuggestionClick(sug)}>{sug}</li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handleSearch}>Apply Filter</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      )}

      {searched && filteredWorkers.length > 0 && (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Place</th>
                <th>Photo</th>
                <th>QR Code</th>
              </tr>
            </thead>
            <tbody>
              {currentWorkers.map((w, index) => (
                console.log("Work Images:", w.workImages),
                <tr key={w._id}>
                  <td>{indexOfFirstWorker + index + 1}</td>
                  <td>{w.name} ({w.skill})</td>
                  <td>{w.mobile}</td>
                  <td>{w.village}, {w.mandal}</td>
                  <td>
                      <img
                        src={w.image}
                        alt={`Profile of ${w.name}`}
                        width="80"
                        height="80"
                        style={{ borderRadius: "50%" }}
                      />

                  </td>
                  <td>
                  <img
                    src={w.qrUrl}
                    alt={`QR Code for ${w.name}`}
                    className="qr-code"
                    width="80"
                    height="80"
                    onError={(e) => { e.target.style.display = 'none'; }} // hides image if broken
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {searched && filteredWorkers.length === 0 && (
        <div className="no-results">
          <p>No workers found. Try adjusting your search or filters.</p>
        </div>
      )}
<footer className="footer">
        <p>© 2025 Connect Nipun. All rights reserved.</p>
        <p>Contact us: connect.helpdesk@gmail.com</p>
        <p>Made with 💙 for India’s workforce</p>
      </footer>
      
    </div>
      
  );
}

export default Home;