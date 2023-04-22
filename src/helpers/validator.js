class validator {
  static validateTaskInfo(taskInfo, taskData) {
    if (
      taskInfo.hasOwnProperty("title") &&
      taskInfo.hasOwnProperty("description") &&
      taskInfo.hasOwnProperty("isComplete")
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
