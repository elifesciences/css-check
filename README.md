# CSS check

## Use case

CSS on your site is degrading unpredictably. You know what changes when it goes wrong, but you need to find out when that happens to help you track down the problem. You want to check things frequently (say every few minutes), and log every check. When things do fail, you want the option of being able to take a dump of part of the code on the page for future inspection.

## Prerequisites

+ phantomjs
+ a server to run it on in a CRON job

## Composition

+ css_check.js: the phantomjs script. Depends on logger.js
+ logger.js: a simple logger to record the result of invoking css_check.js. Logs according to the format specified at [https://github.com/elifesciences/logging-example](https://github.com/elifesciences/logging-example). Is a dependency of css_check.js
+ css_check.sh: a convenient way of invoking css_check.js. View it to learn from the examples it contains. There are examples of both passing and failing invocations. If you use this, make sure it's given execute permission on your server.

## Artefacts

+ Logs each execution to the specified logfile.
+ Optional code dump on failure of some/all of the HTML source for future inspection.

## Invocation

Ensure logger.js and css_check.js are in the same directory. css_check.js takes 5 mandatoy and 2 additional optional parameters:

```phantomjs css_check.js 1 2 3 4 5 [6 7]```

1. the URL to test
1. the path to which to log
1. the selector matching the element you wish to examine
1. the css property of this element you wish to example
1. the expected value of this css property
1. this parameter specifies a selector that, if the expected css property value is not found, identifies an element that will be dumped to a file for future inspection. It is dumped to the same directory as the log file, and has the filename pattern ```css_fail__sample_[timestamp-to-match-log-entry].html```
1. if 'true', the preceeding parameter's innerHTML will be dumped; any other value, or no value, will cause its outerHTML to be dumped.

Recommend storing the invocation(s) in a shell script and creating a CRON job to run that at a suitable periodicity.


