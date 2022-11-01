const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
var _ = require('lodash');
const axios = require("axios");
const apiKey = require("./apikey")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", function (req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
    postsArray: posts
  });
})

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  }
  posts.push(post);
  res.redirect("/");
})

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);
  posts.forEach(function (post) {
    if (requestedTitle === _.lowerCase(post.title)) {
      res.render("post", {
        title: post.title,
        content: post.content
      })
    }
  })
})

app.get("/wheather", function (req, res) {
  const options = {
    method: 'GET',
    url: 'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
    headers: {
      'X-RapidAPI-Key': apiKey.api.localisationKey,
      'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(response.data.city);
    const cityName = response.data.city;
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=' + unit + '&appid=' + apiKey.api.weatherKey;

    https.get(url, function (response) {
      console.log('statusCode: ', response.statusCode);
      response.on('data', function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const weatherIcon = weatherData.weather[0].icon;
        const urlIcon = 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png';
        res.render("wheather", {
          city: cityName,
          temperature: temp,
          weatherDescription: weatherDescription,
          weatherIcon: weatherIcon,
          urlIcon: urlIcon
        });
      })
    })
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});


