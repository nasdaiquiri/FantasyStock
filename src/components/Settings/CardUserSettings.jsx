import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
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

  const submitUser = () => {
    axios.put(`/user/user/${user?.id}`, { username })
      .then(() => axios.post('/user', { id: user?.id })
        .then((response) => dispatch(setUser(response.data))))
      .then(() => axios.get(`/league/league/${league}`)
        .then((response) => dispatch(setUsersInLeague(response.data))));
    setUsername('');
  };
  const submitTeam = () => setTeamName('');
  const submitLogo = () => setTeamLogo('');

  const options = [
    {
      name: 'Username',
      state: username,
      setState: setUsername,
      click: submitUser
    },
    {
      name: 'Team Name',
      state: teamName,
      setState: setTeamName,
      click: submitTeam
    },
    {
      name: 'Team Logo',
      state: teamLogo,
      setState: setTeamLogo,
      click: submitLogo
    }
  ];

  return (
    <Typography
      align='center'
      className={classes.root}
    >
      {options.map(({
        name, state, setState, click
      }) => (
        <form className='cardUserSettings_form'>
          {`${name}:  `}
          <TextField
            variant='outlined'
            type='text'
            value={state}
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
  );
}

export default CardUserSettings;
