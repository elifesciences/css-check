(function (window, document) {
  var system = require('system');
  var url = system.args[1];
  var logfile = system.args[2];
  var selectorElUnderTest = system.args[3];
  var cssProperty = system.args[4];
  var cssPropertyExpVal = system.args[5];
  var selectorHtmlToSave = system.args[6];
  var isInnerHTMLToSave = system.args[7] === 'true' ? true : false;
  var logger = require('./logger')(logfile);
  var page = require('webpage').create();

  function getCssPropertyActualValue(selector, cssProperty) {
    var propValue = page.evaluate(function (selector, cssProperty) {
      var element = document.querySelector(selector);
      var computedStyle = window.getComputedStyle(element);
      if (computedStyle) {
        return computedStyle.getPropertyValue(cssProperty);
      }
      return null;
    }, selector, cssProperty);
    return propValue;
  }

  function getHTMLToSave(selector, isInnerHTML) {
    var html = page.evaluate(function (selector, isInnerHTML) {
      if (document.querySelector(selector)) {
        if (isInnerHTML) {
          return document.querySelector(selector).innerHTML;
        }
        return document.querySelector(selector).outerHTML;
      }
      return null;
    }, selector, isInnerHTML);

    return html;
  }

  function saveSample(sample, filename) {
    var f = require('fs').open(filename, 'w');
    f.write(sample);
    f.close();
  }

  page.open(url, function(status) {
    var timestamp = Date.now();
    var logMsg;
    var logLevel;
    var logSource = 'css_check';
    var htmlToSave;
    var cssPropertyActualValue;

    if (status === "success") {
      cssPropertyActualValue = getCssPropertyActualValue(selectorElUnderTest,
                                                         cssProperty);
      // Selector for element under test doesn't match, or its prop val falsey.
      if (!cssPropertyActualValue) {
        logLevel = 'ERROR';
        logMsg = 'CSS check error at ' + url + ' Could not find element ';
        logMsg += 'under test, matching ' + selectorElUnderTest;
      } else

      // prop value found, but it's not the expected value
      if (cssPropertyActualValue !== cssPropertyExpVal) {
        logLevel = 'ERROR';
        logMsg = 'CSS check failure at ' + url + ' The ' + cssProperty + ' of ';
        logMsg += selectorElUnderTest + ' expected to be "' + cssPropertyExpVal;
        logMsg += '" but was actually "' + cssPropertyActualValue + '"';

        // If the css property value test fails, the user may specify a selector
        // for an element to dump to file for later inspection.
        if (selectorHtmlToSave) {
          htmlToSave = getHTMLToSave(selectorHtmlToSave, isInnerHTMLToSave);

          if (htmlToSave) {
            saveSample(htmlToSave, 'css_fail__sample_' + timestamp + '.html');
          } else {
            logMsg += ' Additional CSS check warning at ' + url + ' Could not find';
            logMsg += ' element matching ' + selectorHtmlToSave + ', the selector';
            logMsg += ' of the html sample requested to be saved ';
          }
        }

      } else {
          logLevel = 'INFO';
          logMsg = 'OK';
      }
    } else {
      logLevel = 'ERROR';
      logMsg = 'CSS check failure: Unable to load page to check: ' + url;
    }
    logger.log(timestamp, logLevel, logSource, logSource, logMsg);
    phantom.exit(status);
  });
}(window, document));