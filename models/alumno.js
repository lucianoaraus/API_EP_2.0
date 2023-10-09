"use strict";
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define(
    "alumno",
    {
      nombre: DataTypes.STRING,
      apellido: DataTypes.STRING,
      legajo: DataTypes.INTEGER,
      id_carrera: DataTypes.INTEGER,
    },
    {}
  );
  alumno.associate = function (models) {
    alumno.belongsTo(models.carrera, {
      as: "carrera-relacionada", // nombre de mi relacion
      foreignKey: "id_carrera", // campo con el que voy a igualar
    });
  };
  return alumno;
};
