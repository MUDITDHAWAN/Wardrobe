const express=require('express');
const app=express();
const fs= require('fs');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const bodyParser = require('body-parser');
// var getConnection = require('./db_pool');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//
// getConnection(function(err, con){
// 		if (err) {
// 			throw err;
// 		}
// 		console.log('Connected to DB using #1 con from pool');
// 		//Now do whatever you want with this connection obtained from the pool
// });


//SERVING STATIC CONTENT

// app.use('/css',express.static('css'));
// app.use('/js',express.static('js'));
app.use('/images',express.static('images'));
// app.use('/icons',express.static('css'));
app.use('/',express.static(__dirname));
app.use(bodyParser.json());


//SERVING HTML PAGES
app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html')
});


//SERVING JSON DB DATA
// app.get('/data',function(req,res){ //ADD authCheck MIDDLEWARE
// 	getConnection(function(err, con){
// 		if (err) {
// 			throw err;
// 			return;
// 		}
// 		// console.log('Connection for /data opened');
// 		//Now do whatever you want with this connection obtained from the pool
// 		con.query("SELECT * FROM event_data", function (err, result, fields) {
// 		    if (err){
// 		    	con.release()
// 		    	throw err;
// 		    }
// 		    con.release();
// 		    var today = new Date();
// 			var dd = today.getDate();
// 			var mm = today.getMonth()+1; //January is 0!
// 			var yyyy = today.getFullYear();

// 			var hh = today.getHours();
// 			var min= today.getMinutes();
// 			var ss = today.getSeconds();

// 			function twodigit(x){
// 				if(x<10){
// 					x='0'+x;
// 				}
// 				return x
// 			};

// 			mm= twodigit(mm);
// 			dd= twodigit(dd);
// 			hh= twodigit(hh);
// 			min= twodigit(min);
// 			ss= twodigit(ss);
// 			var curr_date = dd+'-'+mm+'-'+yyyy;
// 			var curr_time = hh+':'+min+':'+ss;
// 			var curr_date_time= curr_date+' '+curr_time;

// 		    console.log('['+curr_date_time+']','Data Requested');

// 		    // console.log(result[0]);
// 		    // data=[initialEventinfo];
// 		    data=[];
// 			var i=0;
// 			while(i<result.length){
// 				var Eventinfo={
// 					created: result[i].created,
// 				    key: result[i].event_key,
// 				    title: result[i].title,
// 				    date: result[i].date,
// 				    description:result[i].description,
// 				    img: result[i].img,
// 				    club: result[i].club,
// 				    venue: result[i].venue

// 				};
// 				data.push(Eventinfo);
// 				i++;
// 			};
// 			//Now order objects in data by 'date' i.e. data[i].date before sending
// 			var i;
// 			var len=data.length;
// 			for (i = 0; i < data.length; i++){
// 				for(j=0; j<len-1; j++){
// 					if (data[j].date>data[j+1].date){
// 						var temp=data[j+1];
// 						data[j+1] = data[j];
// 						data[j] = temp;
// 					}
// 				}
// 				len--;
// 			}

// 			res.send(data);
//     	});

// 	});
// });


app.post('/data',urlencodedParser,(req,res)=>{
	console.log('RFID DATA')
	console.log(req.body);
})



//FORM SUBMIT

// USE THIS FOR UPLOADING ON SERVER
// app.use(fileUpload());
// app.post('/upload', urlencodedParser,function(req, res) {
// 	console.log(req.user.club,' added an event');
// 	// if (!req.files)
// 	// 	return res.status(400).send('No files were uploaded.');
//  //    	getConnection(function(err, con){
// 	// 		if (err) {
// 	// 			con.release();
// 	// 			throw err;
// 	// 		}
// 	// 		//Now do whatever you want with this connection obtained from the pool

// 	//     	con.query("SELECT * FROM event_data", function (err, result, fields) {
// 	// 		    if (err){
// 	// 		    	con.release();
// 	// 		    	throw err;

// 	// 		    }

// 	// 		    if(result.length==0){
// 	// 		    	console.log('DB is empty, resetting AUTO_INCREMENT')
// 	// 		    	con.query('ALTER TABLE event_data AUTO_INCREMENT = 1;',(err)=>{
// 	// 		    		if (err) {
// 	// 		    			con.release();
// 	// 		    			throw err;
// 	// 		    		}

// 	// 		    	})
// 	// 		    	var key=1;
// 	// 		    }else{
// 	// 		    	// console.log('The last record is');
// 	// 		    	// console.log(result[result.length-1]);
// 	// 		   		prevkey=result[result.length-1].event_key;
// 	// 		    	var key=prevkey+1;
// 	// 		    }


// 	// 			// console.log('key is '+key);
// 	// 			event_image=req.files.event_image;

// 	// 			filename=req.files.event_image.name;
// 	// 			extension=filename.slice(filename.indexOf('.'));
// 	// 			// console.log(filename);
// 	// 			// console.log(extension);
// 	// 			event_image.mv(__dirname+'/images/'+key+extension, function(err) {
// 	// 		    	if (err)
// 	// 		      		return res.status(500).send(err);

// 	// 		     	res.redirect('../');
// 	// 			});


// 	// 			// var key=1;


// 	// 		  	var sql= "INSERT INTO event_data VALUES ?";
// 	// 		  	var details=req.body;
// 	// 		  	event_name=details.event_name;
// 	// 		  	event_time=details.event_time;
// 	// 		  	event_date=details.event_date;

// 	// 		 	event_date_time=event_date+' '+event_time

// 	// 		  	event_desc=details.event_desc;
// 	// 		  	event_imgpath=key+extension;
// 	// 		  	event_venue=details.event_venue;

// 	// 			var today = new Date();
// 	// 			var dd = today.getDate();
// 	// 			var mm = today.getMonth()+1; //January is 0!
// 	// 			var yyyy = today.getFullYear();

// 	// 			var hh = today.getHours();
// 	// 			var min= today.getMinutes();
// 	// 			var ss = today.getSeconds();

// 	// 			if(dd<10){
// 	// 			dd='0'+dd;
// 	// 			}
// 	// 			if(mm<10){
// 	// 			mm='0'+mm;
// 	// 			}
// 	// 			var curr_date = yyyy+'-'+mm+'-'+dd;
// 	// 			var curr_time = hh+':'+min+':'+ss;
// 	// 			var curr_date_time= curr_date+' '+curr_time;
// 	// 			// var club =details.club;

// 	// 			if(!req.user.superuser==1){
// 	// 				club=req.user.club
// 	// 			}else{
// 	// 				club =details.club
// 	// 			}


// 	// 		 	var values=[[,event_name,event_date_time,event_desc,event_imgpath,curr_date_time,event_venue,club]];

// 	// 		    con.query(sql, [values], function (err, result) {
// 	// 		    	if (err) {
// 	// 		    		con.release();
// 	// 		    		throw err;
// 	// 		    	}
// 	// 		    	console.log("Event Added");
// 	// 		    	newkey=result.insertId;
// 	// 		    	values=[newkey+extension,newkey];
// 	// 		    	con.query("UPDATE event_data SET img =? WHERE `event_key` = ?",values,(err)=>{
// 	// 		    		if (err) {
// 	// 		    			con.release();
// 	// 		    			throw err;
// 	// 		    		}

// 	// 		    	});
// 	// 		    	fs.rename(__dirname+"/images/"+key+extension,__dirname+"/images/"+newkey+extension,(err)=>{
// 	// 		    		if (err) throw err;

// 	// 					//	************************************************
// 	// 					//	SEND NOTIFICATION
// 	// 					//	************************************************

// 	// 					const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// 	// 				    edate=new Date(event_date_time);
// 	// 				  	dayName = edate.toString().split(' ')[0];
// 	// 				  	monthName= monthNames[edate.getMonth()];
// 	// 				  	d= edate.getDate();
// 	// 				  	function nth(d) {
// 	// 					    if(d>3 && d<21) return 'th';
// 	// 					    switch (d % 10) {
// 	// 					          case 1:  return "st";
// 	// 					          case 2:  return "nd";
// 	// 					          case 3:  return "rd";
// 	// 					          default: return "th";
// 	// 					    }
// 	// 					}
// 	// 				    function formatAMPM(date) {
// 	// 					    var hours = date.getHours();
// 	// 					    var minutes = date.getMinutes();
// 	// 					    var ampm = hours >= 12 ? 'pm' : 'am';
// 	// 					    hours = hours % 12;
// 	// 					    hours = hours ? hours : 12; // the hour '0' should be '12'
// 	// 					    minutes = minutes < 10 ? '0'+minutes : minutes;
// 	// 					    var strTime = hours + ':' + minutes + '' + ampm;
// 	// 					    return strTime;
// 	// 				    }
// 	// 				    time=formatAMPM(edate);

// 	// 				    edate=dayName+' '+monthName+' '+d+nth(d)+' '+time;

// 	// 					const payload = JSON.stringify({
// 	// 						title: "Event "+event_name+' by '+club,
// 	// 						options:{
// 	// 							body: 'New Event on '+edate+' \nVenue: '+event_venue,
// 	// 							icon: 'icons/events.png',
// 	// 							badge: 'icons/monochrome1.png',
// 	// 							vibrate: [500,110,500,110], // STAR WARS
// 	// 							actions: [
// 	// 						        {
// 	// 						          action: "knowmore",
// 	// 						          title: 'Know More'
// 	// 						        }
// 	// 						      ],
// 	// 						    data: {event_key: newkey}
// 	// 						}
// 	// 					});

// 	// 					con.query('SELECT * FROM subscriptions', (err,result,fields)=>{
// 	// 						con.release();
// 	// 						// console.log(result[0].subscription_obj);
// 	// 						i=0;
// 	// 						while(i<result.length){
// 	// 							subscription = JSON.parse(result[i].subscription_obj);
// 	// 							webpush.sendNotification(subscription,payload).catch(err=> console.error('webpush err'));
// 	// 							i++;
// 	// 						}

// 	// 					});
// 	// 		    	});
// 	// 		    });
// 	// 		});

// 	// 	});

// });










// 404 if no other route
app.use(function (req, res) {
  res.status(404).sendFile(__dirname+'/404.html');
})

const ip = require("ip"); // gets local IP
var port = process.env.PORT || 8000

app.listen(port, function() {
	console.log('Running now on ' + ip.address() + ":" + port);
});
