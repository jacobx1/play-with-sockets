# Play with (Web)Sockets

Experimenting with web sockets. Currently, there is a node server and react client that allow many browsers to manipulate a canvas and sync the state to all that are connected.

![Demo](docs/images/multi-browser-demo.png)

## Setup

Using websockets does require having TLS configured. You will need to create a cert/key for localhost and update the server `index.ts` accordingly.
