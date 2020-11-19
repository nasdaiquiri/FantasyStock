import { Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import '../../css/cardLeagueMembers.css';

function CardLeagueMembers({ leagueInfo }) {
  CardLeagueMembers.propTypes = {
    leagueInfo: PropTypes.string.isRequired
  };

  return (
    <div className='cardLeagueMembers_container'>
      {leagueInfo?.users?.map((user) => (
        <ul className='cardLeagueMembers'>
          <li className='cardLeagueMembers_li'>
            <Avatar
              className='cardLeagueMembers_avatar'
              src={`${user.league_user.team_logo}`}
              sizes='small'
              alt='team logo'
            />
            <div className='cardLeagueMembers_info'>
              <p className='cardLeagueMembers_team'>
                {user.league_user.team_name === null ? (
                  <p className='cardLeagueMember_noTeam'>no team name</p>
                ) : (
                  user.league_user.team_name
                )}
              </p>
              <p className='cardLeagueMembers_username'>{user?.username}</p>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default CardLeagueMembers;
