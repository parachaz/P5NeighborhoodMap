/** Variable for the map.*/
var map;
/** Popup dialog box to display maker's description*/
var infoWindow = new google.maps.InfoWindow();
/** Variable to keep track of the selected marker on the map*/
var selectedMarker;

/**
 * Class to represent a marker on the map
 */
function MapMarker(id, title, lat, lng) {
    var self = this;
    self.id = id;
    self.title = title;
    self.description = ko.observable();
    self.selected = ko.observable(false);
    self.lat = lat;
    self.lng = lng;
    self.formatteID = ko.computed(function() {
        return self.id + ".\xA0";
    }, this);
    self.latLng = new google.maps.LatLng(lat, lng);
     self.iconColor = ko.observable("|FFF000|000000");
    self.icon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + id + self.iconColor();
    self.marker = new google.maps.Marker({
        position: self.latLng,
        title: title,
        /**  Use google API to put a sequence number on the marker.
         *  Marker will have the same number as the corresponding
         *  item on the attraction list*/
        icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + id + "|FF0000|000000"

    });
    self.marker.setMap(map);

    /**
     Register click event for each marker.
     We will display Marker's id,title and description
     */
    google.maps.event.addListener(self.marker, 'click', function () {
        if (self.selected() === true) {
            infoWindow.close();
            self.selected(false);
            return;
        }
        if (selectedMarker) {
            selectedMarker.selected(false);
        }

        self.selected(true);
        selectedMarker = self;
        infoWindow.setContent('<h2>' + self.id + ". " + self.title + '</h2>' + self.description());
        infoWindow.open(map, this);
        map.panTo(self.marker.position);
    });

    self.openInfoWindow = function () {
        google.maps.event.trigger(self.marker, 'click');

    };
    google.maps.event.addListener(infoWindow, 'closeclick', function () {
        self.selected(false);

    });
}


/** 
 * 
 * @returns {undefined}ViewModel for the screen.
 */
function MapMarkerViewModel() {

    var self = this;
    self.markers = ko.observableArray();
    // load wikipedia data
    self.loadMarkerDecription = function (marker) {
        /**
         * Call Wikipedia API only if we haven't called it for this marker earlier.
         */
        if (typeof (marker.description()) === 'undefined') {
            wikiURL = 'http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=' + marker.lat + '&lng=' + marker.lng + '&username=parachaz&style=full';

            $.ajax({
                url: wikiURL,
                dataType: 'jsonp',
                success: function (response) {
                    marker.description(response.geonames[0].summary);
                }
            });
        }

        if (marker.description()) {
            marker.openInfoWindow();
        }
    };
    /**Read list of places from JSON data*/
    $.getJSON("js/mapMarkers.json", function (data) {
        var id = 1;
        var arr = $.map(data, function (el) {
            return el;
        });
        for (var i = 0; i < arr.length; i++) {
            var marker = new MapMarker(id++, arr[i].title, arr[i].lat, arr[i].lng);
            self.markers.push(marker);
        }
    });
    self.map = map;
    self.searchField = ko.observable("");

    /**
     * Filter attractions based on the search stirng.
     * 
     * @param {type} mapMarker
     * @returns {Boolean}
     */
    self.filterMarkers = function (mapMarker) {
        var markerMatched = false;
        /**Search for the string anywhere in the title  using regex*/
        var pattern = new RegExp(self.searchField(), "i");
        var title = mapMarker.title;
        var titleMatch = pattern.test(title);
        if (!titleMatch) {
            mapMarker.marker.setMap(null);
        } else {
            mapMarker.marker.setMap(map);
            markerMatched = true;
        }
        return markerMatched;

    };

    /** 
     * Return styling class for the selected marker
     * @param {type} marker
     * @returns {String}
     */
    self.styling = function (marker) {
        if (marker.selected() === true) {
            return 'selected';
        }
        else {
            return '';
        }
    };
    google.maps.event.addListener(map, 'click', function () {
        infoWindow.close();
        console.log(self.markers().length);
        for (var i = 0; i < self.markers().length; i++) {
            self.markers()[i].selected(false);
        }
    });
}

/** Intialize the map with Time Square location */

function initializeMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.759094, -73.985136),
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
}

$(document).ready(function () {
    /* Use Offline to check for internet connection */
    var run = function () {
        if (Offline.state === 'up') {
            Offline.check();
        }

    };
    initializeMap();
    ko.applyBindings(new MapMarkerViewModel());
    setInterval(run, 5000);
});