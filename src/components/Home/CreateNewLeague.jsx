import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { selectUser, setUser } from '../../features/userSlice.js';
import { setLeague, setLeagueOwner } from '../../features/leagueSlice.js';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    textAlign: 'left'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  buttonPadding: {
    marginTop: 25
  }
});

const formControlValues = ['4', '6', '8', '10', '12', '14'];

function CreateNewLeague() {
  const user = useSelector(selectUser);
  const [inputLeague, SetInputLeague] = useState('');
  const [open, setOpen] = useState(false);
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const classes = useStyles();

  const dispatch = useDispatch();

  const onSubmit = () => {
    axios.post('/league', {
      league_name: inputLeague,
      id_owner: user?.id,
      numberOfTeams: Number(numberOfTeams)
    })
      .then((leagueInfo) => {
        dispatch(setLeague(leagueInfo?.data.id));
        dispatch(setLeagueOwner(leagueInfo?.data.id_owner));
      })
      .then(() => axios.post('/user', { id: user?.id })
        .then((response) => dispatch(setUser(response.data))))
      .catch((err) => {
        console.warn(err);
      });
  };

  const handleLeagueTitle = (e) => SetInputLeague(e.target.value);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen} className={classes.buttonPadding}>
        Create League
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Create a League</DialogTitle>
        <DialogContent>
          <TextField
            style={{ backgroundColor: 'white' }}
            freesolo='true'
            type='search'
            label='League Name'
            margin='normal'
            variant='outlined'
            size='small'
            onChange={(e) => handleLeagueTitle(e)}
          />
        </DialogContent>
        <DialogContent>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Number of Teams</FormLabel>
            <RadioGroup row aria-label='position' name='position' defaultValue='top'>
              {formControlValues.map((formControlValue) => (
                <FormControlLabel
                  key={formControlValue}
                  value={formControlValue}
                  control={<Radio color='primary' />}
                  label={formControlValue}
                  labelPlacement='top'
                  onChange={((e) => setNumberOfTeams((e.target.value)))}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancel
          </Button>
          <Link key='settings' to='/settings'>
            <Button onClick={onSubmit} color='primary'>
              Create
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateNewLeague;
