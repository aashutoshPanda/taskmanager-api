class validator {
  static validatePriority(taskInfo) {
    if (taskInfo.hasOwnProperty("priority")) {
      const passedPriority = taskInfo.priority;
      if (!typeof passedPriority === "string") {
        return false;
      }
      const ALLOWED_PRIORITY = ["LOW", "MEDIUM", "HIGH"];
      return ALLOWED_PRIORITY.includes(passedPriority);
    } else {
      return true;
    }
  }
  static validateTaskInfo(taskInfo, taskData) {
    if (
      taskInfo.hasOwnProperty("title") &&
      taskInfo.hasOwnProperty("description") &&
      taskInfo.hasOwnProperty("isComplete") &&
      typeof taskInfo.title === "string" &&
      typeof taskInfo.description === "string" &&
      typeof taskInfo.isComplete === "boolean" &&
      this.validatePriority(taskInfo)
    ) {
      return {
        status: true,
        message: "task has been added",
      };
    }
    return {
      status: false,
      message: "task info is malformed",
    };
  }

  static validateTaskInfoUpdate(taskInfo, taskData) {
    if (taskInfo.title) {
      if (!taskInfo.title === "string") {
        return {
          status: false,
          message: "title should be a string",
        };
      }
    }
    if (taskInfo.description) {
      if (!taskInfo.description === "string") {
        return {
          status: false,
          message: "description should be a string",
        };
      }
    }
    if (taskInfo.isComplete) {
      if (!taskInfo.isComplete === "boolean") {
        return {
          status: false,
          message: "isComplete should be a boolean",
        };
      }
    }

    if (taskInfo.priority) {
      if (!this.validatePriority(taskInfo)) {
        return {
          status: true,
          message: "Provided priority is invalid",
        };
      }
    }

    return {
      status: true,
      message: "task info is malformed please provide all the properties",
    };
  }
}

module.exports = validator;
