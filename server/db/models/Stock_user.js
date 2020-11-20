module.exports = (sequelize, DataTypes) => {
  const Stock_user = sequelize.define('stock_user', {
    portfolio: {
      type: DataTypes.JSONB
    }
  }, {
    freezeTableName: true
  });

  Stock_user.associate = (models) => {
    Stock_user.belongsTo(models.League, {
      foreignKey: 'id_league'
    });
  };
  return Stock_user;
};
