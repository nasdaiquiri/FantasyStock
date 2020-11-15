import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AddMembers from './AddMembers.jsx';
import '../../css/SettingsLeague.css';
import CardSettingsL from './CardSettingsL.jsx';
import AccordionComp from '../AccordionComp.jsx';
import { selectSettings, setSettings, setUsersInLeague } from '../../features/ownerLeagueSlice.js';
import { selectLeague } from '../../features/leagueSlice.js';
import { selectUser, setUser } from '../../features/userSlice.js';

function SettingsLeague({ myLeague, setMyLeague }) {
  SettingsLeague.propTypes = {
    setMyLeague: PropTypes.func.isRequired,
    myLeague: PropTypes.shape({
      league_name: PropTypes.string,
      bank_balance: PropTypes.string,
      id: PropTypes.string,
      id_owner: PropTypes.number
    }).isRequired
  };

  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const league = useSelector(selectLeague);
  const [leagueForm, setLeagueForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector(selectUser);

  useEffect(() => {
    setLeagueForm({ ...settings });
  }, [settings]);

  const handleChange = (e) => {
    setLeagueForm({ ...leagueForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios.put('/league',
      {
        id_league: myLeague?.id,
        id_owner: myLeague?.id_owner,
        league_name: myLeague?.league_name,
        settings: { ...leagueForm, numberTeams: Number(leagueForm.numberTeams) }
      })
      .then(() => axios.get(`/league/settings/${league}`))
      .then((response) => dispatch(setSettings(response.data)))
      .then(() => axios.get(`user/userleagues/${user?.id}`))
      .then((response) => dispatch(setUser(response.data)))
      .catch((err) => console.warn(err));

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1000);
  };

  useEffect(() => {
    axios.get(`/league/league/${myLeague.id}`)
      .then((response) => dispatch(setUsersInLeague(response.data)))
      .catch((err) => console.warn(err));
  }, [myLeague.id, dispatch]);

  const inputsForm = [
    {
      description: 'number of teams',
      type: 'number',
      name: 'numberTeams'
    },
    {
      description: 'number of days',
      type: 'number',
      name: 'lengthMatches'
    },
    {
      description: 'number of weeks',
      type: 'number',
      name: 'numberMatches'
    },
    {
      description: 'start date',
      type: 'date',
      name: 'startDate'
    },
    {
      description: 'end date',
      type: 'date',
      name: 'endDate'
    },
    {
      description: 'number of playoff teams',
      type: 'number',
      name: 'numberTeamsPlayoffs'
    },
    {
      description: 'starting bank',
      type: 'number',
      name: 'startingBank'
    }
  ];

  const Component = () => (
    <CardSettingsL
      handleFormSubmit={handleFormSubmit}
      setMyLeague={setMyLeague}
      myLeague={myLeague}
      inputsForm={inputsForm}
      handleChange={handleChange}
      leagueForm={leagueForm}
      submitted={submitted}
    />
  );

  return (
    <div className='settingsLeague'>
      <AccordionComp Component={Component} title='League Settings' />
      <div className='settingsLeague_addMembers'>
        <AddMembers
          myLeague={myLeague}
        />
      </div>
    </div>
  );
}

export default SettingsLeague;
