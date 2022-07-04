$(document).ready(function () {
  var apiKey = "51cf29ba1bfca5fc3108cefcddf70638";
  cityArray = [];

  //("#current-Weather").hide();
  //$("#five-day-forecast").hide();
  $("#error-div").hide();

  function displayWeather(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&APPID=" +
      apiKey;
    var currentDate = moment()
      .calendar();

    $.ajax({
      url: queryURL,
      method: "GET",
      statusCode: {
        404: function () {
          $("#current-Weather").hide();
          $("#five-day-forecast").hide();
          $("#error-div").show();
        }
      }
    }).then(function (response) {
      $("#error-div").hide();
      $("#current-Weather").show();
      $("#five-day-forecast").show();
      console.log(queryURL);
      console.log(response)
      var tempM = (response.main.temp - 273.15)
      var tempC = Math.floor(tempM);

      $("#city").text(response.name);
      $("#currentDateAndTime").text(currentDate);
      $("#currentTempurature").html(`${tempC}&degC `);
      $("#currentHumidity").html(response.main.humidity + "%");
      $("#currentWindSpeed").html(response.wind.speed);
      $("#weather_image").attr(
        "src",
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      $("#description_weather").html(response.weather[0].description);
      var lon = response.coord.lon;
      var lat = response.coord.lat;
      // api key url for forescast
      uvURL =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon;
      $.ajax({
        url: uvURL,
        method: "GET"
      }).then(function (response) {
        console.log(response);
        var uvIndex = response.value;
        var uvColor = "";
        if (uvIndex < 3) {
          uvColor = "green";
        } else if (uvIndex < 6) {
          uvColor = "yellow";
        } else if (uvIndex < 8) {
          uvColor = "orange";
        } else if (uvIndex < 11) {
          uvColor = "red";
        } else {
          uvColor = "violet";
        }
        $("#currentUVIndex").html(uvIndex);
        $("#currentUVIndex").attr("style", "background-color: " + uvColor);
      });
    });
  }

  function displaySearchedCity(newCity) {
    $(".list-group-item-action").empty();
    for (var i = 0; i < cityArray.length; i++) {
      let listCities = $("<a href=#>");
      listCities.addClass("list-group-item");
      listCities.attr(cityArray[i]);
      listCities.text(cityArray[i]);
      $(".list-group-item-action").append(listCities);
    }
  }

  function fiveDayForecast(cityInput) {
    console.log(cityInput);
    var forecastURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      cityInput +
      "&APPID=" +
      apiKey;
    $.ajax({
      url: forecastURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      let day_number = 0;

      //iterate through the 40 weather data sets

      for (let i = 0; i < response.list.length; i++) {
        //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm

        if (response.list[i].dt_txt.split(" ")[1] == "15:00:00") {
          //if time of report is 3pm, populate text areas accordingly

          let day = response.list[i].dt_txt.split("-")[2].split(" ")[0];

          let month = response.list[i].dt_txt.split("-")[1];

          let year = response.list[i].dt_txt.split("-")[0];

          $("#" + day_number + "date").text(month + "/" + day + "/" + year);

          let tempMax = Math.round(
            ((response.list[i].main.temp_max - 273.15))
          );

          let tempMin = Math.round(
            ((response.list[i].main.temp_min - 273.15))
          );


          $("#" + day_number + "five_day_temp_max").text(
            "Max Temp: " + tempMax + String.fromCharCode(176) + "c"
          );

          $("#" + day_number + "five_day_temp_min").text(
            "Min Temp: " + tempMin + String.fromCharCode(176) + "c"
          );

          $("#" + day_number + "five_day_humidity").text(
            "Humidity: " + response.list[i].main.humidity + "%"
          );

          $("#" + day_number + "five_day_icon").attr(
            "src",
            "https://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png"
          );

          console.log(response.list[i].dt_txt.split("-"));

          console.log(day_number);

          console.log(tempMax);

          console.log(tempMax);

          day_number++;
        }
      }
    });
  }
  $("#searchBtn").on("click", function (event) {

    event.preventDefault();

    var cityInput = $(".cityText")
      .val()
      .trim();
    if (cityInput == '') {
      alert("Enter a city")
    }
    else {
      cityArray.push(cityInput);
      // clear input box
      $(".cityText").val("");

      $(".cityText").text(cityInput);

      displayWeather(cityInput);

      displaySearchedCity(cityInput);

      fiveDayForecast(cityInput);

      console.log(cityArray);
      localStorage.setItem("SearchedCity", JSON.stringify(cityArray));
    }
  });

  $(".list-group-item-action").on("click", ".list-group-item", function (event) {
    console.log(event.currentTarget.innerText);
    event.preventDefault();
    $(".cityText").text(event.currentTarget.innerText);
    displayWeather(event.currentTarget.innerText);
    fiveDayForecast(event.currentTarget.innerText);
  });
});
