#!/usr/bin/env node

// Import packages
import moment from "moment-timezone";

// Get arguments from CLI
const [,, ... args] = process.argv

// Handle help command
if(args.includes("-h")) {
    console.log(
`
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.
`
    );
}



// Find timezone from system
const timezone = moment.tz.guess();

// Make request to the API
const request_url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(request_url);

