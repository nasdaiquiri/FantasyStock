const { League } = require('../db/index.js');

function primeMatch() {
  let newSettings = {};
  League.findByPk(2)
    .then((league) => {
      newSettings = { ...league.dataValues.settings };
      newSettings.schedule = {
        currentWeek: 3,
        weeklyMatchups: {
          week1: {
            match1: {
              home: {
                teamID: '1',
                score: 115
              },
              away: {
                teamID: '3',
                score: 99
              },
              winner: null,
              finalScore: null
            },
            match2: {
              home: {
                teamID: '2',
                score: 115
              },
              away: {
                teamID: '4',
                score: 99
              },
              winner: null,
              finalScore: null
            }
          },
          week2: {
            match1: {
              home: {
                teamID: '1',
                score: 101
              },
              away: {
                teamID: '2',
                score: 90
              },
              winner: null,
              finalScore: null
            },
            match2: {
              home: {
                teamID: '3',
                score: 35
              },
              away: {
                teamID: 4,
                score: 199
              },
              winner: null,
              finalScore: null
            }
          },
          week3: {
            match1: {
              home: {
                teamID: '1',
                score: 101
              },
              away: {
                teamID: '4',
                score: 90
              },
              winner: null,
              finalScore: null
            },
            match2: {
              home: {
                teamID: '2',
                score: 35
              },
              away: {
                teamID: 3,
                score: 199
              },
              winner: null,
              finalScore: null
            }
          }
        }
      };
    })
    .catch((err) => {
      console.error(`❌${err}`);
    });
}

primeMatch();
