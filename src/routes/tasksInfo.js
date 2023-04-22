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
  let taskDetails = req.body;
  const validationResult = validator.validateTaskInfo(taskDetails, taskData);
  if (validationResult.status) {
    const id = getId();
    taskDetails = { ...taskDetails, createdOn: new Date().toISOString() };
    const taskDataModified = JSON.parse(JSON.stringify(taskData));
    taskDataModified.task[id] = taskDetails;
    const taskDetailsWithId = { id, ...taskDetails };
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
    const retrievedTaskDict = taskData.task;
    const taskId = req.params.taskId;
    if (!retrievedTaskDict.hasOwnProperty(taskId)) {
      return res.status(404).json({ message: "Cannot find task" });
    }
    req.task = retrievedTaskDict[taskId];
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}

tasksRoutes.get("/", (req, res) => {
  if (req.query.hasOwnProperty("isComplete")) {
    const filtered = {};
    for (const [key, value] of Object.entries(taskData.task)) {
      if (value.isComplete.toString() === req.query.isComplete) {
        filtered[key] = value;
        console.log("macthed");
      }
    }
    res.status(200);
    res.send(filtered);
  } else {
    res.status(200);
    res.send(taskData.task);
  }
});

tasksRoutes.get("/:taskId", getTaskById, (req, res) => {
  res.status(200);
  res.send(req.task);
});

tasksRoutes.delete("/:taskId", getTaskById, (req, res) => {
  const taskDataModified = JSON.parse(JSON.stringify(taskData));
  delete taskDataModified.task[req.params.taskId];
  fs.writeFileSync(WRITE_PATH, JSON.stringify(taskDataModified), {
    encoding: "utf8",
    flag: "w",
  });

  res.status(200);
  res.send(taskDataModified);
});

tasksRoutes.put("/:taskId", getTaskById, (req, res) => {
  const validationResult = validator.validateTaskInfo(req.body, taskData);
  if (validationResult.status) {
    const taskDataModified = JSON.parse(JSON.stringify(taskData));
    const newTaskDetails = { ...req.task, ...req.body };
    taskDataModified.task[req.params.taskId] = newTaskDetails;
    const newTaskDetailsWithId = { id: req.params.taskId, ...newTaskDetails };
    fs.writeFileSync(WRITE_PATH, JSON.stringify(taskDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json(newTaskDetailsWithId);
  } else {
    res.status(400);
    res.json(validationResult);
  }
});
module.exports = tasksRoutes;
