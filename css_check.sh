#!/bin/bash
LOGPATH=/var/log/css_check.log

/usr/bin/phantomjs css_check.js http://elifesciences.org/content/3/e04120 $LOGPATH .page-title font-family "'Avenir LT W01 85 Heavy', sans-serif" head false
