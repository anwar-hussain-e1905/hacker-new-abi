import React from 'react'
import './SearchBar.css';
import debounce from 'lodash.debounce';

export default function SearchBar (props) {

  function onTypeAhead ({target}) {
    props.onTypeAhead(target.value);
  }

  return (
    <div className="searchbox">
      <label className="searchbox__label" htmlFor="search">Search Hacker News</label>
      <input className="searchbox__input" id="search" type="text" placeholder="Search..." onChange={debounce(onTypeAhead, 200)} />
    </div>
  )
}