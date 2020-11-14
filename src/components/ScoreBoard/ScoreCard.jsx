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
  awayRecord,
  awayTeamId,
  awayName,
  awayWorth,
  homeRecord,
  homeTeamId,
  homeName,
  homeWorth,
  getMatchups,
  startingBalance
}) {
  ScoreCard.propTypes = {
    awayRecord: PropTypes.string.isRequired,
    awayTeamId: PropTypes.number.isRequired,
    awayName: PropTypes.string.isRequired,
    awayWorth: PropTypes.number.isRequired,
    homeRecord: PropTypes.string.isRequired,
    homeTeamId: PropTypes.number.isRequired,
    homeName: PropTypes.string.isRequired,
    homeWorth: PropTypes.number.isRequired,
    getMatchups: PropTypes.func.isRequired,
    startingBalance: PropTypes.number.isRequired
  };
  const classes = useStyles();
  const balancePercentage = (value, leagueBalance) => (
    (((value) - leagueBalance) * 0.01) / leagueBalance);
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
          {awayRecord}
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
          {homeRecord}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ScoreCard;
