import React, { useContext } from 'react'
import './ResultContainer.css';
import ResultCard from '../ResultCard';
import { SearchTermContext } from '../../App'

export default function ResultContainer (props) {
  const { isLoading, results } = props;
  const searchTerm = useContext(SearchTermContext);

  return (
    <div className="results__container">
      { 
        isLoading ? <div className="results__loading"></div> : ''
      }
      { 
        searchTerm && results.length > 1 ?
          results.map(data => 
            <ResultCard key={data.objectID} {...data}/>
          ) : searchTerm ? 'No Results Found' : ''
      }
    </div>
  )
}