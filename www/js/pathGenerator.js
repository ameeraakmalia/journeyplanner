class options {
  constructor() {
    this.values = [];
  }
  addValue(val1, val2, val3) {
    this.values.push({
      text: val1,
      value: val2,
      selected: val3
    });
  }
}

let optionDeparture = document.getElementById("pathChoice").options;
var size = localStorage.getItem("size");
var selection = parseInt(localStorage.getItem("selection"));
const option = new options();
for (var j = 1; j <= size; j++) {
  var text = "Path " + j;
  var value = "Path " + j;
  var selected = null;
  if (j == selection + 1) {
    selected = true;

    option.addValue(text, value, selected);
  } else {
    option.addValue(text, value, selected);
  }
}
console.log(option.values);
var k = selection + 1;
k = "Path " + k;
option.values.forEach(e => {
  if (e.text == k) {
    optionDeparture.add(new Option(e.text, e.value, e.selected));
  } else {
    optionDeparture.add(new Option(e.text, e.value));
  }
});

// getting items from other pages
var dataPath = localStorage.getItem("path");
var path = dataPath.split(" -> ");
var length = path.length;
var dataPath = JSON.parse(localStorage.getItem("dataPath"));
var cash = localStorage.getItem("cash");
var cashless = localStorage.getItem("cashless");
var TravelTime = localStorage.getItem("TravelTime");
var from = localStorage.getItem("from");
var to = localStorage.getItem("to");
$("#pathDetails").append(
  "<span class='fs-16'>" +
    "FROM: " +
    "<b>" +
    from +
    " " +
    path[0] +
    "</b>" +
    "</span><br />"
);
$("#pathDetails").append(
  "<span class='fs-16'>" +
    "TO: " +
    "<b>" +
    to +
    " " +
    path[length - 1] +
    "</b>" +
    "</span><br />"
);
$("#pathDetails").append(
  "<span class='fs-16'>" + "CASH: RM" + "<b>" + cash + "</b>" + "</span><br />"
);
$("#pathDetails").append(
  "<span class='fs-16'>" +
    "CASHLESS: RM" +
    "<b>" +
    cashless +
    "</b>" +
    "</span><br />"
);
$("#pathDetails").append(
  "<span class='fs-16'>" +
    "TRAVELTIME: " +
    "<b>" +
    TravelTime +
    " minutes</b>" +
    "</span><br />"
);
$("#pathDetails").show(1000);
for (var i = 0; i < length; i++) {
  var temp = path[i].split(" ");
  if (temp[0] == "Transit" && temp[3] == undefined) {
    $("#tempat-letak-path").append(
      "<span id='s1' class='fs-16'>Transit at:</span>" +
        "<br />" +
        "<span class='btn btn-info btn-block font'>" +
        temp[2] +
        "</span>"
    );
  } else if (temp[0] == "Transit") {
    $("#tempat-letak-path").append(
      "<span id='s1' class='fs-16'>Transit at:</span>" +
        "<br />" +
        "<span class='btn btn-info btn-block font'>" +
        temp[2] +
        temp[3] +
        "</span>"
    );
  } else {
    $("#tempat-letak-path").append(
      "<span class='btn btn-primary btn-block font'>" + path[i] + "</span>"
    );
  }
  if (i != length - 1) {
    $("#tempat-letak-path").append(
      "<div class='item-center'><img src='img/arrow.png' class='image' /></div>"
    );
  }
}

//callback other path
function reinitializeContent() {
  $("#pathDetails").hide();
  var children = document.getElementById("tempat-letak-path").children.length;
  setTimeout(() => {
    while (children >= -3) {
      var list = document.getElementById("tempat-letak-path");
      list.removeChild(list.childNodes[0]);
      children--;
    }
  }, 1000);

  var d = document.getElementById("pathChoice").value;
  var i = d.split(" ");
  d = parseInt(i[1]) - 1;
  path = dataPath[d].Path;
  cash = dataPath[d].Cash;
  cashless = dataPath[d].Cashless;
  TravelTime = dataPath[d].TravelTime;
  path = path.split(" -> ");
  var length = path.length;
  $("#pathDetails").empty();
  $("#pathDetails").append(
    "<span class='fs-16'>" +
      "FROM: " +
      "<b>" +
      from +
      " " +
      path[0] +
      "</b>" +
      "</span><br />"
  );
  $("#pathDetails").append(
    "<span class='fs-16'>" +
      "TO: " +
      "<b>" +
      to +
      " " +
      path[length - 1] +
      "</b>" +
      "</span><br />"
  );
  $("#pathDetails").append(
    "<span class='fs-16'>" + "CASH: " + "<b>" + cash + "</b>" + "</span><br />"
  );
  $("#pathDetails").append(
    "<span class='fs-16'>" +
      "CASHLESS: " +
      "<b>" +
      cashless +
      "</b>" +
      "</span><br />"
  );
  $("#pathDetails").show(1000);

  setTimeout(() => {
    for (var i = 0; i < length; i++) {
      var temp = path[i].split(" ");
      //console.log(temp)
      if (temp[0] === "Transit" && temp[3] == undefined) {
        $("#tempat-letak-path").append(
          "<span id='s1' class='fs-16'>Transit at:</span>" +
            "<br />" +
            "<span class='btn btn-info btn-block font'>" +
            temp[2] +
            "</span>"
        );
      } else if (temp[0] === "Transit") {
        $("#tempat-letak-path").append(
          "<span id='s1' class='fs-16'>Transit at:</span>" +
            "<br />" +
            "<span class='btn btn-info btn-block font'>" +
            temp[2] +
            temp[3] +
            "</span>"
        );
      } else {
        $("#tempat-letak-path").append(
          "<span class='btn btn-primary btn-block font'>" + path[i] + "</span>"
        );
      }
      if (i != length - 1) {
        $("#tempat-letak-path").append(
          "<div class='item-center'><img src='img/arrow.png' class='image' /></div>"
        );
      }
    }
  }, 1000);
}
