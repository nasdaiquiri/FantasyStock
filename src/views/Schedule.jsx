import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-ui/core';
import { selectLeague } from '../features/leagueSlice.js';
import { setSchedule } from '../features/scheduleSlice.js';
import '../css/Schedule.css';

function Schedule() {
  const dispatch = useDispatch();

  const league = useSelector(selectLeague);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    axios.get(`/matchup/${league}`).then(({ data }) => {
      dispatch(setSchedule({ data }));
      setWeeks(Object.keys(
        data?.weeklyMatchups
      ).reduce(
        (acc, curr) => [...acc, { week: curr, games: data?.weeklyMatchups[curr] }], []
      ));
    })
      .catch((err) => console.warn(err));
  }, [league, dispatch]);

  return (
    (weeks.length === 0)
      ? (
        <div className='schedule'>
          <Link key='home' className='nav_link' to='/'>
            <h1>
              {'A schedule hasn\'t been set at the moment or pick a league'}
              {' '}
            </h1>
          </Link>
        </div>
      ) : (
        <div className='schedule'>
          <h3 className='schedule_title'>Schedule</h3>
          {
            weeks?.map(({ week, games }) => (
              <>
                <p>{week}</p>
                {
                  games.map(({ Away, Home }) => (
                    <div className='schedule_vs'>
                      <div>
                        <h3>Home</h3>
                        <p>
                          TEAM_NAME:
                          {Away.user.team_name}
                        </p>
                        <p>
                          TEAM_LOGO:
                          <Avatar src={`${Away.user.team_logo}`} sizes='small' alt='team logo' />
                        </p>
                      </div>
                      <div>
                        <h3>Away</h3>
                        <p>
                          TEAM_NAME:
                          {Home.user.team_name}
                        </p>
                        <p>
                          TEAM_LOGO:
                          <Avatar src={`${Home.user.team_logo}`} sizes='medium' alt='team logo' />
                        </p>
                      </div>

                    </div>
                  ))
                }
              </>
            ))
          }
        </div>
      )
  );
}

export default Schedule;
