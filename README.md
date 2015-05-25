                             Udacity Nanodegree Project 5

What is it?
-----------
Udacity Nanodegree Project 5 requires to use JavaScript design patterns and
third-party APIs to display points of intereset on a map.

Author:
-------
Zaheer Paracha

Project Components:
-------------------
A web application is developed for this project. The projet consits 
of following components.
    1. index.html: Web page to display the map and markers
    2. script.js: JavaScript code that implements project functionality
       using ModelModelViewController (MMVC) design pattern.
    3. Knockout.js: JavaSript library for MMVC
    4. knockout-mapping.js: JavaScript library to custom mappings.
    5. googleapi.js: Google map APIs.
    6. offline.js: JavaScript library to check internet connection.
    7. jquery-min.js: jQuery JS library
    8. mapMarkers.json. Text file that contains name of few landmarks in 
       JSON format. This data is used to build the list of markers for 
       the view (index.html)
    9. gulpfile.js. JS Gulp task file, to automate commonly performed tasks, 
        for e.g.; Lint JS, minify and uglify.

Application Design:
------------------
This applicaiton is developed using Javascript MVVC model using knockout.js 
libray. index.html contains the "View" part of the project. It displays a dynamically generated list of few places in New York city and a map of the
area. A JSON file provides the name of the markers for the list.

script.js contains the JavaScript functions to call Wikipedia API to get
the details for selected landmark. It then uses Google Map API to build the map 
and add markers to the map. 
The application uses Knockout.js to dynamically add attraction list and the map 
on the view. Using knockout bindings the view is dynamically updated when the
user clicks on a map marker or the name in the list.
index.html also contains search box, that can be used to filter (search for) a specific location from the given list. Search is implemented using RegEx and is triggered by Knockout binding.

Glup.js is used to automate commonly performe tasks.

References:
-----------
Following resources as reference while developing this project
1. https://developers.google.com/maps/documentation/
2. http://www.mediawiki.org/wiki/API%3aMain_page
3. http://gulpjs.com/
4. https://www.gavick.com/blog/detect-offline-browser 
5. http://usejsdoc.org/
6. http://www.w3schools.com/
7. jsonlint.com
8. stackoverflow.com

-------------------------------------------------------------------------------
Copyright (C) 2015 zParacha.com.
