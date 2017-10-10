# timed-text-corrector
REST APIs for correcting the results from the speech-to-text services by using existing human-written transcripts

## APIs
| Method | Path                   | Description   | Request body | Response JSON Format  |
| ------ | ---------------------- | ------------- | ------------- | ------------- |
| POST   | /api/transcript        | Adds a transcript for an asset  | {id: assetId, text: "Transcript text"} |  - |
| GET    | /api/transcript/:assetId     | Retrieves a transcript               | - | ["Sentence"] |
| DELETE | /api/transcript/:assetId     | Deletes a transcript                 | - | - |
| POST   | /api/timedtext               | Corrects a timed text                | {id: assetId, service: "Video Indexer", data: depends on the speech-to-text service} |  "Job ID" |
| GET    | /api/timedtext/:jobId/state | Retrieves a timed text state          | - | {Either "processing", "processed", or "failed"} |
| GET    | /api/timedtext/:jobId       | Retrieves a timed text                | - | {id: assetId, state: state, data: 'TTML text'} |
| DELETE | /api/timedtext/:jobId       | Deletes a timed text                  | - | - |
| GET    | /api/timedtext/all/:assetId | Retrieves all timed text for an asset | - | ["Job ID"] |


## Install
* Install [Node.js](https://nodejs.org/)
* Install [Docker](https://www.docker.com/)
* Clone source code and install dependencies

```
$ git clone git@github.com:kuu/timed-text-corrector.git
$ cd timed-text-corrector
$ npm install
```

## Run DB
```
$ mkdir data
$ docker run -d --name mongo -p 27017:27017 -v `pwd`/data:/data mongo
```

## Run
* Start the server with specifying port number (the default port is 3000)

```
$ PORT=3002 npm start
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
