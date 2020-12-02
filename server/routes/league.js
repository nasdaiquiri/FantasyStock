const { Router } = require('express');

const leagueRouter = Router();

const { League, League_user, User } = require('../db/index');
const { getBankForUserUpdate, settingsUpdater } = require('./helpers');

leagueRouter.get('/settings/:leagueID', (req, res) => {
  const { leagueID } = req.params;
  League.findOne({
    where: {
      id: leagueID
    }
  })
    .then((leagueInfo) => res.send(leagueInfo.dataValues.settings))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

leagueRouter.post('/addUser', (req, res) => {
  const { userID, leagueID } = req.body;
  League_user.create({
    id_league: leagueID,
    id_user: userID,
    bank_balance: 1000000,
    net_worth: 1000000,
    wins: 0,
    losses: 0,
    ties: 0,
    portfolio_history: {
      week: null,
      balance_start: null
    }
  })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      res.status(500).send(err);
    });
  return 'success';
});

leagueRouter.get('/league/:leagueID', (req, res) => {
  const { leagueID } = req.params;

  League.findAll({
    where: { id: leagueID },
    include: [{ model: User }]
  }).then((response) => res.send(response[0].dataValues.users));
});

leagueRouter.get('/oneleague/:leagueID', (req, res) => {
  const { leagueID } = req.params;

  League.findOne({
    where: {
      id: leagueID
    },
    include: [{ model: User }]
  })
    .then((leagueInfo) => res.send(leagueInfo))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

leagueRouter.get('/:userID', (req, res) => {
  const { userID } = req.params;
  User.findAll({
    where: { id: userID },
    include: [{ model: League }]
  }).then((response) => res.send(response));
});

leagueRouter.get('/', (req, res) => {
  League.findAll()
    .then((response) => res.send(response))
    .catch((err) => res.send(err));
});

leagueRouter.post('/', (req, res) => {
  const { league_name, id_owner, numberTeams } = req.body;
  const settings = {
    date_end: null,
    lengthMatch: 7,
    numberOfMatches: 8,
    numberTeams,
    numberOfTeamsPlayoffs: null,
    date_start: null,
    startingBank: 1000000,
    net_worth: 1000000,
    schedule: {
      currentWeek: null,
      weeklyMatchups: null
    }
  };
  League.create({
    league_name,
    id_owner,
    settings
  })
    .then((leagueInfo) => {
      League_user.create({
        id_user: leagueInfo.dataValues.id_owner,
        id_league: leagueInfo.dataValues.id,
        bank_balance: 1000000,
        net_worth: 1000000,
        wins: 0,
        losses: 0,
        ties: 0,
        portfolio_history: {
          week: null,
          balance_start: null
        }
      }).catch((err) => {
        console.warn(err);
        res.status(500).send(err);
      });
      res.send(leagueInfo.dataValues);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

leagueRouter.put('/', async (req, res) => {
  const { id_league, league_name, id_owner, settings } = req.body;
  const newSettings = await settingsUpdater(
    id_owner,
    id_league,
    settings
  ).catch((err) => {
    console.warn(err);
    res.status(500).send(err);
  });
  const usersData = await League_user.findAll({
    where: {
      id_league
    }
  })
    .then((users) => users)
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
  const userIDs = [];
  usersData.map((userData) => userIDs.push(userData.dataValues.id_user));
  League.update(
    { league_name, settings: newSettings, id_owner },
    {
      where: {
        id: id_league
      }
    }
  )
    .then((updated) => res.send(updated))
    .then(async () => {
      const bank = await getBankForUserUpdate(id_league);
      const users = await League_user.findAll({
        where: { id_league }
      }).then((array) => array.map((user) => user.dataValues.id_user));
      users.map((user) => {
        League_user.update(
          {
            bank_balance: bank,
            net_worth: bank,
            wins: 0,
            losses: 0,
            ties: 0,
            portfolio_history: {
              week: null,
              balance_start: null
            }
          },
          {
            where: {
              id_user: user,
              id_league
            }
          }
        );
      });
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

leagueRouter.put('/users', async (req, res) => {
  const { userIDs, leagueID } = req.body;
  const bank = await getBankForUserUpdate(leagueID);
  League_user.findAll({
    where: {
      id_league: leagueID
    }
  })
    .then((joins) => {
      const existingIDs = [];
      joins.map((join) => {
        existingIDs.push(join.dataValues.id_user);
      });
      existingIDs.map((existingID) => {
        if (!userIDs.includes(existingID)) {
          League_user.destroy({
            where: {
              id_league: leagueID,
              id_user: existingID
            }
          }).catch((err) => {
            console.warn(err);
            res.status(500).send(err);
          });
        }
      });
      userIDs.map((userID) => {
        if (!existingIDs.includes(userID)) {
          League_user.create({
            bank_balance: bank,
            net_worth: bank,
            wins: 0,
            losses: 0,
            ties: 0,
            id_league: leagueID,
            id_user: userID,
            portfolio_history: {
              week: null,
              balance_start: null
            }
          }).catch((err) => {
            console.warn(err);
            res.status(500).send(err);
          });
        }
      });
      res.send(userIDs);
    })
    .then(() => {
      League.findByPk(leagueID).then(async (league) => {
        const newSettings = await settingsUpdater(
          league.dataValues.id_owner,
          leagueID,
          null,
          userIDs
        );
        League.update(
          {
            settings: newSettings
          },
          {
            where: {
              id: league.dataValues.id
            }
          }
        );
      });
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

leagueRouter.get('/:leagueID/:userID', (req, res) => {
  const { leagueID, userID } = req.params;
  League.findOne({
    where: {
      id: leagueID,
      id_owner: userID
    }
  })
    .then((league) => {
      const responseLeague = { ...league.dataValues };
      League_user.findOne({
        where: {
          id_league: leagueID
        }
      }).then((leagueInfo) => {
        responseLeague.leagueUser = leagueInfo;
        res.send(responseLeague);
      });
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

module.exports = {
  leagueRouter
};
