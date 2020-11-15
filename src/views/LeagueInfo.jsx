import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, CardContent } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { selectLeague } from '../features/leagueSlice.js';
import '../css/LeagueInfo.css';
import CardLeagueMembers from '../components/LeagueInfo/CardLeagueMembers.jsx';
import AccordionComp from '../components/AccordionComp.jsx';

function LeagueInfo() {
  const league = useSelector(selectLeague);
  const [leagueInfo, setLeagueInfo] = useState([]);
  const [owner, setOwner] = useState({});

  useEffect(() => {
    axios.get(`league/oneleague/${league}`)
      .then((response) => setLeagueInfo(response.data));
  }, [league]);

  useEffect(() => {
    axios.get(`/user/user/${leagueInfo?.id_owner}`)
      .then((response) => setOwner(response.data));
  }, [leagueInfo]);

  const Component = () => (
    <CardLeagueMembers
      leagueInfo={leagueInfo}
    />
  );

  return (
    <div className='leagueInfo'>
      {league
        ? (
          <Card>
            <CardContent>
              <div className='leagueInfo_info'>
                <p>
                  League Name
                </p>
                <h3 className='leagueInfo_header'>{leagueInfo.league_name}</h3>
                <p className='leagueInfo_leagueOwner_title'>
                  League Owner
                </p>
                <h5 className='leagueInfo_header'>{owner?.username}</h5>
              </div>
              <AccordionComp Component={Component} title='League Members' />
            </CardContent>
            <CardContent>
              
            </CardContent>
          </Card>

        )
        : (
          <Link key='home' to='/'>
            <h3 className='leagueInfo_selectLeague'>Please select a League</h3>
          </Link>
        )}
    </div>
  );
}

export default LeagueInfo;
