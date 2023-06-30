const express = require("express");
const app = express();

const port = 8000;
const axios = require("axios");
const mongoose = require("mongoose");
const moment = require('moment');
const momentTimeZone = require('moment-timezone');

// mongoose
//   .connect("mongodb://127.0.0.1:27017/twitter", {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("mongo DB connected"))
//   .catch((err) => console.log(err));
// const User = require("./models/pledge");

// function getTweets() {
//   axios
//     .get("https://api.twitter.com/1.1/search/tweets.json?count=5&q=craftech360", {
//       headers: {
//         Authorization:
//           "Bearer AAAAAAAAAAAAAAAAAAAAAHfJmAEAAAAAzUO%2BWWiIzK3x8tHdxss1niEJjyA%3DKY35CwnHBj0gNBY3F4NQ0TxdBcERYxWkc0wY1jEKzP5vZkBFL6",
//       },
//     })
//     .then((data) => {
//       // console.log(data.data.statuses);
//       let responseArray = data.data.statuses;
//       let userListArray = responseArray.map((data) => {
//         return {
//           _id: data.id,
//           text: data.text,
//           userName: data.user.name,
//           image: data.user.profile_image_url,
//           isServing: true,
//         };
//       });
//       // console.log(userListArray);
//       User.insertMany(userListArray, {
//         ordered: false,
//         silent: true,
//         keepGoing: true,
//         safe: true,
//       })
//         .then((data) => {
//           console.log("data : "+ data);
//           User.find({ isServing: true })
//             .then((d) => {
//               console.log(d);
//               io.emit('tweets',d);
//               //send data to client using socket io [1,2,3]
//               // send arduino event door open (1)
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         })
//         .catch((e) => {
//           console.log(e.message);
//         });
//     })
//     .catch((e) => {
//       console.log(e.message);
//     });
// }

// function getById(id) {
//   User.findOneAndUpdate(id, { isServing: false })
//     .then((d) => {
//       console.log("Update done");
//     })
//     .catch((e) => {
//       console.log("failed update");
//     });
// }

const { TwitterApi } = require('twitter-api-v2');

const twitterClient = new TwitterApi(
  'AAAAAAAAAAAAAAAAAAAAAGXEoQEAAAAAe9vnftE8zs2S%2FAHqCM79p6bFUkA%3D6MfAId2qEunWHWSzIvNLsKCCdk8Brtl3RkoSnQrpoiOxBG9YXH'
);
const readOnlyClient = twitterClient.readOnly;
var collection = [];
var _latestDate = moment().subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
var previousTime = moment();

async function getTweets(latestDate=_latestDate) {
  try {
    console.log(_latestDate);
    latestDate= moment.utc(latestDate).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ssZ');
    collection = [];
    console.log("lateDate: " + latestDate);
    const currentDate = moment();
    console.log("setting start time less than 45 sec");
    let start_time = moment(latestDate).add(1, "seconds").format("YYYY-MM-DDTHH:mm:ssZ");
    console.log("startTimeinitial:" + start_time);

    const duration = moment.duration(moment(start_time).diff(previousTime));
    console.log(`INTERVALDURATION : ${duration.asSeconds()}`);
    const end_time = moment().subtract(10, "seconds").format('YYYY-MM-DDTHH:mm:ssZ');

    // const end_time = currentDate.toISOString(currentDate.getTime() - 10000);
    // const start_time= currentDate.setDate(currentDate.getTime() - 60000)  // Subtracting 1 minute (60,000 milliseconds)
    // const start_time = currentDate.toISOString(currentDate.getDate() - 60000);
    console.log("start-date:" + start_time);
    console.log("end-date:" + end_time);
    const apiData = await readOnlyClient.v2.search({
      query: 'craftech360',
      expansions: 'referenced_tweets.id.author_id',
      "tweet.fields": 'created_at',
      start_time: start_time,
      end_time: end_time
    });
    console.log(apiData._realData);
    var tweets = apiData._realData
    // // console.log(JSON.stringify(tweets.includes));
    if (tweets.data) {
      let tweet = tweets.data.map(tweet => moment(tweet.created_at));
      console.log(tweet);
       _latestDate = moment.max(tweet).format('YYYY-MM-DDTHH:mm:ssZ');
       console.log(_latestDate);

      latestDate = moment(latestDate).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ssZ');
      console.log("latestDateRedifined" + latestDate);

      for (let index = 0; index < tweets.includes.users.length; index++) {
        collection.push({
          id: tweets.data[index].id,
          username: tweets.includes.users[index].username,
          name: tweets.includes.users[index].name,
          profilePic: tweets.includes.users[index].profile_image_url,
          text: tweets.data[index].text,
          createdAt: tweets.data[index].created_at
        });
      }
      // console.log(collection);
      // console.log(JSON.stringify(collection));
      console.log(collection);
      return collection;
    }
    else {
      console.log("err");
      // res.write(collection);
      return [];
    }
  } catch (err) {
    return [];
  }
}


// getTweets();
const { SerialPort, ReadlineParser } = require('serialport')
const Aport = new SerialPort({ path: "COM7", baudRate: 115200 })
const parser = new ReadlineParser()
Aport.pipe(parser)

// Aport.write('R.')
// Here Data Comes When Door Closes From Serial
parser.on('data', (data) => {
  console.log(data);
  if (data == 'R') {
    console.log('message from seriel to remove present serving user');
    io.emit("removeUser")
  }
})

var cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
app.use(cors());
const io = new Server(server);


io.on('connection', (socket) => {

  console.log('Client i//s connected');

  socket.on("getTweets", (latestDate) => {
   //  console.log("Intervals Started");
    getTweets().then(x => {
      console.log("Socket");
      console.log(x);
      if (x) {
        io.emit(`tweets`, x);
      }
    });
    // // getTweets();
  });

  socket.on('sendCommand', (e) => {
    console.log('door-open', e);
    Aport.write('R.')
    //  getById(e)
  })

  socket.on('invalid', (e) => {
    console.log('empty-door-open', e);
    Aport.write('6')
    //  getById(e)
  })

  socket.on('updateUser', (e) => {

  })

});


server.listen(port, () => {
  console.log('server started');
})



// door close event
//send event to client
// send event to backend door open