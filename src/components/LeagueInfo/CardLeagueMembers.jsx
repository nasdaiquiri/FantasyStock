import { Avatar, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import '../../css/cardLeagueMembers.css';

function CardLeagueMembers({ leagueInfo }) {
  CardLeagueMembers.propTypes = {
    leagueInfo: PropTypes.string.isRequired
  };

  return (
    <Typography>
      {leagueInfo?.users?.map((user) => (
        <ul className='cardLeagueMembers'>
          <li className='cardLeagueMembers_li'>
            <Avatar
              className='cardLeagueMembers_avatar'
              src={`${user.league_user.team_logo}`}
              sizes='small'
              alt='team logo'
            />
            <p className='cardLeagueMembers_team'>{user.league_user.team_name}</p>
            <p>{user?.username}</p>
          </li>
        </ul>
      ))}
    </Typography>
  );
}

export default CardLeagueMembers;
