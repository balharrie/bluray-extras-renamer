# Blu-Ray Extras Renamer

## Problem

When ripping Blu-Rays for use in Plex it is hard to know which file is which extra. This tool provides some automation that tries to use the duration of the extras to map the file to the known length of an extra.

Note: There is no graceful handling of two extras with the same length...

## Pre-reqs

The tool leverages `ffprobe` to find the video durations. This will need to be in your path.

With Node and Npm installed, install the npm packages required using `npm install`.

## Usage

    npm: npm start --dir="<dir>" --url="<url>" --dryrun=true"

Examples

    npm start --dir="/Volumes/MakeMKV/The Dark Knight Rises Bonus Disc" --url="https://dvdcompare.net/comparisons/film.php?fid=21586" --dryRun=true

