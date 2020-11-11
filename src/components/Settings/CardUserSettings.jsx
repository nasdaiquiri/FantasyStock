import { Button, Input, Typography } from '@material-ui/core';
import React, { useState } from 'react';

function CardUserSettings() {
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');

  const submitUser = () => { };
  const submitTeam = () => { };
  const submitLogo = () => { };

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
    <Typography>
      {options.map(({
        name, state, setState, click
      }) => (
        <>
          {name}
          <Input
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
            disabled=''
          >
            add
          </Button>
        </>
      ))}
    </Typography>
  );
}

export default CardUserSettings;
