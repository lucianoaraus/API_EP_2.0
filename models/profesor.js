"use strict";
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define(
    "profesor",
    {
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING,
      legajo: DataTypes.INTEGER,
    },
    {}
  );
  profesor.associate = function (models) {
    // associations can be defined here
  };
  return profesor;
};
