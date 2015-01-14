 #!/bin/bash
 LOGPATH=WHERE_YOU_WANT_THE_LOGFILE

# should error with unable to find element under test
phantomjs css_check.js http://elifesciences.org/made-up-slug $LOGPATH .page-title font-family "'Avenir LT W01 85 Heavy', sans-serif" head false

# should error with bad css property value.
phantomjs css_check.js http://elifesciences.org/content/3/e04120 $LOGPATH .page-title font-family "MS Comic Sans" head false

# should error with bad css property value, and have an additional warning
# that the html sample to dump (when there's a css property error) is
# identified by a selector that doens't match.
phantomjs css_check.js http://elifesciences.org/content/3/e04120 $LOGPATH .page-title font-family "'MS Comic Sans" fake-selector false

# should be OK
# (Passing test means fake-selector ignored as selector
# in this position only used for identify the html to dump if there is a
# bad css property value.)
phantomjs css_check.js http://elifesciences.org/content/3/e04120 $LOGPATH .page-title font-family "'Avenir LT W01 85 Heavy', sans-serif" fake-selector false

# should be OK
phantomjs css_check.js http://elifesciences.org/content/3/e04120 $LOGPATH .page-title font-family "'Avenir LT W01 85 Heavy', sans-serif" head false