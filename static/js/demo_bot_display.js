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
  $(".score.red").text(
    data.Red.ScoreSummary.Score - data.Red.ScoreSummary.EndgameScore
  );
  $(".score.blue").text(
    data.Blue.ScoreSummary.Score - data.Blue.ScoreSummary.EndgameScore
  );
}

function handlePlaySound(sound) {
  $("audio").each((k, v) => {
    v.pause();
    v.currentTime = 0;
  });
  $("#sound-" + sound)[0].play();
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
});
