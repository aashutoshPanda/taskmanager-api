const tasksRoutes = require("express").Router();
const taskData = require("../tasks.json");
const validator = require("../helpers/validator");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const getId = require("../helpers/idGenerator");

tasksRoutes.use(bodyParser.urlencoded({ extended: false }));
tasksRoutes.use(bodyParser.json());

const WRITE_PATH = path.join(__dirname, "..", "tasks.json");

tasksRoutes.post("/", (req, res) => {
  const taskDetails = req.body;
  const validationResult = validator.validateTaskInfo(taskDetails, taskData);
  if (validationResult.status) {
    const taskDetailsWithId = { id: getId(), taskDetails };
    const taskDataModified = JSON.parse(JSON.stringify(taskData));
    taskDataModified.task.push(taskDetailsWithId);
    fs.writeFileSync(WRITE_PATH, JSON.stringify(taskDataModified), {
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

function getTaskById(req, res, next) {
  const id = req.params.id;
  try {
    const retrievedTask = taskData.task;
    const taskIdPassed = req.params.taskId;
    const taskList = retrievedTask.filter((val) => val.id == taskIdPassed);
    if (taskList.length === 0) {
      return res.status(404).json({ message: "Cannot find task" });
    }
    req.task = taskList[0];
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

tasksRoutes.get("/", (req, res) => {
  res.status(200);
  res.send(taskData);
});

tasksRoutes.get("/:taskId", getTaskById, (req, res) => {
  res.status(200);
  res.send(req.task);
});

tasksRoutes.delete("/:taskId", getTaskById, (req, res) => {
  const taskDataModified = JSON.parse(JSON.stringify(taskData));
  console.log(taskDataModified);
  const filteredTasks = taskDataModified.task.filter(
    (val) => val.id !== req.task.id
  );
  taskDataModified.task = filteredTasks;
  fs.writeFileSync(WRITE_PATH, JSON.stringify(taskDataModified), {
    encoding: "utf8",
    flag: "w",
  });

  res.status(200);
  res.send(filteredTasks);
});

module.exports = tasksRoutes;
