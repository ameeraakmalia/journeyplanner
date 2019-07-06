// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//

$.support.cors = true;
var latitude, longitude;
var stations = [];
var path, cash, cashless, TravelTime;
var size, dataPath;

async function onSuccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
}

var attraction = localStorage.getItem("destination");
navigator.geolocation.getCurrentPosition(onSuccess, onError);

//Untuk dapatkan latitude longitude untuk stations
$.ajax({
  type: "GET",
  dataType: "json",
  url: "https://api-journeyapp.herokuapp.com/getDetailStations",
  cache: false,
  success: function(data) {
    var size = Object.keys(data).length;
    for (var i = 0; i < size; i++) {
      if (data[i].Stations != "") {
        stations[i] = data[i];
      }
    }
  }
});

var arrDistance = {};
var min, index, from, to;

setTimeout(() => {
  size = Object.keys(stations).length;
  for (var i = 0; i < size; i++) {
    arrDistance[i] = calcDistance(
      parseFloat(stations[i].Lat),
      parseFloat(stations[i].Lng),
      latitude,
      longitude
    );
  }
  index = 0;
  min = arrDistance[0];

  //Nak cari distance paling pendek antara user dengan trains
  for (var i = 1; i < Object.keys(arrDistance).length; i++) {
    if (arrDistance[i] < min) {
      min = arrDistance[i];
      index = i;
    }
  }

  //Assign value station paling terdekat ke dalam var from
  from = stations[index].Stations;

  //Finding where is the attractions located
  for (var i = 0; i < Object.keys(stations).length; i++) {
    if (stations[i].NearestAttraction == attraction) {
      to = stations[i].Stations;
    }
  }

  //Get Path macam dalam navigation screen
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://api-journeyapp.herokuapp.com/getPath/" + from + "/" + to,
    success: function(data) {
      console.log(data);
      dataPath = data;
      size = Object.keys(dataPath).length;
    }
  });

  $("#nearestStation").show(3000);
  $("#nearestStation").append("<b>" + from + "</b>");
}, 3000);

setTimeout(() => {
  console.log(size);
  var children = document.getElementById("tempat-letak-table").children.length;
  while (children != 0) {
    var list = document.getElementById("tempat-letak-table");
    list.removeChild(list.childNodes[0]);
    children--;
  }

  for (i = 0; i < size; i++) {
    console.log(dataPath);
    path = dataPath[i].Path;
    cash = dataPath[i].Cash;
    cashless = dataPath[i].Cashless;
    TravelTime = dataPath[i].TravelTime;
    var table = document.createElement("table");

    var row1 = document.createElement("tr");
    var tr1td1 = document.createElement("td");
    var tr1td1Text = document.createTextNode("Path: ");
    tr1td1.appendChild(tr1td1Text);
    var tr1td2 = document.createElement("td");
    var tr1td2Text = document.createTextNode(path);
    tr1td2.appendChild(tr1td2Text);
    row1.appendChild(tr1td1);
    row1.appendChild(tr1td2);

    var row2 = document.createElement("tr");
    var tr2td1 = document.createElement("td");
    var tr2td1Text = document.createTextNode("Cash: ");
    tr2td1.appendChild(tr2td1Text);
    var tr2td2 = document.createElement("td");
    var tr2td2Text = document.createTextNode("RM " + cash);
    tr2td2.appendChild(tr2td2Text);
    row2.appendChild(tr2td1);
    row2.appendChild(tr2td2);

    var row3 = document.createElement("tr");
    var tr3td1 = document.createElement("td");
    var tr3td1Text = document.createTextNode("Cashless: ");
    tr3td1.appendChild(tr3td1Text);
    var tr3td2 = document.createElement("td");
    var tr3td2Text = document.createTextNode("RM " + cashless);
    tr3td2.appendChild(tr3td2Text);
    row3.appendChild(tr3td1);
    row3.appendChild(tr3td2);

    var row4 = document.createElement("tr");
    var tr4td1 = document.createElement("td");
    var tr4td1Text = document.createTextNode("TravelTime: ");
    tr4td1.appendChild(tr4td1Text);
    var tr4td2 = document.createElement("td");
    var tr4td2Text = document.createTextNode(TravelTime + " minutes");
    tr4td2.appendChild(tr4td2Text);
    row4.appendChild(tr4td1);
    row4.appendChild(tr4td2);

    var row5 = document.createElement("tr");
    var tr5td1 = document.createElement("td");
    var tr5td2 = document.createElement("td");

    var button = document.createElement("button");
    button.setAttribute("onClick", "showPath(" + i + ")");
    button.setAttribute("class", "btn btn-success btn-block");
    button.innerHTML = "Show Path !";
    tr5td2.appendChild(button);
    row5.appendChild(tr5td1);
    row5.appendChild(tr5td2);

    table.appendChild(row1);
    table.appendChild(row2);
    table.appendChild(row3);
    table.appendChild(row4);
    table.appendChild(row5);
    table.setAttribute("border", "2");
    table.setAttribute("align-items", "center");
    table.setAttribute("width", "100%");
    document.getElementById("tempat-letak-table").appendChild(table);
    var p = document.createElement("p");
    document.getElementById("tempat-letak-table").appendChild(p);
  }
  console.log(from);
  $("td:first-child").css("font-weight", "bold");
}, 5000);

//Haversine Formula (Measuring Distance between 2 Points)
function calcDistance(lat1, lon1, lat2, lon2) {
  Number.prototype.toRad = function() {
    return (this * Math.PI) / 180;
  };

  var R = 6371; // km
  var x1 = lat2 - lat1;
  var dLat = x1.toRad();
  var x2 = lon2 - lon1;
  var dLon = x2.toRad();
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) *
      Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function showPath(val) {
  showLoop();
  setTimeout(() => {
    path = dataPath[val].Path;
    cash = dataPath[val].Cash;
    cashless = dataPath[val].Cashless;
    TravelTime = dataPath[val].TravelTime;
    var i = from.split(" ");
    from = i[0];
    var j = to.split(" ");
    to = j[0];
    localStorage.setItem("dataPath", JSON.stringify(dataPath));
    localStorage.setItem("selection", val);
    localStorage.setItem("size", size);
    localStorage.setItem("from", from);
    localStorage.setItem("to", to);
    localStorage.setItem("path", path);
    localStorage.setItem("cash", cash);
    localStorage.setItem("cashless", cashless);
    localStorage.setItem("TravelTime", TravelTime);
    window.location.href = "PathScreen.html";
  }, 3000);
}

function showLoop() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("myDiv").style.display = "none";
}
