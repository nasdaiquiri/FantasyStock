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
  awayScore,
  awayRecord,
  awayTeamId,
  awayName,
  awayBalance,
  homeRecord,
  homeTeamId,
  homeName,
  homeScore,
  homeBalance,
  getMatchups,
  startingBalance
}) {
  ScoreCard.propTypes = {
    awayScore: PropTypes.number.isRequired,
    awayRecord: PropTypes.string.isRequired,
    awayTeamId: PropTypes.number.isRequired,
    awayName: PropTypes.string.isRequired,
    awayBalance: PropTypes.number.isRequired,
    homeScore: PropTypes.number.isRequired,
    homeRecord: PropTypes.string.isRequired,
    homeTeamId: PropTypes.number.isRequired,
    homeName: PropTypes.string.isRequired,
    homeBalance: PropTypes.number.isRequired,
    getMatchups: PropTypes.func.isRequired,
    startingBalance: PropTypes.number.isRequired
  };
  const classes = useStyles();
  const balancePercentage = (balance, leagueBalance) => (
    ((balance * 0.01) - leagueBalance) / leagueBalance);
  return (
    <Card
      className={classes.root}
      variant='outlined'
      onClick={() => getMatchups(homeTeamId, awayTeamId)}
    >
      <CardContent>
        <Typography className={classes.score} variant='body2' component='p'>
          {(awayBalance * 0.01).toFixed(2)}
          (
          {balancePercentage(awayBalance, startingBalance).toFixed(2)}
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
          {(homeBalance * 0.01).toFixed(2)}
          (
          {balancePercentage(homeBalance, startingBalance).toFixed(2)}
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
