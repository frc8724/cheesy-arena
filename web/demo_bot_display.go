package web

import (
	"net/http"

	"github.com/Team254/cheesy-arena/game"
	"github.com/Team254/cheesy-arena/model"
	"github.com/Team254/cheesy-arena/websocket"
)

func (web *Web) demoBotDisplayHandler(w http.ResponseWriter, r *http.Request) {
	template, err := web.parseFiles("templates/demo_bot_display.html")
	if err != nil {
		handleWebErr(w, err)
		return
	}

	data := struct {
		*model.EventSettings
		MatchSounds []*game.MatchSound
	}{web.arena.EventSettings, game.MatchSounds}
	err = template.ExecuteTemplate(w, "demo_bot_display.html", data)
	if err != nil {
		handleWebErr(w, err)
		return
	}
}

func (web *Web) demoBotDisplayWebsocketHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.NewWebsocket(w, r)
	if err != nil {
		handleWebErr(w, err)
		return
	}
	defer ws.Close()

	// Subscribe the websocket to the notifiers whose messages will be passed on to the client.
	ws.HandleNotifiers(web.arena.MatchTimingNotifier, web.arena.AudienceDisplayModeNotifier,
		web.arena.MatchLoadNotifier, web.arena.MatchTimeNotifier, web.arena.RealtimeScoreNotifier,
		web.arena.PlaySoundNotifier, web.arena.ScorePostedNotifier, web.arena.AllianceSelectionNotifier,
		web.arena.LowerThirdNotifier, web.arena.ReloadDisplaysNotifier)
}
