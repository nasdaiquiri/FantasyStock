const { Router } = require('express');

const matchupRouter = Router();

const {
  League,
  League_user
} = require('../db/index');

matchupRouter.get('/:leagueID', async (req, res) => {
  const { leagueID } = req.params;
  let users = await League_user.findAll({
    where: {
      id_league: leagueID
    }
  })
    .then((data) => data)
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  users = users.map((user) => user.dataValues);
  const schedule1 = await League.findOne(
    {
      where: {
        id: leagueID
      }
    }
  )
    .then((leagueInfo) => {
      const { schedule } = leagueInfo.dataValues.settings;
      Object.keys(schedule.weeklyMatchups).map((week) => {
        const thing = Object.keys(schedule.weeklyMatchups[week]).map((side) => {
          Object.keys(schedule.weeklyMatchups[week][side]).map((indSide) => {
            if (indSide === 'winner') {
              return;
            }
            if (indSide === 'finalScore') {
              return;
            }
            const id = schedule.weeklyMatchups[week][side][indSide].teamID;
            users.map((user) => {
              if (user.id_user === id) {
                schedule.weeklyMatchups[week][side][indSide].user = user;
              }
              return user;
            });
          });
          return side;
        });
        return thing;
      });
      res.send(schedule);
      return schedule;
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  return schedule1;
});

module.exports = {
  matchupRouter
};
