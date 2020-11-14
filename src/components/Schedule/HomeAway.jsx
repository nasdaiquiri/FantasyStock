import React from 'react';
import propTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import '../../css/HomeAway.css';

function HomeAway({ games }) {
  HomeAway.propTypes = {
    games: propTypes.string.isRequired
  };

  return (
    <div>
      {
        games.map(({ Away, Home }) => (
          <div className='schedule_vs'>
            <div>
              <h3 className='homeAway_title'>Home</h3>
              <Avatar
                className='homeAway_avatar'
                src={`${Away.user.team_logo}`}
                sizes='small'
                alt='team logo'
              />
              <p className='HomeAway_teamName'>
                {Away.user.team_name}
              </p>
            </div>
            <div className='homeAway_vs'>
              VS
            </div>
            <div>
              <h3 className='homeAway_title'>Away</h3>
              <Avatar
                className='homeAway_avatar'
                src={`${Home.user.team_logo}`}
                sizes='medium'
                alt='team logo'
              />
              <p className='HomeAway_teamName'>
                {Home.user.team_name}
              </p>
            </div>

          </div>
        ))
      }
    </div>
  );
}

export default HomeAway;
