import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import '../../css/CardUserSettings.css';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../../features/userSlice.js';
import { setUsersInLeague } from '../../features/ownerLeagueSlice.js';
import { selectLeague } from '../../features/leagueSlice.js';

const useStyles = makeStyles({
  root: {
    paddingLeft: '10px'
  }
});

function CardUserSettings() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const league = useSelector(selectLeague);

  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [leagueUser, setLeagueUser] = useState('');

  console.log(leagueUser);

  useEffect(() => {
    axios.get(`/user/team/${league}/${user?.id}`)
      .then((response) => setLeagueUser(response.data))
      .catch((err) => console.warn(err));
  }, [user?.id, league]);

  const submitUser = () => {
    axios
      .put(`/user/user/${user?.id}`, { username })
      .then(() => axios.post('/user', { id: user?.id }))
      .then((response) => dispatch(setUser(response.data)))
      .then(() => axios.get(`/league/league/${league}`))
      .then((response) => dispatch(setUsersInLeague(response.data)))
      .catch((err) => console.warm(err));
    setUsername('');
  };
  const submitTeam = () => {
    axios
      .put('/user/updateUserTeamName', { userID: user.id, leagueID: league, teamName })
      .then(() => axios.get(`/user/team/${league}/${user?.id}`))
      .then((response) => setLeagueUser(response.data))
      .catch((err) => console.warn(err));
    setTeamName('');
  };

  const submitLogo = () => {
    axios
      .put('/user/updateUserTeamLogo', { userID: user.id, leagueID: league, teamLogo })
      .catch((err) => console.warn(err));
    setTeamLogo('');
  };

  const options = [
    {
      name: 'Username',
      state: username,
      setState: setUsername,
      click: submitUser,
      defaultValue: user?.username
    },
    {
      name: 'Team Name',
      state: teamName,
      setState: setTeamName,
      click: submitTeam,
      defaultValue: leagueUser?.team_name
    },
    {
      name: 'Team Logo',
      state: teamLogo,
      setState: setTeamLogo,
      click: submitLogo
    }
  ];

  return (
    league !== null
      ? (
        <Typography
          align='center'
          className={classes.root}
        >
          {options.map(({
            name, state, setState, click, defaultValue
          }) => (
            <form className='cardUserSettings_form'>
              {`${name}:  `}
              <TextField
                variant='outlined'
                type='text'
                value={state}
                label={defaultValue}
                onChange={(e) => setState(e.target.value)}
              />
              <Button
                variant='contained'
                color='primary'
                type='submit'
                onClick={click}
                disabled={!state}
              >
                add
              </Button>
            </form>
          ))}
        </Typography>
      ) : (
        <Typography
          align='center'
          className={classes.root}
        >
          <form className='cardUserSettings_form'>
            {'Username:  '}
            <TextField
              variant='outlined'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant='contained'
              color='primary'
              type='submit'
              onClick={submitUser}
              disabled={!username}
            >
              add
            </Button>
          </form>
        </Typography>
      )
  );
}

export default CardUserSettings;
