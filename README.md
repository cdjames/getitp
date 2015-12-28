# GetItp

A command line program to gather search data from `itp.ne.jp` and format it into a `.csv` file.

## Requirements

Requires [`casper.js`](http://casperjs.org), which requires [`phantom.js`](http://phantomjs.org). Download and install based on the instructions at the previous links. This script assumes both are in `usr/local/bin`.

## Install

Install [`casper.js`](http://casperjs.org) and [`phantom.js`](http://phantomjs.org) to `/usr/local/bin`
Move or link `juushouLoop.js` to `/usr/local/lib/getitp/juushouLoop.js`.
Put `getitp` in your path (`/usr/local/bin`, `/opt/local/bin` on some systems).

## Usage

`getitp [-lod] どこ+何 filename` 
	option '-l' to display list of files (no search term or filename) 
	option '-o' to overwrite file 
	option '-d' to display contents of file (filename only)
Call `./getitp` with parameters from a terminal or put `getitp` somewhere in your path (`/usr/local/bin`, `/opt/local/bin` on some systems).
