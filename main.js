/* Disable return key submit */
$(document).on("keypress", "form", function(event) {
    return event.keyCode != 13;
});

/* Datetime picker */
$(function () {
    $('input[name="datetimes"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        startDate: moment().startOf('hour'),
        rendDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'M/DD/YY hh:mm A'
        }
    }, function (start, end, label) {
        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    });
});

/* MongoDB */
const client = stitch.Stitch.initializeDefaultAppClient('dashowl-vibbp');
const mongodb = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas');
const db = mongodb.db('dashowl');

function displayMetadata() {
    var list = []
    db.collection('metadata')
        .find({}, {
            limit: 1000
        })
        .asArray()
        .then(docs => {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                list.push([doc.location, doc.time, doc.time])
            }
        })
        // .then(extendTable('mytablecontent', list))
}

function displayMetadataOnLoad() {
    client.auth
        .loginWithCredential(new stitch.AnonymousCredential())
        .then(search)
        .catch(console.error);
}

function addMetadata() {
    const newMetadata = document.getElementById('new_metadata');
    console.log('add metadata', client.auth.user.id)
    db.collection('metadata')
        .insertOne({
            owner_id: client.auth.user.id,
            metadata: newMetadata.value
        })
        .then(displayMetadata);
    newMetadata.value = '';
}

/* Google Maps Autocomplete */
var autocomplete;
var lat;
var lon;
function initAutocomplete() {
    var input = document.getElementById('location-in');
    autocomplete = new google.maps.places.Autocomplete(input, {ypes: ['geocode']});

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'name']);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        lat = getLat(place);
        lon = getLon(place);
    });
}

function getLat(place) {
    return place.geometry.location.lat();
}

function getLon(place) {
    return place.geometry.location.lng();
}

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

var dict
/* Search */
function search() {
    dict = {};

    var time = document.getElementById('date-in').value;
    var datetime = new Date(time);
    var aheadTime = new Date(datetime);
    aheadTime.setHours(aheadTime.getHours() + 1);
    var behindTime = new Date(datetime);
    behindTime.setHours(behindTime.getHours() - 1);

    // console.log(lat-0.007246376812);
    // console.log(lat+0.007246376812);
    // console.log(lon-0.007246376812);
    // console.log(lon+0.007246376812);
    // console.log(behindTime.toISOString());
    // console.log(aheadTime.toISOString());

    db.collection('metadata')
        .find({ lat: { $gt: lat-0.007246376812, $lt: lat+0.007246376812 }, lon: { $gt: lon-0.007246376812, $lt: lon+0.007246376812 }, time: {$gte: behindTime.toISOString(),$lte: aheadTime.toISOString()}}, {
            limit: 1000
        })
        .asArray()
        .then(docs => {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i];
                var tablecontents = "";
                tablecontents += "<tr>";

                tablecontents += "<td>(" + doc.lat + "," + doc.lon + ")</td>";

                var dt = new Date(doc.time);
                tablecontents += "<td>" + dt.toDateString() + "</td>";
                tablecontents += "<td>" + dt.toLocaleTimeString() + "</td>";

                // dict[doc.hash] =[doc.high_beam, doc.headlamp, doc.windshield_wiper];
                // console.log(dict[doc.hash]);

                var accel = [];
                doc.accelerator.forEach(function(entry) {
                    accel.push(entry);
                });

                var brake = [];
                doc.brake.forEach(function(entry) {
                    brake.push(entry);
                });

                // tablecontents += "<td><button class=\"btn btn-primary pink-background\" onclick=\"openPopup()\");\">Data</button></td>";
                // tablecontents += "<td><button class=\"btn btn-primary pink-background\" onclick=\"onVideoClick(\'" + getVideoURLFromHash(doc.hash) +  "\');\">Data</button></td>";
                tablecontents += "<td><button class=\"btn btn-primary pink-background\" onclick=\"onVideoClick(\'" + getVideoURLFromHash(doc.hash) + "\', \'" + doc.high_beam + "\', \'" + doc.headlamp + "\', \'" + doc.windshield_wiper + "\', [" + accel + "], [" + brake + "]);\">Data</button></td>";
                console.log("<td><button class=\"btn btn-primary pink-background\" onclick=\"onVideoClick(\'" + getVideoURLFromHash(doc.hash) + "\', \'" + doc.high_beam + "\', \'" + doc.headlamp + "\', \'" + doc.windshield_wiper + "\', [" + accel + "], [" + brake + "]);\">Data</button></td>");
                // console.log("<td><button class=\"btn btn-primary pink-background\" onclick=\"onVideoClick(\'" + getVideoURLFromHash(doc.hash) + "\', \'" + doc.hash + "\');\">Data</button></td>");
                // console.log("<td><button class=\"btn btn-primary pink-background\" onclick=\"onVideoClick(\'" + getVideoURLFromHash(doc.hash) + "," + doc.hash + "\');\">Data</button></td>");
                tablecontents += "</tr>";
                document.getElementById("mytablecontent").innerHTML += tablecontents;

            }
        })
    document.getElementById('table_id').scrollIntoView({behavior: 'smooth'});
}

function getVideoURLFromHash(hash) {
    return 'https://storage.googleapis.com/dashowl-test/' + hash;
}

function extendTable(tableID, rows) {
    var tablecontents = "";
    for (var i = 0; i < rows.length; i++) {
        tablecontents += "<tr>";
        for (var j = 0; j < rows[i].length; j++) {
            tablecontents += "<td>" + rows[i][j] + "</td>";
        }
        tablecontents += "</tr>";
    }
    document.getElementById(tableID).innerHTML += tablecontents;
}

$(document).ready( function () {
    $('video, audio').mediaelementplayer();
    document.getElementById('popup').style.visibility = false;
} );

function onVideoClick(theLink, high_beam, headlamp, windshield_wiper, accel, brake) {
    document.getElementById("car-statuses").innerHTML = "";
    document.getElementById("car-statuses").innerHTML += "<li>High Beam On: " + high_beam + "</li>";
    document.getElementById("car-statuses").innerHTML += "<li>Head Lamp On: " + headlamp + "</li>";
    document.getElementById("car-statuses").innerHTML += "<li>Windsheild Wipe On: " + windshield_wiper + "</li>";

    new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: {
            labels: [0,10,20,30,40,50,60,70,80,90,100],
            datasets: [{
                data: accel,
                label: "Acceleration",
                borderColor: "#3e95cd",
                fill: false
            }, {
                data: brake,
                label: "Breaking",
                borderColor: "#8e5ea2",
                fill: false
            }
            ]
        },
        options: {
            title: {
            display: true,
            text: 'Acceleration and Breaking Percentages (0-100%)'
            }
        }
    });

    document.getElementById("video_pop").innerHTML = "<video controls autoplay muted loop id=\"the_Video\"><source src=\""+theLink+"\"></video>";
    document.getElementById("video_pop").style.display="block";
    document.getElementById('video_pop').scrollIntoView({behavior: 'smooth'});
}

function onPopClick() {
//     document.getElementById("video_pop").style.display="none";
//     document.getElementById("video_pop").innerHTML = "";

}

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
