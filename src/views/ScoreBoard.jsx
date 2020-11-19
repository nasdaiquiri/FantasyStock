/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import '../css/ScoreBoard.css';
import Button from '@material-ui/core/Button';
import ScoreCard from '../components/ScoreBoard/ScoreCard.jsx';
import CurrentMatchup from '../components/ScoreBoard/CurrentMatchup.jsx';
import Standings from '../components/ScoreBoard/Standings.jsx';
import { selectLeague, selectUserLeagues } from '../features/leagueSlice.js';

const useStyles = makeStyles(() => ({
  button: {
    float: 'right',
    margin: '7px',
    borderColor: 'green',
    color: 'green'
  },
  standings: {
    paddingTop: '25px'
  },
  currentMatch: {
    paddingTop: '25px'
  }
}));

function ScoreBoard() {
  const [matches, setMatches] = useState([]);
  const [week, setWeek] = useState(null);
  const [matchPortfolio, setMatchPortfolio] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [leagueInfoStandings, setLeagueInfoStandings] = useState([]);
  const league = useSelector(selectLeague);
  const userLeagues = useSelector(selectUserLeagues);
  const classes = useStyles();

  useEffect(() => {
    axios({
      method: 'GET',
      url: `/matchup/${league}`
    })
      .then((response) => {
        if (response.data.currentWeek === 0) {
          setWeek(response.data.currentWeek + 1);
        } else {
          setWeek(response.data.currentWeek);
        }
        setMatches(response.data.weeklyMatchups);
      })
      .catch((err) => console.warn(err));
  }, [league]);

  useEffect(() => {
    axios
      .get(`/league/oneleague/${league}`)
      .then((leagueInfo) => setLeagueInfoStandings(leagueInfo.data.users))
      .catch((err) => console.warn(err));
  }, [league]);
  const leagueInfoSort = leagueInfoStandings.sort(
    (a, b) => (a.league_user.wins - a.league_user.losses)
        / (a.league_user.wins + a.league_user.losses + a.league_user.ties)
      - (b.league_user.wins - b.league_user.losses)
        / (b.league_user.wins + b.league_user.losses + b.league_user.ties)
  );

  const getMatchups = async (homeId, awayId) => {
    const getHomePortfolio = axios
      .get(`/stock/portfolio/${homeId}`)
      .then((response) => response.data)
      .catch((err) => console.warn(err));

    const getAwayPortfolio = axios
      .get(`/stock/portfolio/${awayId}`)
      .then((response) => response.data)
      .catch((err) => console.warn(err));

    const awaitGetHomePortfolio = await getHomePortfolio;
    const awaitGetAwayPortfolio = await getAwayPortfolio;

    const setMatch = await Promise.all([
      awaitGetHomePortfolio,
      awaitGetAwayPortfolio
    ])
      .then((response) => response)
      .then((ports) => {
        setMatchPortfolio(ports);
      })
      .then(() => setToggle(true))
      .catch((err) => console.warn(err));
    await setMatch;
  };

  const switchViews = () => {
    setToggle(false);
  };

  const currentWeek = `week${week}`;
  const currentWeekMatches = matches[currentWeek];
  const startingLeagueBalance = userLeagues
    .reduce((userBank, userLeague) => {
      if (userLeague.id === league) {
        userBank.push(userLeague.settings.startingBank);
      }
      return userBank;
    }, []);
  const displayWeek = `Week ${week}`;

  const getStandings = () => setShowStandings(!showStandings);

  return (
    <div>
      <Button
        size='small'
        variant='outlined'
        className={classes.button}
        onClick={getStandings}
      >
        {!showStandings ? 'Standings' : 'Matchups'}
      </Button>
      <h1>{displayWeek}</h1>
      {!showStandings ? (
        !toggle ? (
          currentWeekMatches
          && currentWeekMatches.map((match) => (
            <ScoreCard
              awayScore={match.Away.score}
              awayName={match.Away.user.team_name}
              awayWins={match.Away.user.wins}
              awayLosses={match.Away.user.losses}
              awayTies={match.Away.user.ties}
              awayTeamId={match.Away.teamID}
              awayBalance={match.Away.user.bank_balance}
              awayWorth={match.Away.user.net_worth}
              homeScore={match.Home.score}
              homeName={match.Home.user.team_name}
              homeWins={match.Home.user.wins}
              homeLosses={match.Home.user.losses}
              homeTies={match.Home.user.ties}
              homeTeamId={match.Home.teamID}
              homeBalance={match.Home.user.bank_balance}
              homeWorth={match.Home.user.net_worth}
              getMatchups={(homeID, awayID) => getMatchups(homeID, awayID)}
              startingBalance={startingLeagueBalance[1]}
            />
          ))
        ) : (
          <div className={classes.currentMatch}>
            <CurrentMatchup
              switchViews={switchViews}
              homePortfolio={matchPortfolio[0]}
              awayPortfolio={matchPortfolio[1]}
            />
          </div>
        )
      ) : (
        <div className={classes.standings}>
          <Standings leagues={leagueInfoSort} />
          {' '}
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
