function logger(file) {
  var logfile = file;
  var eol = '\n';
  var separator = ' - ';
  var levels = {DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN',
                ERROR: 'ERROR', CRITICAL: 'CRITICAL'};

  function appendFile(message) {
    var f = require('fs').open(logfile, 'a');
    f.write(message);
    f.close();
  }

  function log(time, level, process, section, message) {
    var logEntry = '';
    var logLevel = levels[level];
    var timestamp;
    if (typeof time === 'number' & time > 0) {
      timestamp = time;
    } else {
      timestamp = 'Error getting timestamp';
    }

    logEntry = timestamp + separator + logLevel + separator + process +
                separator + section + separator + message + eol;

    appendFile(logEntry);
  }
  return {
    log: log
  };
}
module.exports = logger;
