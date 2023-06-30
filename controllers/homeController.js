const { json } = require('body-parser');
const User = require('../models/pledge')
const controller = {};
const fs = require("fs");
const { resolve } = require('path');
const { rejects } = require('assert');

controller.getAll = async (req,res)=>{
    try {
        const result  = await User.find().sort({$natural:-1}).limit(3);
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send({
            message: err || "Something went wrong while creating new user."
          });
    }
}
controller.getlastDoc = async (req,res)=>{
    try {
        const result  = await User.find();
        const leaderScore = [];
        result.forEach((element,i)=>{
            let distance  = (element.distance / 1000) ;
            let highest = 1 / distance;
            let time = highest * element.time;
            element.leader = time
        })
        console.log(result);
        result.sort((a,b)=>{return a.leader - b.leader});
        const sortedData = result.splice(0,3)
        res.status(200).send(sortedData)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: error || "Something went wrong while creating new user."
          });
    }
}

controller.create = async (req,res)=>{
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        mobileNumber:req.body.mobileNumber
      });
    
    try {
        const result = await user.save();
        const responseData = JSON.stringify({data:result});
        res.status(201).send(responseData)
    } catch (error) {
        res.status(500).send({
            message: err.message || "Something went wrong while creating new user."
          });
    }
}

controller.upload = async (req,res)=>{
    if(!req.body) {
        return res.status(400).send({
        message: "Please fill all required field"
      });
    }
    const baseData = req.body.imageUrl.split(';base64,').pop();
    try {
        fs.writeFile(`../output/${req.body.email}.jpg`,baseData, {encoding: 'base64'},async function(err) {
            if(err){
                res.status(500).send({
                    message: err.message || "Something went wrong while creating new user."
                  });
            }
            if(!err){
              User.findOneAndUpdate({email:req.body.email},{$set:{imageUrl:`${req.body.email}.jpg`}}).then(result=>{
              const responseData = JSON.stringify({data:result});
              res.status(201).send(responseData)
              }).catch(err=>{
                res.status(500).send({
                    message: err.message || "Something went wrong while creating new user."
                  });
              })        
              
            }
        },)
    } catch (error) {
        res.status(500).send({
            message: err.message || "Something went wrong while creating new user."
          });
    }
}

controller.insertMany = async (reqBody)=>{
    if(!reqBody){
        return res.status(400).send({
            message: "Please fill all required field"
        });
       
    }
   
    const players = await reqBody;
    let br = new Promise((resolve,reject)=>{
        players.forEach(async (element,index) => {
        await  User.find({name:element[index + 1],}).then(async(d)=>{
             if(d.length === 0){
                 try {
                    const user =  new User({
                     name: element[index + 1],
                     time : element['time'],
                     amount : element['amount'],
                     distance : element['distance']
                 });
                await user.save()
                 } catch (error) {
                     console.log(error);
                 }
             }
             resolve()
            }).catch(e=>{console.log(e);})
     });
        
    })
    br.then(console.log("done promis"))
}

controller.updateMany = async (player)=>{
    // if(!req.body){
    //     return res.status(400).send({
    //         message: "Please fill all required field"
    //     });
       
    // }
    const players = await player;
    console.log(players);
    // players.forEach(async (element,index) => {
        await  User.find({name:player.name}).then(async(d)=>{
             console.log(d[0].amount);
             let amountCal = await (0.8 * player.distance);
            let time = d[0].time + player.time;
            let amountV =  d[0].amount + amountCal;
            let distance =  d[0].amount + player.distance;
            await User.findOneAndUpdate({name:d[0].name},{time:time,amount:amountV,distance:distance})
            //  User.aggregate(
            // //     [{$group:{
            // //     _id: "$name",
            // //     "amount":{
            // //         $sum : 45
            // //     }
            // //  }}]
            // [{
            //     $group: {
            //         _id: element[index + 1],
            //         amount: { $sum: 22 }
            //     }
            //  }, {
            //     $project: {
            //         _id: element[index + 1],
            //         amount:22
            //     }
            // }]
            //  ,(err,data)=>{
            //     if(err){
            //         console.log(err);
            //     }else{
            //         console.log(data);
            //     }
            //  })
            //  if()
            //  if(d.length === 0){
            //      console.log("no data");
            //      try {
            //                          const user = await new User({
            //          name: element[index + 1]
            //      });
            //      user.save().then(d=>{
            //          console.log(d);
                     
            //      }).cath(e=>{console.log(e);})
            //      } catch (error) {
            //          console.log(error);
            //      }
            //  }
             resolve()
            }).catch(e=>{console.log(e);})
    //  });

}

module.exports = controller;