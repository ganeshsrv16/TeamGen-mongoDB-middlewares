let express = require('express')
let http=require('http');
let os = require('os');
const logger = require('morgan');
let readline=require('readline');
let path=require('path');
let shuffle = require('shuffle-array');
let bodyparser=require('body-parser');
let app = express();
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/ganesh";                // db created is ganesh//
let fs=require('fs');



app.use("/css",express.static(path.join(__dirname + "/css", 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'))
app.use(bodyparser());

//log generation of user//
app.use(function (req, res,next) {
var userlog= fs.createWriteStream("userlog.txt", { 'flags': 'a' });
userlog.write("\r\nAccessed at  " + new Date() + "\r\n");
userlog.end();
next();
});

//rendering the main user page//
app.get('/', (req, res) => {
res.render('contact')
})

//getting the values from user//
app.post('/contact',function(req,res,next)
{
var fp=req.body.path;
var size=req.body.teamsize;
var err1=new Error();

if(size==0)    //error is passed to middlewares//
    {
    err1.status=600;
    next(err1);
    }
else
{
fs.readFile(fp, function (err, data) {
        if(err)
        {
        console.log("Error");
        }
       else if(!data)
               {
               console.log("No data");
               }
       else
       {
        MongoClient.connect(url, function(err, db)  //connecting to mongoDB//
        {
           var err1=new Error();
           if(err)
           {
              res.render("dberror");
           }
           else{

            var dbase = db.db("ganesh");
           var jar = JSON.parse(data);
          dbase.collection("BerkAspirants").insertMany(jar, function(err, doc) {      // collection created//
          if (err) throw err;
        
                     else{
                dbase.collection('BerkAspirants').find({}).toArray(function(err, result) {      //getting the collection items//
                if (err) throw err;
               var ao=result;
               let asl=ao.length;
               
               let stream = fs.createWriteStream('D:/berkteams.txt');       
                            if(size>asl)                        //error is passed to middlewares//
                                  {
                                  err1.status=400;
                                   next(err1);
                                         }
                                     else
                                     {
                                    var n = Math.ceil(asl /size);     
                                    var a=0;
                                    var i = ao.length;
                                    var q = ao.length;
                                     var n=size;
                                     var arr=[];
                                       var t=0;
                                            for(w=0;w<q;w++)
                                                 {
                                                 arr.push(t);
                                                    t++;
                                                      }
                                             shuffle(arr);
                                             var rem=i%n;
                                             var qo=Math.floor(i/n);
                                              var b=0;
                                            for(var k=1;k<=qo;k++)
                                                 {
                                            console.log("=======================");
                                             stream.write("========================="+os.EOL);
                                                            stream.write("\nTeam"+k+os.EOL);
                                                      console.log("\nTeam"+k);
                                                 b=b+Math.floor(size);
                                                  for(var s=a;s<i;s++)
                                                     {
                                                     if(s==b)
                                                        {
                                                        a=b;
                                                         break;
                                                            }
                                                      var u=arr[s];
                                                    console.log("--------------------------");
                                                    stream.write("-----------------------------"+os.EOL);
                                                    console.log("Name:"+ao[u].name);
                                                    console.log("Branch:"+ao[u].branch);
                                                    console.log("Favourite Language:"+ao[u].favlang);
                                                   stream.write("Name:"+ao[u].name+os.EOL);
                                                   stream.write("Branch:"+ao[u].branch+os.EOL);
                                                  stream.write("Favourite Language:"+ao[u].favlang+os.EOL);
                                                               }
                                                              }
                                                stream.write("\n\n"+os.EOL);
                                                stream.write("******************************************************"+os.EOL);
                                                         for(var p=b;p<i;p++)
                                                                 {
                                                                var t=arr[p];
                                                      console.log("-------------------");
                                                      stream.write("----------------------"+os.EOL);
                                                      stream.write("Remaining people"+os.EOL);
                                                       console.log("\nRemaining people");
                                                       console.log("Name:"+ao[t].name);
                                                      console.log("Branch:"+ao[t].branch);
                                                     console.log("Favourite Language:"+ao[t].favlang);
                                                    stream.write("Name:"+ao[t].name+os.EOL);
                                                    stream.write("Branch:"+ao[t].branch+os.EOL);
                                                     stream.write("Favourite Language:"+ao[t].favlang+os.EOL);
                                                                       }
                                                                    }
                                                       db.close();
                                                  });
                                                  }
                                                 });
                                                 }
                                                });
                                                
                                                 }
                                                 });
                                                  } 
                                                });



// middlewares error handling//
 app.use(function(err1,req,res,next)
{
       if(err1.status==400)
        {
          res.render('error2')
             }
next(err1);
});             

app.use(function(err1,req,res,next)
{
        if(err1.status==600)
        {
    res.render('error1');
         }
         next(err1);
});
app.use(function(err1,req,res,next)
{
        if(err1.status==500)
        {
    res.render('error3');
         }
         
});

    app.listen(8080,(err)=>{
    console.log("listening to port 8080");
});
