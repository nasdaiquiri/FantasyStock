import {
  Button, TextField, Typography
} from '@material-ui/core';
import React from 'react';
import propTypes from 'prop-types';
import '../../css/CardSettingsL.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    paddingLeft: '50px'
  }
});

function CardSettingsL({
  myLeague,
  inputsForm,
  handleFormSubmit,
  handleChange
}) {
  CardSettingsL.propTypes = {
    myLeague: propTypes.string.isRequired,
    inputsForm: propTypes.string.isRequired,
    handleFormSubmit: propTypes.func.isRequired,
    handleChange: propTypes.func.isRequired
  };

  const classes = useStyles();

  return (
    <Typography align='center' className={classes.root}>
      <h3 className='settingsLeague_leagueName'>
        {`League Name: ${myLeague?.league_name}`}
      </h3>
      <form
        noValidate
        autoComplete='off'
        className='settingsLeague_form'
        onSubmit={handleFormSubmit}
      >
        {inputsForm?.map(({
          description, type, name, value
        }) => (
          <>
            <p>{description}</p>
            <div key={value}>
              <TextField
                id='outlined-basic'
                variant='outlined'
                onChange={handleChange}
                type={type}
                name={name}
              />
            </div>
          </>
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
