import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AddMembers from './AddMembers.jsx';
import '../../css/SettingsLeague.css';
import CardSettingsL from './CardSettingsL.jsx';
import AccordionComp from '../AccordionComp.jsx';
import {
  selectSettings,
  setSettings,
  setUsersInLeague
} from '../../features/ownerLeagueSlice.js';
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
  const [oldSettings, setOldSettings] = useState({});

  useEffect(() => {
    setLeagueForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    axios
      .get(`/league/settings/${league}`)
      .then(({ data }) => setOldSettings(data));
  }, [league]);

  const handleChange = (e) => {
    setLeagueForm({ ...leagueForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios
      .put('/league', {
        id_league: myLeague?.id,
        id_owner: myLeague?.id_owner,
        league_name: myLeague?.league_name,
        settings: {
          ...leagueForm,
          startingBank:
            leagueForm.startingBank === ''
              ? Number(oldSettings.startingBank)
              : Number(leagueForm.startingBank),
          numberOfMatches:
            leagueForm.numberMatches === ''
              ? Number(oldSettings.numberMatches)
              : Number(leagueForm.numberMatches),
          numberTeams:
            leagueForm.numberTeams === ''
              ? Number(oldSettings.numberTeams)
              : Number(leagueForm.numberTeams)
        }
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
    axios
      .get(`/league/league/${myLeague.id}`)
      .then((response) => dispatch(setUsersInLeague(response.data)))
      .catch((err) => console.warn(err));
  }, [myLeague.id, dispatch]);

  const inputsForm = [
    {
      description: 'number of teams',
      type: 'number',
      name: 'numberTeams',
      oldValue: oldSettings?.numberTeams
    },
    {
      description: 'number of weeks',
      type: 'number',
      name: 'numberMatches',
      oldValue: oldSettings?.numberMatches
    },
    {
      description: 'start date',
      type: 'date',
      name: 'startDate'
    },
    {
      description: 'starting bank',
      type: 'number',
      name: 'startingBank',
      oldValue: oldSettings?.startingBank * 0.01
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
        <AddMembers myLeague={myLeague} />
      </div>
    </div>
  );
}

export default SettingsLeague;
