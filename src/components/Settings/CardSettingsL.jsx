import { Button, Input, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectLeague } from '../../features/leagueSlice.js';
import { selectUser } from '../../features/userSlice.js';

function CardSettingsL({
  setMyLeague,
  myLeague,
  inputsForm
}) {
  CardSettingsL.propTypes = {
    myLeague: propTypes.string.isRequired,
    inputsForm: propTypes.string.isRequired,
    setMyLeague: propTypes.func.isRequired
  };

  const league = useSelector(selectLeague);
  const user = useSelector(selectUser);

  const [leagueForm, setLeagueForm] = useState({});

  const handleChange = (e) => setLeagueForm({ ...leagueForm, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios.put('/league',
      {
        id_league: myLeague?.id,
        id_owner: myLeague?.id_owner,
        league_name: myLeague?.league_name,
        settings: leagueForm
      })
      .then(() => axios.get(`/league/${league}/${user?.id}`))
      .then((response) => setMyLeague(response.data));
  };

  return (
    <Typography>
      <h3 className='settingsLeague_leagueName'>
        {`League Name: ${myLeague?.league_name}`}
      </h3>
      <form
        className='settingsLeague_form'
        onSubmit={handleFormSubmit}
      >
        {inputsForm?.map(({
          description, type, name
        }) => (
          <div
            className='settingsLeague_settingBox'
          >
            <p>{description}</p>
            <Input
              key={name}
              type={type}
              name={name}
              onChange={handleChange}
            />
          </div>
        ))}
        <Button
          className='settingsLeague_formButton'
          variant='contained'
          color='primary'
          type='submit'
        >
          Submit
        </Button>
      </form>
    </Typography>
  );
}

export default CardSettingsL;
