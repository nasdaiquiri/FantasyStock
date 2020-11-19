import {
  Button, IconButton, TextField, Typography
} from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { selectSettings } from '../../features/ownerLeagueSlice.js';
import '../../css/CardAddMembers.css';

const useStyles = makeStyles({
  root: {
    paddingLeft: '20px'
  },
  button: {
    borderColor: 'green',
    color: 'green'
  },
  delete: {
    textAlign: 'right',
    right: '0px'
  }
});

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

  const classes = useStyles();
  const settings = useSelector(selectSettings);

  return (
    <Typography className={classes.root}>
      <div className='cardAddMembers_header'>
        <p>
          {`Up to
        ${settings?.numberOfTeams} players`}
        </p>
        <p>
          {`Members:
        ${users.length}`}
        </p>
        <p>even numbers only</p>
      </div>
      <form className='addMembers_form'>
        <TextField
          variant='outlined'
          type='text'
          value={input}
          onChange={handleChange}
        />
        <Button
          className={classes.button}
          variant='outlined'
          type='submit'
          onClick={addMembers}
          disabled={!input || Number(settings?.numberOfTeams) === users.length}
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
            <div>
              <IconButton
              // className='addMembers_deleteButton'
                variant='contained'
                type='button'
                onClick={() => deleteSelection(user.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </ol>
      {
        users.length > 0
        && (
          <div className='addMembers_addMembersButton'>
            <Button
              className={classes.button}
              variant='outlined'
              type='submit'
              onClick={addMembersToLeague}
              disabled={users.length % 2}
            >
              Update Members in League
            </Button>
          </div>
        )
      }
      {submitted && <p className='addMembers_saved'>Saved</p>}
    </Typography>
  );
}

export default CardAddMembers;
