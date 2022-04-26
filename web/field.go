package web

import (
	"net/http"

	"github.com/Team254/cheesy-arena/websocket"
)

func (web *Web) fieldGatewayWebsocketHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.NewWebsocket(w, r)
	if err != nil {
		handleWebErr(w, err)
		return
	}
	defer ws.Close()

	ws.HandleNotifiers(web.arena.VolcanoEruptionNotifier)
}
