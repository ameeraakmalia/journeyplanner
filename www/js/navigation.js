//initialize option tag for departure and arrival
function initializeSelection() {
  var options;
  let optionDeparture = document.getElementById("departure").options;
  let optionArrival = document.getElementById("arrival").options;
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "https://api-journeyapp.herokuapp.com/getStations",
    success: function(data) {
      // console.log(data);
      options = data;
    }
  });

  setTimeout(() => {
    console.log(options);
    options.forEach(option => {
      optionArrival.add(new Option(option.text, option.value));
      optionDeparture.add(new Option(option.text, option.value));
    });
  }, 3000);
}

var departure, arrival, path, cash, cashless, TravelTime, size, dataPath;
var departureTrain, arrivalTrain;
var elevator, escalator;

escalator = "no";
elevator = "no";

//departure dropdown
function selectDeparture() {
  var d = document.getElementById("departure").value;
  departure = d;
  var i = departure.split(" ");
  departureTrain = i[0];

  //delete any html element in div[tempat-letak-table]
  var children = document.getElementById("tempat-letak-table").children.length;
  while (children != 0) {
    var list = document.getElementById("tempat-letak-table");
    list.removeChild(list.childNodes[0]);
    children--;
  }
}

//arrival dropdown
function selectArrival() {
  var d = document.getElementById("arrival").value;
  arrival = d;
  var i = arrival.split(" ");
  arrivalTrain = i[0];
  var children = document.getElementById("tempat-letak-table").children.length;

  //delete any html element in div[tempat-letak-table]
  while (children != 0) {
    var list = document.getElementById("tempat-letak-table");
    list.removeChild(list.childNodes[0]);
    children--;
  }
}

function elevatorStatus() {
  // Get the checkbox
  var checkBox = document.getElementById("elevator");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    elevator = "yes";
  } else {
    elevator = "no";
  }
  console.log(elevator);

  //delete any html element in div[tempat-letak-table]
  var children = document.getElementById("tempat-letak-table").children.length;
  while (children != 0) {
    var list = document.getElementById("tempat-letak-table");
    list.removeChild(list.childNodes[0]);
    children--;
  }
}

function escalatorStatus() {
  // Get the checkbox
  var checkBox = document.getElementById("escalator");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    escalator = "yes";
  } else {
    escalator = "no";
  }

  console.log(escalator);
  //delete any html element in div[tempat-letak-table]
  var children = document.getElementById("tempat-letak-table").children.length;
  while (children != 0) {
    var list = document.getElementById("tempat-letak-table");
    list.removeChild(list.childNodes[0]);
    children--;
  }
}

//button search
function searchResult() {
  if (departure == arrival) {
    alert("Error. Please reselect your departure and arrival.");
  } else {
    console.log(departure);
    console.log(arrival);
    if (escalator == "no" && elevator == "no") {
      $.ajax({
        type: "GET",
        dataType: "json",
        url:
          "https://api-journeyapp.herokuapp.com/getPath/" +
          departure +
          "/" +
          arrival,
        success: function(data) {
          console.log(data);
          dataPath = data;
          size = Object.keys(dataPath).length; //assign variable size
        }
      });
    } else {
      $.ajax({
        type: "GET",
        dataType: "json",
        url:
          "https://api-journeyapp.herokuapp.com/getPath2/" +
          departure +
          "/" +
          arrival +
          "/" +
          elevator +
          "/" +
          escalator,
        success: function(data) {
          console.log(data);
          dataPath = data;
          size = Object.keys(dataPath).length; //assign variable size
        }
      });
    }
    setTimeout(() => {
      if (size == 0) {
        alert("Sorry, there is no path available. Please try other options.");
      }
      var children = document.getElementById("tempat-letak-table").children
        .length;
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
      $("td:first-child").css("font-weight", "bold");
    }, 3000);
  }
}

//loading screen
function showLoop() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("myDiv").style.display = "none";
}

//sends item and redirect to next page
function showPath(val) {
  showLoop();
  setTimeout(() => {
    path = dataPath[val].Path;
    cash = dataPath[val].Cash;
    cashless = dataPath[val].Cashless;
    TravelTime = dataPath[val].TravelTime;
    localStorage.setItem("dataPath", JSON.stringify(dataPath));
    localStorage.setItem("selection", val);
    localStorage.setItem("size", size);
    localStorage.setItem("from", departureTrain);
    localStorage.setItem("to", arrivalTrain);
    localStorage.setItem("path", path);
    localStorage.setItem("cash", cash);
    localStorage.setItem("cashless", cashless);
    localStorage.setItem("TravelTime", TravelTime);
    window.location.href = "PathScreen.html";
  }, 2000);
}
