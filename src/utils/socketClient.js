import io from "socket.io-client";

export let socket;

export function init() {
  socket = io("https://zalo-app-dnc.herokuapp.com", {
    transports: ["websocket"],
    // autoConnect: false,
  });
}
