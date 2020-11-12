import { Button, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import '../../css/CardUserSettings.css';

function CardUserSettings() {
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');

  const submitUser = () => setUsername('');
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
      style={{ paddingRight: '20px' }}
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
