// server/routes/stock.js: fix promises being used as callback hell, remove eslint-disable
const { Router } = require('express');
const { Op } = require('sequelize');

const {
  Stock,
  Stock_user,
  League_user
} = require('../db/index');
const {
  checkSharesAvailable,
  checkMoneyAvailable,
  updateStocks,
  portfolioValues
} = require('./helpers');

const stockRouter = Router();

stockRouter.get('/', (req, res) => {
  updateStocks()
    .then((updatedStocks) => updatedStocks)
    .then((updatedStocks) => updatedStocks.map(async (stockInfoX) => {
      const stockArray = Object.values(stockInfoX);

      const plug = async (stockInfo) => {
        if (!stockInfo) {
          return null;
        }
        const updatedStock = {};
        if (!stockInfo.quote == null) {
          updatedStock.ticker = stockInfo.quote.symbol;
          updatedStock.current_price_per_share = Math.round(stockInfo.quote.latestPrice * 100);
          Stock.update({
            current_price_per_share: updatedStock.current_price_per_share
          },
          {
            where: {
              ticker: updatedStock.ticker
            }
          })
            .catch((err) => {
              console.warn(err);
              res.status(500).send(err);
            });
        }
        return null;
      };
      return Promise.all(stockArray.map((stockInfo) => {
        plug(stockInfo);
      }))
        .then(() => {
          Stock.findAll()
            .then((stocks) => {
              res.send(stocks);
            })
            .catch((err) => {
              console.warn(err);
              res.status(500).send(err);
            });
        })
        .catch((err) => {
          console.warn(err);
          res.status(500).send(err);
        });
    }))
    .catch((err) => {
      res.status(500).send(err);
    });
});

// get stock info by stock primary key id
stockRouter.get('/stock/:stockID', (req, res) => {
  const { stockID } = req.params;
  Stock.findByPk(stockID)
    .then((stock) => {
      res.send(stock);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

stockRouter.get('/bank/:userID/:leagueID', (req, res) => {
  const { userID, leagueID } = req.params;
  League_user.findOne({
    where: {
      id_user: userID,
      id_league: leagueID
    }
  })
    .then((bank) => {
      res.send(bank);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
  portfolioValues(leagueID, userID);
});

stockRouter.get('/portfolio/:userID', async (req, res) => {
  const { userID } = req.params;
  await Stock_user.findAll({
    where: {
      id_user: userID
    }
  })
    .then((arrayOfPortfolios) => {
      const response = [];
      arrayOfPortfolios.map((portfolio) => {
        const detailedInfo = { ...portfolio.dataValues };
        Stock.findByPk(portfolio.dataValues.id_stock)
          .then((stock) => {
            detailedInfo.stock = { ...stock.dataValues };
            response.push(detailedInfo);
          });
      });
      setTimeout(() => {
        res.send(response);
      }, 50);
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

stockRouter.get('/waivers/:leagueID', (req, res) => {
  const { leagueID } = req.params;
  const waivers = [];

  const updateWaivers = async () => {
    const grabStocks = updateStocks();
    const stocks = await grabStocks;
    const arrayStock = stocks
      .reduce((acc, stockInfoX) => acc
        .concat(Object.values(stockInfoX)), []);

    const mapUpdate = await Promise.all(arrayStock.map(async (stock) => {
      if (stock.quote) {
        await Stock.update({
          current_price_per_share: Math.round(stock.quote.latestPrice * 100),
          company_name: stock.quote.companyName
        },
        {
          where: {
            ticker: stock.quote.symbol
          }
        }).then((data) => data)
          .catch((err) => console.warn(err));
      }
    }));

    const findStocksAgain = new Promise((resolve) => {
      Stock.findAll({
        where: {
          current_price_per_share: {
            [Op.ne]: null
          }
        }
      })
        .then((allStocks) => {
          Stock_user.findAll({
            where: {
              id_league: leagueID
            }
          })
            .then((port) => {
              allStocks.map((indStock) => {
                const updatedStock = { ...indStock.dataValues };
                updatedStock.sharesRemaining = 100;
                port.map((indPortEntry) => {
                  if (indStock.id === indPortEntry.id_stock) {
                    updatedStock.sharesRemaining -= indPortEntry.portfolio.shares;
                  }
                });
                waivers.push(updatedStock);
              });
            })
            .then(() => {
              res.send(waivers);
              resolve(waivers);
            });
        })
        .catch((err) => {
          console.warn(err);
          res.status(500).send(err);
        });
    });
    await mapUpdate;
    await findStocksAgain;
  };
  updateWaivers();
});

stockRouter.post('/waivers', async (req, res) => {
  const {
    id_stock, id_league, id_user, portfolio
  } = req.body;
  const {
    shares, price_per_share_at_purchase
  } = portfolio;
  const cost = shares * price_per_share_at_purchase;
  const moneyAvailable = await checkMoneyAvailable(id_league, id_user);
  const sharesAvailable = checkSharesAvailable(id_stock, id_league, id_user);
  if (moneyAvailable < cost) {
    res.send('not enough money');
  }
  const newBankBalance = moneyAvailable - cost;
  if (sharesAvailable < shares) {
    res.send('not enough shares available');
  }
  Stock_user.findAll({
    where: {
      id_stock, id_league, id_user
    }
  })
    .then((entry) => {
      if (entry.length === 0) {
        Stock_user.create({
          id_stock, id_league, id_user, portfolio
        })
          .then(() => {
            League_user.update({
              bank_balance: newBankBalance
            },
            {
              where: {
                id_league, id_user
              }
            });
          })
          .then(() => {
            const data = {
              id_stock, id_league, id_user, portfolio
            };
            res.send(data);
          });
      } else {
        const currentShares = entry[0].dataValues.portfolio.shares;
        const updatedPriceperShare = ((shares * price_per_share_at_purchase)
          + (currentShares * entry[0].dataValues.portfolio.price_per_share_at_purchase))
          / (currentShares + shares);
        const updatedPortfolio = {
          shares: currentShares + shares,
          price_per_share_at_purchase: updatedPriceperShare
        };
        League_user.update({
          bank_balance: newBankBalance
        },
        {
          where: {
            id_league, id_user
          }
        })
          .then(() => {
            Stock_user.update({ portfolio: updatedPortfolio },
              {
                where: {
                  id_league, id_user, id_stock
                }
              })
              .then(() => {
                const data = {
                  id_stock, id_league, id_user, portfolio: updatedPortfolio
                };
                res.send(data);
              })
              .then(() => {
                Stock_user.destroy({
                  where: {
                    id_stock,
                    id_league,
                    id_user,
                    portfolio: {
                      shares: 0
                    }
                  }
                });
              });
          }).then((response) => response)
          .catch(() => res.sendStatus(404));
      }
    })
    .catch((err) => {
      console.warn(err);
      res.status(500).send(err);
    });
});

module.exports = {
  stockRouter
};
