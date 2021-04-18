import axios, { CancelToken } from 'axios';
const queryURL = 'https://hn.algolia.com/api/v1/search?query=';
const maximumCache = 20;

export default function searchQuery () {
  let cancel;
  const resultsCache = { cache: {}, query : []};
  const timeAgoStamp = [60 * 60 * 24 * 30 * 12, 60 * 60 * 24 * 30, 60 * 60 * 24, 60 * 60, 60];
  const timeAgoLable = ['year', 'month', 'day', 'second'];

  function getSortedResults(data, key) {
    return data.sort((a, b) => {
      if (!a[key]) a[key] = 0;
      if (!b[key]) b[key] = 0;
      return b[key] - a[key]
    });
  }

  function getTimeAgo (created_at, diff, i = 0) {
    if (i > timeAgoStamp.length) return '';
    diff = !diff ? Math.floor((new Date() - new Date(created_at)) / 1000) : diff;
    const diffCheck = diff / timeAgoStamp[i];
    if (diffCheck > 1) {
      return `${Math.floor(diffCheck)} ${timeAgoLable[i] + (Math.floor(diffCheck) > 1 ? 's' : '')} ago`;
    } else {
      return getTimeAgo(new Date('2021-01-21T03:30:17.000Z'), diff, i + 1);
    }
  }

  function highlightQuery (txt, querys) {
    if (!txt) return '';
    querys.split(' ').forEach(query => {
      if (txt.includes(query)) {
        txt = txt.replaceAll(query, `<mark>${query}</mark>`);
      }
    });
    return txt;
  }

  this.getResults = function (query) {
    var pr = new Promise((resolve, reject) => {
      query = query.toLowerCase().trim();
      if (cancel) cancel();
      if (resultsCache.cache[query]) {
        resolve(resultsCache.cache[query]);
      } else {
        axios.get(queryURL + query, {
          cancelToken: new CancelToken(function (c) {
            cancel = c;
          })
        })
        .then(function (response) {
          var data = response.data.hits.filter(x => x.title);
          var results = getSortedResults(data, 'relevancy_score').slice(0, 10);
          results = results.map(x => {
            const {
              objectID,
              url,
              author,
              num_comments
            } = x;
            return {
              objectID,
              title : highlightQuery(x.title, query),
              story_text : highlightQuery(x.story_text, query),
              url,
              author,
              num_comments,
              ago : getTimeAgo(x.created_at),
            }
          })
          resultsCache.cache[query] = results;
          if (resultsCache.query.length === maximumCache) {
            var firstIn = resultsCache.query.shift();
            delete resultsCache[firstIn];
          }
          resultsCache.query.push(query);
          resolve(results)
        })
        .catch(function (error) {
          reject(error);
        })
      }
    });
    return pr;
  }
}