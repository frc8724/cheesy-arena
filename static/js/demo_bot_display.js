let realtimeScores = { red: 0, blue: 0 };
let postedScores = { red: 0, blue: 0 };

let mode = "match";

function updateScores() {
  if (mode == "blank") {
    $(".main").hide();
  } else {
    $(".main").show();
  }

  if (mode == "match") {
    $(".score.red").text(realtimeScores.red).removeClass("win tie");
    $(".score.blue").text(realtimeScores.blue).removeClass("win tie");
  } else if (mode == "score") {
    $(".score.red").text(postedScores.red).removeClass("win tie");
    $(".score.blue").text(postedScores.blue).removeClass("win tie");

    if (postedScores.red > postedScores.blue) {
      $(".score.red").addClass("win");
    } else if (postedScores.blue > postedScores.red) {
      $(".score.blue").addClass("win");
    } else {
      $(".score.red").addClass("tie");
      $(".score.blue").addClass("tie");
    }
  }
}

function handleMatchTime(data) {
  translateMatchTime(data, function (matchState, matchStateText, countdownSec) {
    var countdownString = String(countdownSec % 60);
    if (countdownString.length === 1) {
      countdownString = "0" + countdownString;
    }
    countdownString = Math.floor(countdownSec / 60) + ":" + countdownString;
    $("#clock").text(countdownString);
  });
}

function handleRealtimeScore(data) {
  realtimeScores.red =
    data.Red.ScoreSummary.Score - data.Red.ScoreSummary.EndgameScore;
  realtimeScores.blue =
    data.Blue.ScoreSummary.Score - data.Blue.ScoreSummary.EndgameScore;

  updateScores();
}

function handlePlaySound(sound) {
  $("audio").each((k, v) => {
    v.pause();
    v.currentTime = 0;
  });
  $("#sound-" + sound)[0].play();
}

function handleScorePosted(data) {
  postedScores.red = data.RedScoreSummary.Score;
  postedScores.blue = data.BlueScoreSummary.Score;

  updateScores();
}

new CheesyWebsocket("/displays/demo_bot/websocket", {
  matchTime(event) {
    handleMatchTime(event.data);
  },
  realtimeScore(event) {
    handleRealtimeScore(event.data);
  },
  matchTiming(event) {
    handleMatchTiming(event.data);
  },
  playSound(event) {
    handlePlaySound(event.data);
  },
  scorePosted(event) {
    handleScorePosted(event.data);
  },
  audienceDisplayMode(event) {
    mode = event.data;
    updateScores();
  },
});
