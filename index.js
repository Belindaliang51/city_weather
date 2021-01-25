const { json, response } = require("express");
const express = require("express");
const https = require('https');   //request from the 3rd party server
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const key = require('./key');

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    // console.log("server is running on" + port)
    res.sendFile(__dirname + "/index.html")
     
});

app.post("/", (req, res)=>{
    const cityName = req.body.cityName;
    //console.log(cityName)
    const baseURL = "https://api.openweathermap.org/data/2.5/weather?q="
    const appID = key.appID;
    const units = "metric"
    const url= baseURL + cityName +"&appid="+ appID + "&units="+units;
    
    https.get(url, (response)=>{
        console.log('statusCode:', response.statusCode);

        response.on('data',(d)=>{
            const weather = JSON.parse(d);
            const temp = weather.main.temp;
            const weatherDescription = weather.weather[0].description;
            const icon = weather.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"
            
            res.write("<h1>The temperature in "+cityName +" is "+temp+" degree</h1>")
            res.write("<p>The weather now is "+ weatherDescription +"</p>")
            res.write("<img src=" +imgURL+ ">");
            res.send()
        })
    }) 
})


app.listen(port, ()=>{
    console.log("app is listing at port 3000")
});