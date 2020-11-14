import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  score: {
    float: 'right',
    paddingRight: 20,
    paddingTop: 3,
    fontSize: 20
  }
});

function ScoreCard({
  awayWins,
  awayLosses,
  awayTies,
  awayTeamId,
  awayName,
  awayWorth,
  homeWins,
  homeLosses,
  homeTies,
  homeTeamId,
  homeName,
  homeWorth,
  getMatchups,
  startingBalance
}) {
  const classes = useStyles();
  const balancePercentage = (value, leagueBalance) => (
    ((value * 0.01) - leagueBalance) / leagueBalance);
  return (
    <Card
      className={classes.root}
      variant='outlined'
      onClick={() => getMatchups(homeTeamId, awayTeamId)}
    >
      <CardContent>
        <Typography className={classes.score} variant='body2' component='p'>
          {(awayWorth * 0.01).toFixed(2)}
          (
          {balancePercentage(awayWorth, startingBalance).toFixed(2)}
          %
          )
        </Typography>
        <Typography variant='h5' component='h2'>
          {awayName}
        </Typography>
        <Typography className={classes.pos} color='textSecondary'>
          (
          {awayWins}
          -
          {awayLosses}
          -
          {awayTies}
          )
        </Typography>
        <Typography className={classes.score} variant='body2' component='p'>
          {(homeWorth * 0.01).toFixed(2)}
          (
          {balancePercentage(homeWorth, startingBalance).toFixed(2)}
          %
          )
        </Typography>
        <Typography variant='h5' component='h2'>
          {homeName}
        </Typography>
        <Typography className={classes.pos} color='textSecondary'>
          (
          {homeWins}
          -
          {homeLosses}
          -
          {homeTies}
          )
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ScoreCard;
