import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import WaiversTable from '../components/Waivers/WaiversTable.jsx';
import LoadSpinner from '../components/Waivers/LoadSpinner.jsx';
import '../css/Waivers.css';
import { selectWaivers, setWaivers } from '../features/waiversSlice.js';
import { selectUser } from '../features/userSlice.js';
import { selectLeague } from '../features/leagueSlice.js';

function Waivers() {
  const user = useSelector(selectUser);
  const rows = useSelector(selectWaivers);
  const [search, setSearch] = useState('');
  const [bankBalance, setBankBalance] = useState();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const league = useSelector(selectLeague);

  useEffect(() => {
    axios.get(`/stock/waivers/${league}`)
      .then((response) => dispatch(setWaivers(response.data)))
      .then(() => setLoading(false))
      .catch((err) => console.warn(err));
  }, [dispatch, league, user.leagueInfo]);

  useEffect(() => {
    axios.get(`/stock/bank/${user.id}/${league}`)
      .then((response) => setBankBalance(response.data.bank_balance))
      .catch((err) => console.warn(err));
  }, [league, user.id]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    (league === null)
      ? (
        <div className='schedule'>
          <Link key='home' to='/'>
            <h1 className='leagueInfo_selectLeague'>
              First Select a League
            </h1>
          </Link>
        </div>
      ) : (
        <div className='waivers'>
          <div className='waivers_bank-balance'>
            <h2>Bank Balance</h2>
            <h3 className='waivers_bank-amount'>
              $
              {(bankBalance * 0.01).toFixed(2)}
            </h3>
          </div>

          <div className='waivers_search'>
            <TextField
              style={{ backgroundColor: 'white' }}
              freesolo='true'
              type='search'
              label='Search Stock'
              margin='normal'
              variant='outlined'
              onChange={handleSearch}
              size='small'
            />
            <Link key='yourstocks' to='/yourstocks'>
              <p className='myWaivers_yourStocksLink'>Go to Your Stocks</p>
            </Link>
            <a href='https://iexcloud.io' rel='noreferrer' target='_blank'>Data provided by IEX Cloud</a>
          </div>
          {(loading) ? <LoadSpinner /> : (
            <WaiversTable
              rows={rows}
              search={search}
              user={user}
              bankBalance={bankBalance}
              setBankBalance={setBankBalance}
            />
          )}
        </div>
      )
  );
}

export default Waivers;
