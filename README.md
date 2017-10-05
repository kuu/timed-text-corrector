# timed-text-corrector
REST APIs for correcting the results from the speech-to-text services by using existing human-written transcripts

## APIs
| Method | Path                   | Description   | Request body | Response JSON Format  |
| ------ | ---------------------- | ------------- | ------------- | ------------- |
| PUT    | /api/transcript/:assetId     | Registers a transcript for an asset  | "Transcript text" |  - |
| GET    | /api/transcript/:assetId     | Retrieves a transcript               | - | ["Sentence"] |
| DELETE | /api/transcript/:assetId     | Deletes a transcript                 | - | - |
| POST   | /api/timedtext               | Corrects a timed text                | {depends on the speech-to-text service} |  "Job ID" |
| GET    | /api/timedtext/:jobId/state | Retrieves a timed text state          | - | {Either "Processing", "Processed", or "Failed"} |
| GET    | /api/timedtext/:jobId       | Retrieves a timed text                | - | {id: assetId, state: {Either "Processing", "Processed", or "Failed"}, lines: [{time: "hh:mm:ss", text: "text"}]} |
| DELETE | /api/timedtext/:jobId       | Deletes a timed text                  | - | - |
| GET    | /api/timedtext/all/:assetId | Retrieves all timed text for an asset | - | ["Job ID"] |

## Install
* Install [Node.js](https://nodejs.org/)
* Clone source code and install dependencies

```
$ git clone git@github.com:kuu/timed-text-corrector.git
$ cd timed-text-corrector
$ npm install
```

## Run
* Start the server with specifying port number (the default port is 3000)

```
$ PORT={port number} npm start
```

* Now you can access the APIs

```
$ curl http://localhost:3000/api/transcript/{assetId}
["This is transcript.", "That's it."]

```

* Use DEBUG environ variable for detail logs
```
$ DEBUG=ttc npm start
```

## Stop
* Stop the server by the following command in the same directory you did `npm start`

```
$ npm stop
```
