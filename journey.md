## Adding Static Assets
When adding static assets I had to do a couple things to get it to work:

### Make sure that webpack can load my asset (a png)
https://webpack.js.org/guides/asset-management/

*Rationale*
By using webpack's `file-loader` I'm able to bundle my assets and resolve their names to content hashes. If an image changes, the content hash changes. This allows us to take advantage of the browser cache without manually renaming images that change. However, the hash obfuscates the location of the image which makes it more difficult to debug if we're trying to change an image.

*What worked*
By default, `file-loader` emits the content hash of the file as the file name. This is what we want in production so I went aheaded and added it to our webpack prod client config (`webpack.prod.client.js`). For the dev environment, we added an option to the loader that emits `[path][name].[ext]?[contenthash]`. This way we'll know where the file is located while still maintaining the advantages of cacheing.

### Typescript doesn't know what to do with *.png files
https://github.com/webpack-contrib/raw-loader/issues/56
https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations

*Rationale*
Typescript did not like that it was trying to resolve a *.png module and would spit out errors when building or testing. By default, the Typescript compiler only cares about *.ts files. After doing the initial setup of this website to allow Typescript to work with React, Webpack, and Jest along with some common use cases (json modules) it was able to resolve (\*.ts, *.tsx, *.json) extensions and play nicely with Webpack. Yup, I totally forgot that Typescript doesn't know what to do with other files like assets.

*What worked*
Tell Typescript what it is. We created a declaration file (`client.d.ts`) that declared that the structure of modules that ended in `*.png` would default export a string (as in what `file-loader` would spit out) and Typescript was happy to eat that up. In general when Typescript "can't find a module" it means either I mispelled the path (has happened more than once D:) or we need to tell Typescript how to recognize those files and imports (either with configuration options or declaration files).

### Jest doesn't like my assets
https://stackoverflow.com/questions/46898638/importing-images-breaks-jest-test
https://jestjs.io/docs/en/webpack.html
https://jestjs.io/docs/en/configuration#modulenamemapper-object-string-string

*Rationale*
When trying to build the client the Jest tests continued to fail. The Jest resolver was unable to find our image file and kept asking us to check that `moduleFileExtensions` were correct. From the Stack Overflow comment, it seems that Jest is trying to read the image as JavaScript. So, instead we told Jest that if you find any modules that end in one of the many asset formats, use the specified mock file (which happens to return a string, the same thing file-loader would have done). Just for good measure we also included a mock for CSS files.

*What worked*
We modified the `jest.config.js` to map any asset extensions (e.g. `png, jpg, woff`) to a mock file we created called `<rootDir>/__mocks__/fileMock.js`. The mock file contained the code that mimicked what `file-loader` would have returned. `<rootDir>` is the root of the directory containing the Jest config file and is something resolved by Jest. We did something similar for CSS as it seemed like it would be a common use case.

## Testing with React Router Components
When using `react-router` inside Jest theres something special we need to do:

### Can't use Link without Router
https://reacttraining.com/react-router/web/guides/testing
*Rationale*
When trying to use our test renderer (`react-test-renderer`) on a component that contained a `Link`, it failed. The reason for that is because `react-router` relies on the React context API to function properly (much like `styled-components` and theming).

*What worked*
Wrap the component in a `MemoryRouter` or `StaticRouter`. These routers provide specific utilities for testing (per the docs). I didn't try to use a `BrowserRouter` because it wasn't specified in the docs and I figured sticking a browser context in a server environment would lead to bad times. So far so good, we'll see whether this method is scalable or causes other downstream issues.

## Modals and Dialogs
I wanted to use dialogs to handle most of my form inputs. Some of the things I encountered were:

### Using React Portal
This is the method of building out an element and attaching it to another part of the DOM specified by the developer (as opposed to the nearest parent element).

### Focus
Something that's important to note is that modals can mess up focus and that can be a problem for accessibility. We need to figure out a way for "background" elements to not take focus even though they're rendered while the modal is showing. Somebody has solved that for us in the form of `react-modal` and `react-aria-modal`. Unfortuantely my attempt at `Modal` leaves something to be desired in terms of focus and accessibility.

### Jest doesn't know what to do with the document global
We're mostly testing client-side code (so far). So lets make the test environment in `jest.config.js` a client-like enviornment. The default `testEnvironment` is `jsdom`.

## Interactivity
Our server is going to act as a broker for the users (i.e. clients) playing a codenames game so that the clients can communicate with each other (e.g. when someone clicks on a word). To do this I:

### Implemented WebSockets
*Rationale*
The most common method of communication on the web is one-way with the client initiating a request to the server and the server providing a response. WebSockets allows two-way communication between the server and the client so that either could initiate a message. Thus, when a client does an action that other clients should know about (like when a card is clicked) the server can broadcast that message to the relevant users. The technology has been out for multiple years as of this writing and has stabilized. Both `socket.io` and `ws` are packages that help making implementing sockets much easier.

*What worked*
After deciding which package to use (`ws`) I followed the examples in the `ws` README. The first thing I did was separate out the creation of the node http server instance from the listening part. The instance was required by the WebSocket Server in order to automatically `upgrade` connections and express bundled them together for me but it was time to tear them apart. Then I added the required listeners (`connection`, `message`, and `close` being key events) before the server started listening for requests.

One important thing to note is that `ws` does *not* provide a client-side implementation of websockets like `socket.io` does. Instead, I used the native WebSocket API provided by the browser. When the DOM loaded I created a WebSocket connection to my endpoint, attached my listeners, and sent my messages. This was the very beginning of sockets.

### Multiple WebSocket Servers
*Rationale*
Without extending the websocket, it was hard to tell which websockets to broadcast to (we don't want to be broadcasting game events to lobbies that are irrelevant). We needed to find a way to broadcast exactly to the people we want to broadcast to. It was also clear that managing many servers and sockets could get out of hand very fast if the architecture wasn't thought out.

*What worked*
First we need to manage where all these servers go (`WebSocketManager`). What it did was handle the creation (and in the future, heartbeats, errors, and closures) of websocket servers and tied them to an identifier provided by the consumer. In order to handle multiple websocket servers, the http server needs to manage the upgrades of the connections of the websocket servers. We identify which server to emit the `connection` event to based on the url of the request. How we formatted the url to identify the server is described below.

The differentiating factor between which websocket server a client connects to is the game of codenames that they're playing. Thus, we used the codenames game id as part of the url we use to identify the websocket server in the `WebSocketManager` list. Now when users join a game then they will connect to the proper websocket server.

### Knowing when to let go
*Rationale*
Things happen. Servers go down unexpectedly, there are power outages on the client side. How exactly do we know whether somebody is on the other end of the socket?

*What worked*
We played a simple game of ping/pong. The server assumed all sockets were alive at the beginning of their connection. Every `interval` the server would terminate all clients that were not alive and would send a ping to the remaining sockets, marking them as dead for cleanup if they don't respond. Then we listen for when the browser client responds with the pong (which is managed by the browser), at which point we declare the responding socket alive. Given that this is universal to all sockets we included this functionality as part of a wrapper class called `WebSocketServerWrapper`.

### Communication
It's important that I maintain a consistent structure for the messages that are sent through to ensure I remember what I'm doing 2 years from now. What I decided on was to enumerate a number of actions that could be used client and server-side. The actions carry all the necessary data to perform the relevant operations on both server and client. The wrapper classes for the sockets provide methods to enforce this behaviour as well as several conveniences like broadcasting, error handling, and managing the message format.