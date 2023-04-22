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
      message: "task info is malformed please provide all the properties",
    };
  }
}

module.exports = validator;
