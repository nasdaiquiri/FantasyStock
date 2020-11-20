module.exports = (sequelize, DataTypes) => {
  const League_user = sequelize.define('league_user', {
    bank_balance: {
      type: DataTypes.INTEGER
    },
    net_worth: {
      type: DataTypes.INTEGER
    },
    wins: {
      type: DataTypes.INTEGER
    },
    losses: {
      type: DataTypes.INTEGER
    },
    ties: {
      type: DataTypes.INTEGER
    },
    team_name: {
      type: DataTypes.STRING
    },
    team_logo: {
      type: DataTypes.STRING
    },
    portfolio_history: {
      type: DataTypes.JSONB
    }
  }, {
    freezeTableName: true
  });

  return League_user;
};
