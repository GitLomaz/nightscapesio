let STATS_USER_STAT_GUID = null;
let STATS_GAME_ID = null;


if (typeof Storage !== "undefined" && localStorage) {
  STATS_USER_STAT_GUID = localStorage.getItem("STATS_USER_STAT_GUID");
  if (!STATS_USER_STAT_GUID) {
    STATS_USER_STAT_GUID = makeid(16);
    localStorage.setItem("STATS_USER_STAT_GUID", STATS_USER_STAT_GUID);
  }
} else {
  STATS_USER_STAT_GUID = "TEMP-" + makeid(11);
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

setInterval(() => {
  if (STATS_GAME_ID !== null) {
    SUBMIT_STATISTIC(STATS_GAME_ID, "ping", 1);
  }
}, 1000 * 60 * 3);

function SUBMIT_STATISTIC(game, metric, value) {
  if (STATS_GAME_ID === null) {
    STATS_GAME_ID = game;
    SUBMIT_STATISTIC(game, "ping", 1);
  }
  url = window.location.href
  let platform = "other"
  if (url.includes("kongregate")) {
    platform = "kongregate"
  } else if (url.includes("itch")) {
    platform = "itch"
  } else if (url.includes("crazygames")) {
    platform = "crazygames"
  } else if (url.includes("armorgames")) {
    platform = "armorgames"
  }
  // Create an object with the data to send
  var dataToSend = {"platform":platform, "game": game, "metric": metric, "value": value, "guid": STATS_USER_STAT_GUID};
  // Make the AJAX POST request
  $.ajax({
    contentType: 'application/json',
    url:  document.location.protocol + "//us-dev.nightscapes.io:3030/stats",
    type: "POST",
    dataType: "JSON",
    data: JSON.stringify(dataToSend),
    success: function(response) {
      // Handle the success response
      console.log(response);
    },
    error: function(xhr, status, error) {
      // Handle the error response
      console.log(error);
    }
  });
}