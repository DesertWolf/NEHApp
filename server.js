/**
 * Created by jamesf on 7/8/14.
 */
var express = require('express');
var app = express();
var hbs = require('hbs');
var util = require('util');
var bodyParser = require('body-parser');
var geocoder = require('geocoder');
var Parse = require('parse').Parse;
var appKey = "LZ2tB5MBWI5vlyfSVGGWdBJUq8NJznafCU3jJwrV";
var jsKey = "OolOrXs9MnHSZf86X4yQ0ZLEXfflpczQCRnANbIS";
Parse.initialize(appKey,jsKey);


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'html');
app.engine('html', hbs.__express);


app.get('/', function(request, response){
    var welcome = "Our Express App with Templates";

    var products = [
        {"id":1, "name":"Apple", "price":4.99},
        {"id":2, "name":"Pear", "price":3.99},
        {"id":3, "name":"Orange", "price":5.99}
    ];
    response.render('index', {title:welcome, products:products});
});

app.get('/about', function(request, response){
    response.render('about');
});

app.get('/product/:id', function(request, response) {
    var id = request.params.id;
    response.render('product', {title: 'Product #'+id});
});

app.get('/map', function(request, response) {


  response.render('map', {title: "Map Page"});
});

app.post('/map2', function(request, response) {
    var lat;
    var lng;
    var address = request.body.address;
    var distance = request.body.miles;
    var ClientGeolocation = Parse.Object.extend("ClientGeolocation");
    var clientGeolocation = new ClientGeolocation;
    var point = new Parse.GeoPoint();
    var clientsLoc;


   geocoder.geocode(address, function(err, data) {
            getClientsNear(data,showClients);


   });

    function getClientsNear(data, callback){
        if (data.status == 'OK') {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;

             var userGeoPoint = new Parse.GeoPoint({latitude: lat, longitude: lng});
            var query = new Parse.Query(ClientGeolocation);
            miles = distance;
            query.withinMiles('location', userGeoPoint, miles);
            query.find({
                success: function (placeObjects) {
                    console.log("Found " + placeObjects.length + " Clients " );
                    clientsLoc = JSON.stringify(placeObjects);
                    callback(clientsLoc);
                }, error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        }

    };

    function showClients() {


        console.log("here: " + clientsLoc);
        response.render('map2', {title: "Map 2 Data", clients: JSON.stringify(clientsLoc)});
    };

   // response.render('map2', {title: "Map No Data", });

})


app.get('/test', function(request, response) {

    var fs = require('fs')
    var myNumber = undefined

    function addOne(callback) {
        fs.readFile('number.txt', function doneReading(err, fileContents) {
            myNumber = 4;
            myNumber++
            callback()
        })
    }

    function logMyNumber() {
        console.log(myNumber)
    }

    addOne(logMyNumber)
    response.render('', {title: "Testing Page",});
})

app.listen(8124);
