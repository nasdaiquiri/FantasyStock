import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../css/ScoreBoard.css';
import ScoreCard from '../components/ScoreBoard/ScoreCard.jsx';
import CurrentMatchup from '../components/ScoreBoard/CurrentMatchup.jsx';
import { selectLeague, selectUserLeagues } from '../features/leagueSlice.js';

function ScoreBoard() {
  const [matches, setMatches] = useState([]);
  const [week, setWeek] = useState(null);
  const [matchPortfolio, setMatchPortfolio] = useState([]);
  const [toggle, setToggle] = useState(false);
  const league = useSelector(selectLeague);
  const userLeagues = useSelector(selectUserLeagues);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `/matchup/${league}`
    }).then((response) => {
      if (response.data.currentWeek === 0) {
        setWeek(response.data.currentWeek + 1);
      } else {
        setWeek(response.data.currentWeek);
      }
      setMatches(response.data.weeklyMatchups);
    });
  }, [league]);

  const getMatchups = async (homeId, awayId) => {
    const getHomePortfolio = axios
      .get(`/stock/portfolio/${homeId}`)
      .then((response) => response.data);

    const getAwayPortfolio = axios
      .get(`/stock/portfolio/${awayId}`)
      .then((response) => response.data);

    const awaitGetHomePortfolio = await getHomePortfolio;
    const awaitGetAwayPortfolio = await getAwayPortfolio;

    const setMatch = await Promise.all([awaitGetHomePortfolio, awaitGetAwayPortfolio])
      .then((response) => response).then((ports) => {
        setMatchPortfolio(ports);
      }).then(() => setToggle(true));
    await setMatch;
  };

  const switchViews = () => {
    setToggle(false);
  };

  const currentWeek = `week${week}`;
  const currentWeekMatches = matches[currentWeek];
  const startingLeagueBalance = userLeagues
    .map((userLeague) => {
      if (userLeague.id === league) {
        return Number(userLeague.settings.startingBank);
      }
      return null;
    });
  const displayWeek = `Week ${week}`;

  return (
    <div>
      <h1>
        {displayWeek}
      </h1>
      {!toggle ? (currentWeekMatches) && currentWeekMatches.map((match) => (
        <ScoreCard
          awayScore={match.Away.score}
          awayName={match.Away.user.team_name}
          awayRecord={match.Away.user.record}
          awayTeamId={match.Away.teamID}
          awayBalance={match.Away.user.bank_balance}
          awayWorth={match.Away.user.net_worth}
          homeScore={match.Home.score}
          homeName={match.Home.user.team_name}
          homeRecord={match.Home.user.record}
          homeTeamId={match.Home.teamID}
          homeBalance={match.Home.user.bank_balance}
          homeWorth={match.Home.user.net_worth}
          getMatchups={(homeID, awayID) => getMatchups(homeID, awayID)}
          startingBalance={startingLeagueBalance[0]}
        />
      ))
        : (
          <div>
            <CurrentMatchup
              switchViews={switchViews}
              homePortfolio={matchPortfolio[0]}
              awayPortfolio={matchPortfolio[1]}
            />
          </div>
        )}
    </div>
  );
}

export default ScoreBoard;
