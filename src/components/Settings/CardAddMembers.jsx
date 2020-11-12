import { Button, TextField, Typography } from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSettings } from '../../features/ownerLeagueSlice.js';

function CardAddMembers({
  handleChange, addMembers, deleteSelection,
  addMembersToLeague,
  submitted,
  users,
  input
}) {
  CardAddMembers.propTypes = {
    handleChange: propTypes.func.isRequired,
    addMembers: propTypes.func.isRequired,
    deleteSelection: propTypes.func.isRequired,
    addMembersToLeague: propTypes.func.isRequired,
    submitted: propTypes.string.isRequired,
    users: propTypes.string.isRequired,
    input: propTypes.string.isRequired
  };

  const settings = useSelector(selectSettings);

  return (
    <Typography align='center' style={{ paddingLeft: '20px' }}>
      <p>
        {`Up to
        ${settings?.numberOfTeams} players`}
      </p>
      <p>
        {`Members:
        ${users.length}`}
      </p>
      <p>even numbers only</p>
      <form className='addMembers_form'>
        <TextField
          variant='outlined'
          type='text'
          value={input}
          onChange={handleChange}
        />
        <Button
          variant='contained'
          color='primary'
          type='submit'
          onClick={addMembers}
          disabled={!input || settings?.numberOfTeams === users.length}
        >
          add
        </Button>
      </form>

      <ol className='addMembers_ol'>
        {users.map((user) => (
          <div className='addMembers_newList'>
            <li className='addMember_username' key={user.id}>
              {user.username}
              <p className='addMember_fullName'>{user.full_name}</p>
            </li>
            <Button
              className='addMembers_deleteButton'
              variant='contained'
              color='secondary'
              type='button'
              onClick={() => deleteSelection(user.id)}
            >
              delete
            </Button>
          </div>
        ))}
      </ol>
      {
        users.length > 0
        && (
          <div className='addMembers_addMembersButton'>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              onClick={addMembersToLeague}
              disabled={users.length % 2}
            >
              Add Members to League
            </Button>
          </div>
        )
      }
      {submitted && <p className='addMembers_saved'>Saved</p>}
    </Typography>
  );
}

export default CardAddMembers;
