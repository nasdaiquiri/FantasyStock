import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../features/userSlice.js';
import { selectLeague, selectLeagueOwner } from '../features/leagueSlice.js';
import SettingsLeague from '../components/Settings/SettingsLeague.jsx';
import '../css/Settings.css';
import UserSettings from '../components/Settings/UserSettings.jsx';
import { setOwnerLeague, setSettings } from '../features/ownerLeagueSlice.js';

function Settings() {
  const dispatch = useDispatch();

  const [myLeague, setMyLeague] = useState({});
  const league = useSelector(selectLeague);
  const leagueOwner = useSelector(selectLeagueOwner);
  const user = useSelector(selectUser);

  useEffect(() => {
    async function fetchLeague() {
      const response = await axios.get(`/league/${league}/${user?.id}`);
      dispatch(setOwnerLeague(response.data));
      setMyLeague(response.data);
      return response;
    }
    fetchLeague();
  }, [league, user, dispatch]);

  useEffect(() => {
    async function fetchSettings() {
      const response = await axios.get(`/league/settings/${league}`);
      dispatch(setSettings(response.data));
      return response;
    }
    fetchSettings();
  }, [league, dispatch]);

  return (
    <div className='settings_league'>
      <UserSettings />
      <div className='settings_userSettings'>
        {user?.id === leagueOwner
          && <SettingsLeague myLeague={myLeague} setMyLeague={setMyLeague} />}
      </div>
    </div>

  );
}

export default Settings;
