import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

function LoadSpinner() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color='' />
    </div>
  );
}

export default LoadSpinner;
