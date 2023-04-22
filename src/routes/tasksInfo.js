const tasksRoutes = require("express").Router();
const taskData = require("../tasks.json");
const validator = require("../helpers/validator");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const getId = require("../helpers/idGenerator");

tasksRoutes.use(bodyParser.urlencoded({ extended: false }));
tasksRoutes.use(bodyParser.json());

tasksRoutes.post("/", (req, res) => {
  const taskDetails = req.body;
  const writePath = path.join(__dirname, "..", "tasks.json");
  const validationResult = validator.validateTaskInfo(taskDetails, taskData);
  if (validationResult.status) {
    const taskDetailsWithId = { id: getId(), taskDetails };
    const taskDataModified = JSON.parse(JSON.stringify(taskData));
    taskDataModified.task.push(taskDetailsWithId);
    fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json(taskDetailsWithId);
  } else {
    res.status(400);
    res.json(validationResult);
  }
});

tasksRoutes.get("/", (req, res) => {
  res.status(200);
  res.send(taskData);
});

tasksRoutes.get("/:taskId", (req, res) => {
  const retrievedTask = taskData.task;
  const taskIdPassed = req.params.taskId;
  const result = retrievedTask.filter((val) => val.id == taskIdPassed);

  res.status(200);
  res.send(result);
});

module.exports = tasksRoutes;
