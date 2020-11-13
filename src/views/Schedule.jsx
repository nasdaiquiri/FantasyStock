import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectLeague } from '../features/leagueSlice.js';
import {
  selectWeeks, setSchedule, setWeeks
} from '../features/scheduleSlice.js';
import '../css/Schedule.css';

function Schedule() {
  const dispatch = useDispatch();

  const league = useSelector(selectLeague);
  const weeks = useSelector(selectWeeks);

  useEffect(() => {
    axios.get(`/matchup/${league}`).then(({ data }) => {
      dispatch(setSchedule({ data }));
      dispatch(setWeeks(Object.keys(
        data?.weeklyMatchups
      ).reduce(
        (acc, curr) => [...acc, { week: curr, games: data?.weeklyMatchups[curr] }], []
      )));
    });
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
                    <>
                      <p>{`Home: ${Home.teamID}`}</p>
                      <p>
                        TEAM_NAME:
                        {Away.user.id_user}
                      </p>
                      <p>{`Away: ${Away.teamID}`}</p>
                      <p>
                        TEAM_NAME:
                        {Home.user.id_user}
                      </p>
                    </>
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
