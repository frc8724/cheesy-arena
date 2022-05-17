const state = {
  displayMode: "match",
  redRealtimeScore: {
    ScoreSummary: { Score: 0, EndgameScore: 0, HasEruptionBonus: false },
  },
  blueRealtimeScore: {
    ScoreSummary: { Score: 0, EndgameScore: 0, HasEruptionBonus: false },
  },
  redPostedScore: {},
  bluePostedScore: {},
};

function update() {
  if (state.displayMode == "score") {
    $("#main").show();
    $("#logo").hide();

    $("#realtime-score-red").text(state.redPostedScore.Score);
    $("#realtime-score-blue").text(state.bluePostedScore.Score);

    $(".score.red .volcano").toggleClass(
      "active",
      state.redPostedScore.HasEruptionBonus
    );
    $(".score.blue .volcano").toggleClass(
      "active",
      state.bluePostedScore.HasEruptionBonus
    );
  } else if (state.displayMode == "match") {
    $("#main").show();
    $("#logo").hide();

    $("#realtime-score-red").text(
      state.redRealtimeScore.ScoreSummary.Score -
        state.redRealtimeScore.ScoreSummary.EndgameScore
    );
    $("#realtime-score-blue").text(
      state.blueRealtimeScore.ScoreSummary.Score -
        state.blueRealtimeScore.ScoreSummary.EndgameScore
    );

    $(".score.red .volcano").toggleClass(
      "active",
      state.redRealtimeScore.ScoreSummary.HasEruptionBonus
    );
    $(".score.blue .volcano").toggleClass(
      "active",
      state.blueRealtimeScore.ScoreSummary.HasEruptionBonus
    );
  } else if (state.displayMode == "blank") {
    $("#main").hide();
    $("#logo").hide();
  } else if (state.displayMode == "logo") {
    $("#main").hide();
    $("#logo").show();
  }

  $(".score.red")
    .toggleClass(
      "win",
      state.displayMode == "score" &&
        state.redPostedScore.Score > state.bluePostedScore.Score
    )
    .toggleClass(
      "tie",
      state.displayMode == "score" &&
        state.redPostedScore.Score == state.bluePostedScore.Score
    );

  $(".score.blue")
    .toggleClass(
      "win",
      state.displayMode == "score" &&
        state.bluePostedScore.Score > state.redPostedScore.Score
    )
    .toggleClass(
      "tie",
      state.displayMode == "score" &&
        state.bluePostedScore.Score == state.redPostedScore.Score
    );
}

function handleMatchTime(data) {
  translateMatchTime(data, function (matchState, matchStateText, countdownSec) {
    var countdownString = String(countdownSec % 60);
    if (countdownString.length === 1) {
      countdownString = "0" + countdownString;
    }
    countdownString = Math.floor(countdownSec / 60) + ":" + countdownString;
    $("#clock").text(countdownString);

    $(".clock-background")
      .toggleClass(
        "red",
        countdownSec <= matchTiming.WarningRemainingDurationSec &&
          matchState != "PRE_MATCH"
      )
      .toggleClass(
        "blink",
        countdownSec <= matchTiming.WarningRemainingDurationSec &&
          matchState != "PRE_MATCH" &&
          matchState != "POST_MATCH"
      );
  });
}

function handlePlaySound(sound) {
  if (new URLSearchParams(location.search).get("mute") != "true") {
    $("audio").each((k, v) => {
      v.pause();
      v.currentTime = 0;
    });
    $("#sound-" + sound)[0].play();
  }
}

new CheesyWebsocket("/displays/demo_bot/websocket", {
  matchTime(event) {
    handleMatchTime(event.data);
  },
  realtimeScore(event) {
    state.redRealtimeScore = event.data.Red;
    state.blueRealtimeScore = event.data.Blue;
    update();
  },
  matchTiming(event) {
    handleMatchTiming(event.data);
  },
  playSound(event) {
    handlePlaySound(event.data);
  },
  scorePosted(event) {
    state.redPostedScore = event.data.RedScoreSummary;
    state.bluePostedScore = event.data.BlueScoreSummary;
    update();
  },
  audienceDisplayMode(event) {
    state.displayMode = event.data;
    update();
  },
});
