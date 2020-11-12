import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AddMembers from './AddMembers.jsx';
import '../../css/SettingsLeague.css';
import CardSettingsL from './CardSettingsL.jsx';
import AccordionComp from '../AccordionComp.jsx';
import { selectSettings, setSettings } from '../../features/ownerLeagueSlice.js';

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
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [leagueForm, setLeagueForm] = useState({});

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
        settings: leagueForm
      })
      .then((response) => dispatch(setSettings(response.data)))
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    axios.get(`/league/league/${myLeague.id}`)
      .then((response) => setLeagueUsers(response.data));
  }, [myLeague.id]);

  const inputsForm = [
    {
      description: 'number of teams',
      type: 'number',
      name: 'numberTeams',
      value: leagueForm?.numberOfTeams
    },
    {
      description: 'number of days',
      type: 'number',
      name: 'lengthMatches',
      value: leagueForm?.lengthMatch
    },
    {
      description: 'number of matches',
      type: 'number',
      name: 'numberMatches',
      value: leagueForm?.numberOfTeams
    },
    {
      description: 'start date',
      type: 'date',
      name: 'startDate',
      value: leagueForm?.date_start
    },
    {
      description: 'end date',
      type: 'date',
      name: 'endDate',
      value: leagueForm?.date_end

    },
    {
      description: 'number of playoff teams',
      type: 'number',
      name: 'numberTeamsPlayoffs',
      value: settings?.numberOfTeamsPlayoffs

    },
    {
      description: 'starting bank',
      type: 'number',
      name: 'startingBank',
      value: settings?.startingBank

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
    />
  );

  return (
    <div className='settingsLeague'>
      <AccordionComp Component={Component} title='League Settings' />
      <div className='settingsLeague_addMembers'>
        <AddMembers
          leagueUsers={leagueUsers}
          myLeague={myLeague}
          setLeagueUsers={setLeagueUsers}
        />
      </div>
    </div>
  );
}

export default SettingsLeague;
