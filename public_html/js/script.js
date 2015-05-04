//Intialize the map with Time Square location
var myLatlng = new google.maps.LatLng(40.759094, -73.985136);
var map;
//An array of all markers. We will use this array to hide/show a marker based on search key
var markers = [];
var $attacionsList;
var $searchBox;
function initialize() {
    var mapProp = {
        center: myLatlng,
        zoom: 12
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);

}
google.maps.event.addDomListener(window, 'load', initialize);
$(function () {
    var seq = 0;
    $attacionsList = $('#attacionsList');
    $searchBox = $("#search");
    var infoWindow = new google.maps.InfoWindow;

    $.getJSON("js/mapMarkers.json", function (attraction) {
        $.each(attraction, function (key, data) {
            seq++;
            var latLng = new google.maps.LatLng(data.lat, data.lng);
            // Creating a marker and putting it on the map
            var marker = new google.maps.Marker({
                position: latLng,
                title: data.title,
                /*  Use google API to put a sequence number on the marker.
                 *  Marker will have the same number as the corresponding
                 *  item on the attraction list*/
                icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + seq + "|FF0000|000000"
            });
            /*
             * Add the title of this marker to the attraction list.
             * We will use the title as the id for each item, this id will be used to hide/show 
             * a list item based on the search criteria.
             */

            marker.setMap(map);
            //Add marker to the markers array. We will use this array to hide/show a marker based on search key
            markers.push(marker);
            //Create the string to be used to trigger click event when user clicks on the link in the list
            var str1 = "href='javascript:google.maps.event.trigger(markers[" + (seq - 1) + "]";
            var str2 = ",&#39;click&#39;);'>";
            var str = str1.concat(str2);
            //Add the atration to the list
            $attacionsList.append("<li class='markerLink' id = '" + data.title.replace(/\s+/g, '') + "' title='"
                    + data.description + "'><a  id='" + data.title.replace(/\s+/g, '') +
                    "' " + str + data.title + "</a></li>");
            //Register click event each marker.
            //We will display Marker title and description
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h3>' + marker.title + '</h3><br>' + data.description);
                infoWindow.open(map, marker);
            });

            
            google.maps.event.addListener(map, 'click', function () {
                infoWindow.close();
            });
        });
    });
    
    //handle the input in the search field
    $searchBox.keyup(function () {
        var searchKey = $searchBox.val();
        //Search for the string anywhere in the title  using regex
        var pattern = new RegExp(searchKey, "i");
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            var title = marker["title"];
            var titleMatch = pattern.test(title);
            var id = '#' + title.replace(/\s+/g, '');

            if (!titleMatch) {
                marker.setMap(null);
                $(id).hide();
            } else {
                marker.setMap(map);
                $(id).show();
            }

        }
    });
    
});
       