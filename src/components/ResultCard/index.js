import React from 'react'
import './ResultCard.css';
export default function ResultCard (props) {
  const {
    title,
    url,
    author,
    num_comments,
    ago,
    story_text
  } = props; 
  function createMarkup(text) { return {__html: text}; };
  return (
    <div className="result">
      <div className="result__title">
        <p className="result--nowrap" dangerouslySetInnerHTML={ createMarkup(title) }></p>
        { url ?
          <a className="result__url result--nowrap" href={url} rel="noreferrer" target="_blank">({ url })</a> : ''
        }
      </div>
      <div className="result__info result--small">
        Author : { author } | Created : {ago} | Comments : { num_comments }
      </div>
      {
        story_text ? 
          <div className="result__desc result--small" dangerouslySetInnerHTML={ createMarkup(story_text) }></div> 
          : 
        ''
      }
    </div>
  )
}