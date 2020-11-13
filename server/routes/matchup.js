/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
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
      const schedule = leagueInfo.dataValues.settings.schedule;
      const arrayMatchups = Object.values(schedule.weeklyMatchups);
      arrayMatchups.map((week) => {
        const thing = week.map((side) => {
          const arraySides = Object.values(side);
          arraySides.map((indSide) => {
            const id = indSide.teamID;
            users.map((user) => {
              if (user.id_user === id) {
                indSide.user = user;
              }
              return user;
            });
            return indSide;
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
