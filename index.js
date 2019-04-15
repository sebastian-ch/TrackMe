const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const Request = require('request')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use("/script", express.static(__dirname + "/script"));
app.use("/data", express.static(__dirname + "/data"));
app.use("/style", express.static(__dirname + "/style"));


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


var url = 'http://www.followmee.com/api/tracks.aspx?key=6ff60367d512c2e80cffb15a08c997a9&username=sebastianch&output=json&function=currentforalldevices';

function getMyData() {

    Request.get(url, (err, resp, body) => {
        if (err) {
            console.log(err)
        }

        //console.log(body.Data)
        processData(JSON.parse(body))
    })
}


function processData(data) {
    var nData = data["Data"][0];
    saveToCsv(nData)

}

function saveToCsv(nData) {

    //console.log(nData)
    var csv = nData.Date.toString() + "," +
        nData.Latitude.toString() + "," +
        nData.Longitude.toString() + "," +
        nData["Altitude(ft)"].toString() + "," +
        nData.Accuracy.toString() + '\r\n';


    fs.appendFile('data/file.csv', csv, function (err) {
        if (err) throw err;
        console.log('file updated!');
    });

}

app.get('/', function (req, res) {

    getMyData();
    setInterval(getMyData, 200000)
    res.render('index.ejs');
});