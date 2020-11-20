// server/routes/user.js: remove comment on line 244,
const { Router } = require('express');
const { Op } = require('sequelize');

const {
  League_user,
  User
} = require('../db/index');

const userRouter = Router();

userRouter.put('/updateUsername', (req, res) => {
  const { userID, newUsername } = req.body;
  User.update({
    username: newUsername
  },
  {
    where: {
      id: userID
    }
  })
    .then((response) => res.send(response))
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});
userRouter.put('/updateUserTeamLogo', (req, res) => {
  const { userID, leagueID, teamLogo } = req.body;
  League_user.update({
    team_logo: teamLogo
  },
  {
    where: {
      id_user: userID,
      id_league: leagueID
    }
  })
    .then((response) => res.send(response))
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});
userRouter.put('/updateUserTeamName', (req, res) => {
  const { userID, leagueID, teamName } = req.body;
  League_user.update({
    team_name: teamName
  },
  {
    where: {
      id_user: userID,
      id_league: leagueID
    }
  })
    .then((response) => res.send(response))
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

userRouter.get('/team/:leagueID/:userID', (req, res) => {
  const { leagueID, userID } = req.params;
  League_user.findOne({
    where: {
      id_user: userID,
      id_league: leagueID
    }
  })
    .then((userInfo) => res.send(userInfo))
    .catch((err) => console.error(err));
});

userRouter.get('/user/:userID', (req, res) => {
  const { userID } = req.params;
  User.findOne({
    where: {
      id: userID
    }
  })
    .then((userInfo) => res.send(userInfo))
    .catch((err) => console.error(err));
});

userRouter.put('/user/:userID', (req, res) => {
  const { userID } = req.params;
  const { username } = req.body;
  User.update({
    username
  },
  {
    where: {
      id: userID
    }
  })
    .then((newUsername) => {
      res.status(201).send(newUsername);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

userRouter.get('/', (req, res) => {
  User.findAll()
    .then((userInfo) => res.send(userInfo))
    .catch((err) => console.warn(err));
});

userRouter.get('/:username', (req, res) => {
  const { username } = req.params;

  User.findOne({
    where: {
      username: {
        [Op.iLike]: username
      }
    }
  })
    .then((userInfo) => res.status(200).send(userInfo))
    .catch((err) => res.status(500).send(err));
});

userRouter.post('/', (req, res) => {
  const {
    id, username, full_name, avatar
  } = req.body;
  User.findOrCreate({
    where: {
      id
    },
    defaults: {
      full_name, username, avatar
    }
  })
    .then((userInfo) => {
      const responseUserInfo = { ...userInfo[0].dataValues };
      League_user.findAll({
        where: {
          id_user: id
        }
      })
        .then((leagueInfo) => {
          responseUserInfo.leagueInfo = leagueInfo;
          res.send(responseUserInfo);
        });
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

userRouter.get('/userleagues/:userID', (req, res) => {
  const { userID } = req.params;
  User.findOne({
    where: {
      id: userID
    }
  })
    .then((userInfo) => {
      const responseUserInfo = { ...userInfo.dataValues };
      League_user.findAll({
        where: {
          id_user: userID
        }
      })
        .then((leagueInfo) => {
          responseUserInfo.leagueInfo = leagueInfo;
          res.send(responseUserInfo);
        });
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

userRouter.put('/', (req, res) => {
  const {
    id, username, full_name, avatar
  } = req.body;
  User.update({
    full_name, username, avatar
  },
  {
    where: {
      id
    }
  })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

userRouter.get('/league/user/:userID', (req, res) => {
  const { userID } = req.params;
  const leagueIDs = [];
  League_user.findAll({
    where: {
      id_user: userID
    }
  })
    .then((leagueUserInfo) => {
      leagueUserInfo.map((data) => {
        leagueIDs.push(data.id_league);
      });
      League_user.findAll({
        where: {
          id_league: { [Op.or]: leagueIDs }
        }
      })
        .then((usersInfo) => {
          res.send(usersInfo);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = {
  userRouter
};
