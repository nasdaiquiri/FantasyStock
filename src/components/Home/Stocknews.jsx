import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockList from './StockList.jsx';

const todayDate = new Date().toISOString().split('T')[0];

function Stocknews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/news',
      params: { todayDate }
    })
      .then((response) => setArticles(response.data.articles))
      .catch((err) => console.warning(err));
  }, []);

  return (
    <div style={{ marginTop: '50px' }}>
      <h1>Stock News:</h1>
      {articles && articles.map((article) => <StockList article={article} />)}
    </div>
  );
}

export default Stocknews;
