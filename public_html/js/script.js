//Variable for the map.
var map;

// Class to represent a marker on the map
function MapMarker(id, title, lat, lng, description, category) {
    var self = this;
    self.id = id;
    self.title = title;
    self.lat = lat;
    self.lng = lng;
    self.latLng = new google.maps.LatLng(lat, lng);
    self.description = description;
    self.category = category;
    self.icon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + id + "|FF0000|000000";
    self.marker = new google.maps.Marker({
        position: self.latLng,
        title: title,
        /*  Use google API to put a sequence number on the marker.
         *  Marker will have the same number as the corresponding
         *  item on the attraction list*/
        icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + id + "|FF0000|000000"
    });
    self.marker.setMap(map);
}



//ViewModel for the screen.
function MapMarkerViewModel() {
    var self = this;
    self.markers = ko.observableArray();
    $.getJSON("js/mapMarkers.json", function (data) {
        var id = 1;
        var arr = $.map(data, function (el) {
            return el;
        });
        for (var i = 0; i < arr.length; i++) {
            var marker = new MapMarker(id++, arr[i].title, arr[i].lat, arr[i].lng, arr[i].description);
            self.markers.push(marker);
        }
        ;
    });

    self.map = map;
    self.searchField = ko.observable("");
    
    //Filter attractions based on the search stirng.
    self.filterMarkers = function (mapMarker) {
        var markerMatched = false;
        //Search for the string anywhere in the title  using regex
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

}
function initializeMap() {
    //Intialize the map with Time Square location
    var mapProp = {
        center: new google.maps.LatLng(40.759094, -73.985136),
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
}

$(document).ready(function () {
    initializeMap();
    
    ko.applyBindings(new MapMarkerViewModel());

});


