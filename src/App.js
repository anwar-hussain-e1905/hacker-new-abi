import React, { useState } from 'react'
import './App.css';
import SearchBar from './components/SearchBar';
import ResultContainer from './components/ResultContainer';
import searchQuery from './services/searchQuery';
const searchAPI = new searchQuery();
export const SearchTermContext = React.createContext('');

function App() {
  const [searchInfo, setSearchInfo] = useState({
    loading: false,
    results: [],
    searchTerm: ''
  })

  function onTypeAhead (searchTerm) {
    if (!searchTerm) {
      setSearchInfo({
        results: [],
        searchTerm
      })
      return;
    }
    setSearchInfo({
      ...searchInfo,
      loading: true
    });
    searchAPI.getResults(searchTerm).then(results => {
      setSearchInfo({
        loading: false,
        results,
        searchTerm
      })
    }).catch(err => {
      console.log('error', err);
    });
  }

  return (
    <SearchTermContext.Provider value={searchInfo.searchTerm}>
      <div className="search__container">
        <SearchBar onTypeAhead={onTypeAhead} />
        <ResultContainer isLoading={searchInfo.loading} results={searchInfo.results}/>
      </div>
    </SearchTermContext.Provider>
  );
}

export default App;
