/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar } from '@material-ui/core/';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BasicTable from '../components/YourStocks/StocksTable.jsx';
import '../css/YourStocks.css';
import CardStats from '../components/YourStocks/CardStats.jsx';
import { selectYourStock, setYourStock } from '../features/yourStockSlice.js';
import { selectUser } from '../features/userSlice.js';
import { selectLeague } from '../features/leagueSlice.js';

function YourStocks() {
  const rows = useSelector(selectYourStock);
  const [bankBalance, setBankBalance] = useState({});
  const user = useSelector(selectUser);
  const league = useSelector(selectLeague);
  const [leagueUser, setLeagueUser] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`/stock/portfolio/${user.id}`)
      .then((response) => response.data.filter((info) => info.id_league === league))
      .then((data) => dispatch(setYourStock(data)))
      .catch((err) => console.warn(err));
  }, [dispatch, user]);

  useEffect(() => {
    axios
      .get(`/stock/bank/${user.id}/${league}`)
      .then((response) => setBankBalance(response.data.bank_balance))
      .catch((err) => console.warn(err));
  }, [user?.id]);

  useEffect(() => {
    axios
      .get(`/user/team/${league}/${user?.id}`)
      .then((response) => setLeagueUser(response.data))
      .catch((err) => console.warn(err));
  }, [user?.id]);

  return league === null ? (
    <div className='schedule'>
      <Link key='home' to='/'>
        <h1 className='leagueInfo_selectLeague'>First Select a League</h1>
      </Link>
    </div>
  ) : (
    <div className='yourStocks'>
      <div className='yourStocks_container'>
        <div className='yourStocks_teamInfo'>
          <h2>{leagueUser?.team_name}</h2>
          <Avatar
            className='yourStocks_logo'
            alt='logo'
            src={leagueUser?.team_logo}
          />
        </div>
        <div className='YourStocks_card'>
          <Link key='waivers' className='nav_link' to='/waivers'>
            <p className='yourStocks_waiversLink'>Go to Waivers</p>
          </Link>
          <CardStats bankBalance={bankBalance} rows={rows} />
        </div>
        <a href='https://iexcloud.io' rel='noreferrer' target='_blank'>
          Data provided by IEX Cloud
        </a>
        <BasicTable
          rows={rows}
          user={user}
          bankBalance={bankBalance}
          setBankBalance={setBankBalance}
          className='yourStocks_table'
        />
      </div>
    </div>
  );
}

export default YourStocks;
