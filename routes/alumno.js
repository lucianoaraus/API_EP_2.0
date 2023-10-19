const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.alumno
    .findAll({
      attributes: ["id", "nombre", "apellido", "legajo", "id_carrera"],
      incluide: [
        {
          as: "carrera-relacionada",
          model: models.carrera,
          attributes: ["id", "nombre"],
        },
      ],
    })
    .then((alumnos) => res.send(alumnos))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.alumno
    .create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      legajo: req.body.legajo,
      id_carrera: req.body.id_carrera,
    })
    .then((alumno) =>
      res.status(201).send({
        id: alumno.id,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        legajo: alumno.legajo,
        id_carrera: alumno.id_carrera,
      })
    )
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otro alumno con el mismo nombre");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre", "apellido", "legajo", "id_carrera"],
      where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: (alumno) => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .update(
        {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          legajo: req.body.legajo,
          id_carrera: req.body.id_carrera,
        },
        { fields: ["nombre", "apellido", "legajo", "id_carrera"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res
            .status(400)
            .send("Bad request: existe otro alumno con el mismo nombre");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findalumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
