const fs = require("fs");

module.exports = {
  logError(error, file, line, user, message, functionName) {
    const date = new Date();
    const dateFormat = date.toLocaleString();
    const text = `${dateFormat}
                    >> File: ${file}:${line}
                    >> User: ${user}
                    >> Message: ${message ? message : ""}
                    >> Error: ${error} at ${functionName}
-------------------------------------------------------------------------------------------------------------------------\n`;
    fs.appendFile("./logging/logFiles/errorLog.txt", text, function(err) {
      if (err) {
        return console.log(err);
      }
    });
  }
};
