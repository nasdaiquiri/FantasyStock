import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { Avatar } from '@material-ui/core';
import axios from 'axios';
import { setLeague, setLeagueOwner } from '../../features/leagueSlice.js';
import '../../css/MatchupCard.css';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginBottom: '10px',
    margin: '10px',
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12
  },
  buttonPadding: {
    marginTop: '10px'
  }
});
function MatchupCard({ userLeague, user }) {
  MatchupCard.propTypes = {
    userLeague: propTypes.string.isRequired,
    user: propTypes.string.isRequired
  };

  const dispatch = useDispatch();
  const classes = useStyles();
  const [userLeagueInfo, setUserLeagueInfo] = useState({});

  const clickLeagueUpdate = () => {
    dispatch(setLeague(userLeague.id));
    dispatch(setLeagueOwner(userLeague.id_owner));
  };

  useEffect(() => {
    axios
      .get(`/user/team/${userLeague?.id}/${user?.id}`)
      .then((response) => setUserLeagueInfo(response.data))
      .catch((err) => console.warn(err));
  }, [user.id, userLeague.id]);

  const bankBalanceTwoDecimal = (
    userLeague.league_user.bank_balance * 0.01
  ).toFixed(2);
  return (
    <Link key='leagueinfo' to='/yourstocks'>
      <Card
        className={classes.root}
        variant='outlined'
        onClick={clickLeagueUpdate}
      >
        <CardContent>
          <Typography className={classes.title} variant='h6' component='h2'>
            {userLeague?.league_name}
          </Typography>
          <Typography variant='body2'>
            {`Bank Balance: $ ${bankBalanceTwoDecimal}`}
          </Typography>
          <Typography variang='body2'>
            <p className='matchupCard_team'>Team</p>
            <div className='matchupCard_box'>
              <h3 className='matchupCard_teamName'>
                {userLeagueInfo?.team_name === null ? (
                  <p className='cardLeagueMember_noTeam'>no team name</p>
                ) : (
                  userLeagueInfo?.team_name
                )}
              </h3>
              <Avatar
                className='matchupCard_avatar'
                src={`${userLeagueInfo?.team_logo}`}
                sizes='medium'
                alt='team logo'
              />
            </div>
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default MatchupCard;
