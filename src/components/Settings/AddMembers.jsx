import React, { useState, useEffect } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectLeague } from '../../features/leagueSlice.js';
import '../../css/AddMembers.css';
import AccordionComp from '../AccordionComp.jsx';
import CardAddMembers from './CardAddMembers.jsx';
import { selectUsersInLeague } from '../../features/ownerLeagueSlice.js';

function AddMembers({ myLeague }) {
  AddMembers.propTypes = {
    myLeague: propTypes.shape.isRequired
  };

  const usersInLeague = useSelector(selectUsersInLeague);

  const [input, setInput] = useState('');
  const [users, setUsers] = useState(usersInLeague);
  const leagueID = useSelector(selectLeague);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setUsers(usersInLeague);
  }, [usersInLeague]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const addMembers = (e) => {
    e.preventDefault();
    axios
      .get(`/user/${input}`)
      .then((user) => setUsers([...users, user.data]))
      .catch((err) => console.warn(err));
    setInput('');
  };

  const deleteSelection = (id) => {
    const newUsers = users.filter((item) => item.id !== id);
    setUsers(newUsers);
  };

  const addMembersToLeague = () => {
    const userIDs = users.map((user) => user.id);
    axios.put('/league/users', { userIDs, leagueID });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1000);
  };

  const Component = () => (
    <CardAddMembers
      handleChange={handleChange}
      addMembers={addMembers}
      deleteSelection={deleteSelection}
      addMembersToLeague={addMembersToLeague}
      submitted={submitted}
      users={users}
      input={input}
      myLeague={myLeague}
    />
  );

  return (
    <div>
      <AccordionComp Component={Component} title='Add Members' />
    </div>
  );
}

export default AddMembers;
