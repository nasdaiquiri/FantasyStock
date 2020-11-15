import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectLeague } from '../features/leagueSlice.js';
import { setSchedule } from '../features/scheduleSlice.js';
import '../css/Schedule.css';
import AccordionTwo from '../components/AccordionTwo.jsx';

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
          <Link key='home' className='nav_redirect' to='/'>
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
              <div className='schedule_week'>
                <AccordionTwo title={week} games={games} />
              </div>
            ))
          }
        </div>
      )
  );
}

export default Schedule;
