import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../css/ScoreBoard.css';
import ScoreCard from '../components/ScoreBoard/ScoreCard.jsx';
import CurrentMatchup from '../components/ScoreBoard/CurrentMatchup.jsx';
import { selectLeague } from '../features/leagueSlice.js';

function ScoreBoard() {
  const [matches, setMatches] = useState([]);
  const [week, setWeek] = useState(1);
  const [matchPortfolio, setMatchPortfolio] = useState([]);
  const [toggle, setToggle] = useState(false);
  const league = useSelector(selectLeague);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `/matchup/${league}`
    }).then((response) => setMatches(response.data.weeklyMatchups));
  }, [league]);

  const getMatchups = (homeId, awayId) => {
    console.log('(24)', homeId, awayId);
    const getHomePortfolio = axios
      .get(`/stock/portfolio/${homeId}`)
      .then((response) => response.data);

    const getAwayPortfolio = axios
      .get(`/stock/portfolio/${awayId}`)
      .then((response) => response.data);

    return Promise.all([getHomePortfolio, getAwayPortfolio])
      .then((response) => response).then((ports) => {
        setMatchPortfolio(ports);
      }).then(() => setToggle(true));
  };
  const switchViews = () => {
    setToggle(false);
  };

  const currentWeek = `week${week}`;
  const currentWeekMatches = matches[currentWeek];
  console.log(currentWeekMatches);

  return (
    <div>
      {!toggle ? currentWeekMatches?.map((match) => (
        <ScoreCard
          awayScore={match.Away.score}
          awayName={match.Away.user.team_name}
          awayRecord={match.Away.user.record}
          awayTeamId={match.Away.teamID}
          homeScore={match.Home.score}
          homeName={match.Home.user.team_name}
          homeRecord={match.Home.user.record}
          homeTeamId={match.Home.teamID}
          getMatchups={(homeID, awayID) => getMatchups(homeID, awayID)}
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
