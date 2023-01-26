#!/usr/bin/env node

// Import packages
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

// Use minimist process command line arguments
const args = minimist(process.argv.slice(2));

// Handle help command
if("h" in args) {
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
    process.exit(0);
}

// Parse latitude and longitude
let latitude = 0;
let longitude = 0;

console.log(args);

// Parse latitude using -n and -s arguments
if("n" in args && args["n"] != undefined) {
    latitude = args["n"];
}
else if("s" in args && args["s"] != undefined) {
    latitude = -args["s"];
}

// Parse longitude using -e and -w arguments
if("e" in args && args["e"] != undefined) {
    longitude = args["e"];
}
else if("w" in args && args["w"] != undefined) {
    longitude = -args["w"];
}

// Check to ensure that latitude and longitude are in the valid range
if(Math.abs(latitude) > 90) {
    console.log("Latitude must be in range");
    process.exit(1);
}
if(Math.abs(longitude) > 180) {
    console.log("Longitude must be in range");
    process.exit(1);
}

// Parse timezone
// Find timezone from system
let timezone = moment.tz.guess();

// If timezone argument is included, override timezome
if("t" in args) {
    timezone = args["t"];    
}



// Make request to the API
const request_url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(request_url);

// Get the data from the request
const data = await response.json();

// If JSON flag, print all JSON and exit.
if("j" in args) {
    console.log(data);
    process.exit(0);
}

const days = args["d"];

if (days == 0) {
    console.log("At location (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours today.\n");
} else if (days > 1) {
    console.log("At location (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours in " + days + " days.\n");
} else {
    console.log("At location (" + latitude + ", " + longitude + "), it will rain " + data["daily"]["precipitation_hours"][0] + " hours tomorrow.\n");
}

