const express = require("express");
const app = express();

const port = 8000;
mongoose = require('mongoose');
const routes = require('./Routes/home');
const bodyParser = require('body-parser');
var cors = require('cors');
const { Console } = require("console");
const User = require('./models/pledge');
const controller = require("./controllers/homeController");
const Twitter = require("twitter"),
  client = new Twitter({
    consumer_key: "cDYgyZxXzTRNYzmRZ6LeD5vr3",
    consumer_secret: "rDAL4lg5EjgJNPUNm9EoUdoHYMeM7TrNMTeJFKPEVcRTOWeJJE",
    access_token_key: "893633086931562496-CiqY2or4wrbrJ2KDFdFrTqGLcrAAfkE",
    access_token_secret: "6OaUCxsmhA4jxXinokQPj6wLkXcATwhyiirQ5ZDHCaXnY"
  });
  // client = new Twitter({
  //       consumer_key : "9BIcaBgEt7ZqJRMzelzpSEs32",
  //       consumer_secret : "AbK9VcfebEqXG3kEjQTZQ4fcStwvVbGoFfwCaPiczijBpaP6Gy",
  //       access_token_key : "1082184368070680576-K9Az756PoxfOK5Uz4vtCH88tc2QyDZ",
  //       access_token_secret : "piQuo0yrovGo809d0eLF0eET3WdqAanv7dhOJjxKq3DIU"
  // });

// const { SerialPort, ReadlineParser } = require('serialport')
// const Aport = new SerialPort({ path:"COM5",baudRate:115200  })
// const parser = new ReadlineParser()

// mongoose.connect('mongodb://localhost:27017/cycle', {useUnifiedTopology: true, useNewUrlParser: true })
// .then(() => console.log('mongo DB connected'))
// .catch(err => console.log(err));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var params = { track: "#india" };

client.stream("statuses/filter", params, gotData);

function gotData(stream) {
  stream.on("data", function(event) {
    // console.log(event.text);
    // io.emit('tweets', event);
    data = event;

    // var myResult = data.text.split(" ");
    // console.log(data);
    let payload = { name : data.user.name , text: data.text, profile:data.user.profile_image_url}
    io.emit("tweets",payload);
  });

  stream.on("error", function(error) {
    console.log(error ,"connection problem");
  });
};

app.get('/',(req,res)=>{
    res.send('home')
});
app.use(routes);

const server = require('http').createServer(app),
io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }    
  });
[]
  io.on('connection',(socket)=>{
    console.log('Client is connected');
    // socket.on('captures',(e)=>{
    //     const user = new User({
    //         name: e.name,
    //         email: e.email,
    //         mobileNumber:e.mobileNumber
    //       });

    //       user.save();
    //     let top =    Math.floor(Math.random() * (700 - 150 + 1) + 150) + 'px';
    //     let left =    Math.floor(Math.random() * 1000) + 'px';
    //     e.top = top;
    //     e.left = left;
    //        io.emit("message",e);
    // });
    // socket.on("userForm",(d)=>{
        // controller.insertMany(d);
        // io.emit("raceStart",(d));
        // Aport.write('R');
    // });
    socket.on("sendCommand",()=>{
      console.log("write arduino");
      // Aport.write('R.')
    });
    socket.on('sendData',()=>{
      // Aport.write('R.')
    })
});


// const { SerialPort, ReadlineParser } = require('serialport')
// const Aport = new SerialPort({ path:"COM5",baudRate:115200  })
// const parser = new ReadlineParser()
// Aport.pipe(parser)

// // // Aport.write('R.')
// parser.on('data', (data)=>{
//     console.log(data);
// //     // if(data == 'R'){
//       io.emit("remove")
// //     // }
// })

// SerialPort.list().then(d=>{
//     console.log(d[0].path);
// })
// console.log(SerialPort.list());

server.listen(port,process.env.WIFI_PORT,()=>{
    console.log('server started');
})


// const express = require("express");
// const app = express();

// const port = 8000;
// mongoose = require('mongoose');
// const routes = require('./Routes/home');
// const bodyParser = require('body-parser');
// var cors = require('cors');
// const { Console } = require("console");
// const User = require('./models/pledge');
// const controller = require("./controllers/homeController");
// const Twitter = require("twitter"),
//   // client = new Twitter({
//   //   consumer_key: "cDYgyZxXzTRNYzmRZ6LeD5vr3",
//   //   consumer_secret: "rDAL4lg5EjgJNPUNm9EoUdoHYMeM7TrNMTeJFKPEVcRTOWeJJE",
//   //   access_token_key: "893633086931562496-CiqY2or4wrbrJ2KDFdFrTqGLcrAAfkE",
//   //   access_token_secret: "6OaUCxsmhA4jxXinokQPj6wLkXcATwhyiirQ5ZDHCaXnY"
//   // });
//   client = new Twitter({
//     consumer_key: "GRbWs9QuUL09fJlObqrmfZByd",
//     consumer_secret: "TkqCuL7pE3oge7Qk0w7Aw1kKoBOXeKvGizi7FYEJqcWr8OLwsv",
//     access_token_key: "893633086931562496-ybAwQPPiIEXZO4lyc4pEAUAANWKGruF",
//     access_token_secret: "UFDKGKstOT6R0n1KehVwt37xPSAv7D433z3KljI7tQuML"
//   });

// // const { SerialPort, ReadlineParser } = require('serialport')
// // const Aport = new SerialPort({ path:"COM5",baudRate:115200  })
// // const parser = new ReadlineParser()

// // mongoose.connect('mongodb://localhost:27017/cycle', {useUnifiedTopology: true, useNewUrlParser: true })
// // .then(() => console.log('mongo DB connected'))
// // .catch(err => console.log(err));

// app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// // var params = { track: "#india" };

// // client.stream("statuses/filter", params, gotData);

// // function gotData(stream) {
// //   stream.on("data", function(event) {
// //     // console.log(event.text);
// //     // io.emit('tweets', event);
// //     data = event;

// //     // var myResult = data.text.split(" ");
// //     // console.log(data);
// //     let payload = { name : data.user.name , text: data.text, profile:data.user.profile_image_url}
// //     io.emit("tweets",payload);
// //   });

// //   stream.on("error", function(error) {
// //     console.log(error ,"connection problem");
// //   });
// // };


// // Open a realtime stream of Tweets, filtered according to rules
// // https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start

// const needle = require('needle');

// // The code below sets the bearer token from your environment variables
// // To set environment variables on macOS or Linux, run the export command below from the terminal:
// // export BEARER_TOKEN='YOUR-TOKEN'
// const token = 'AAAAAAAAAAAAAAAAAAAAAGDJmAEAAAAAfN%2BnsVAkLDoQHJukAY4BhKOkkzU%3D5fCoycdTNcbbyMAI2siITmMD7iyg6gGHAkh78PR0j0raAeTCzt';

// const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
// const streamURL = 'https://api.twitter.com/2/tweets/search/stream?expansions=attachments.media_keys,referenced_tweets.id,author_id'

// // this sets up two rules - the value is the search terms to match on, and the tag is an identifier that
// // will be applied to the Tweets return to show which rule they matched
// // with a standard project with Basic Access, you can add up to 25 concurrent rules to your stream, and
// // each rule can be up to 512 characters long

// // Edit rules as desired below
// const rules = [{
//         'value': 'India',
//         'tag': 'India'
//     },
//     // {
//     //     'value': 'cft360 has:images ',
//     //     'tag': 'cft360'
//     // },
// ];

// async function getAllRules() {

//     const response = await needle('get', rulesURL, {
//         headers: {
//             "authorization": `Bearer ${token}`
//         }
//     })

//     if (response.statusCode !== 200) {
//         console.log("Error:", response.statusMessage, response.statusCode)
//         throw new Error(response.body);
//     }

//     return (response.body.includes?.users);
// }

// async function deleteAllRules(rules) {

//     if (!Array.isArray(rules.data)) {
//         return null;
//     }

//     const ids = rules.data.map(rule => rule.id);

//     const data = {
//         "delete": {
//             "ids": ids
//         }
//     }

//     const response = await needle('post', rulesURL, data, {
//         headers: {
//             "content-type": "application/json",
//             "authorization": `Bearer ${token}`
//         }
//     })

//     if (response.statusCode !== 200) {
//         throw new Error(response.body);
//     }

//     return (response.body);

// }

// async function setRules() {

//     const data = {
//         "add": rules
//     }

//     const response = await needle('post', rulesURL, data, {
//         headers: {
//             "content-type": "application/json",
//             "authorization": `Bearer ${token}`
//         }
//     })

//     if (response.statusCode !== 201) {
//         throw new Error(response.body);
//     }

//     return (response.body);

// }

// function streamConnect(retryAttempt) {

//     const stream = needle.get(streamURL, {
//         headers: {
//             "User-Agent": "v2FilterStreamJS",
//             "Authorization": `Bearer ${token}`
//         },
//         timeout: 20000
//     });

//     stream.on('data', data => {
//         try {
//             const json = JSON.parse(data);
//             let username = json.includes.users[0].username
//             let text = json.includes.tweets[0].text
//             console.log(username + ' ' + text);
//             let payload = { name : username, text: text, profile:''}
//             io.emit("tweets",payload);
//             // A successful connection resets retry count.
//             retryAttempt = 0;
//         } catch (e) {
//             if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
//                 console.log(data.detail)
//                 process.exit(1)
//             } else {
//                 // Keep alive signal received. Do nothing.
//             }
//         }
//     }).on('err', error => {
//         if (error.code !== 'ECONNRESET') {
//             console.log(error.code);
//             process.exit(1);
//         } else {
//             // This reconnection logic will attempt to reconnect when a disconnection is detected.
//             // To avoid rate limits, this logic implements exponential backoff, so the wait time
//             // will increase if the client cannot reconnect to the stream. 
//             setTimeout(() => {
//                 console.warn("A connection error occurred. Reconnecting...")
//                 streamConnect(++retryAttempt);
//             }, 2 ** retryAttempt)
//         }
//     });

//     return stream;

// }


// (async () => {
//     let currentRules;

//     try {
//         // Gets the complete list of rules currently applied to the stream
//         currentRules = await getAllRules();

//         // Delete all rules. Comment the line below if you want to keep your existing rules.
//         // await deleteAllRules(currentRules);

//         // Add rules to the stream. Comment the line below if you don't want to add new rules.
//         // await setRules();

//     } catch (e) {
//         console.error(e);
//         process.exit(1);
//     }

//     // Listen to the stream.
//     streamConnect(0);
// })();



// app.get('/',(req,res)=>{
//     res.send('home')
// });
// app.use(routes);

// const server = require('http').createServer(app),
// io = require('socket.io')(server, {
//     cors: {
//         origin: '*',
//       }    
//   });

//   io.on('connection',(socket)=>{
//     console.log('Client is connected');
    
//     socket.on("sendCommand",()=>{
//       console.log("write arduino");
//       Aport.write('R.')
//     });
//     socket.on('sendData',()=>{
//       Aport.write('R.')
//     })
// });


// const { SerialPort, ReadlineParser } = require('serialport')
// const Aport = new SerialPort({ path:"COM5",baudRate:115200  })
// const parser = new ReadlineParser()
// Aport.pipe(parser)

// // Aport.write('R.')
// parser.on('data', (data)=>{
//     console.log(data);
//     // if(data == 'R'){
//       io.emit("remove")
//     // }
// })

// // SerialPort.list().then(d=>{
// //     console.log(d[0].path);
// // })
// // console.log(SerialPort.list());

// server.listen(port,process.env.WIFI_PORT,()=>{
//     console.log('server started');
// })