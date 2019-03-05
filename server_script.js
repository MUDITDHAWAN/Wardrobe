const express=require('express');
const app=express();
// const fs= require('fs');
// const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var getConnection = require('./db_pool');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//SERVING STATIC CONTENT

// app.use('/css',express.static('css'));
// app.use('/js',express.static('js'));
app.use('/images',express.static('images'));
app.use('/',express.static(__dirname));
app.use(bodyParser.json());


//SERVING HTML PAGES
app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html')
});
app.get('/login',function(req,res){
	res.sendFile(__dirname +'/login.html')
});
app.get('/dashboard',function(req,res){
	res.sendFile(__dirname +'/closet.html')
});
app.get('/collections',function(req,res){
	res.sendFile(__dirname +'/collections.html')
});
app.get('/add',function(req,res){
	res.sendFile(__dirname +'/adddata.html')
});
app.get('/profile',function(req,res){
	res.sendFile(__dirname +'/profile.html')
});



// display all data from database
app.get('/database',function(req,res){
	getConnection(function(err, con){
		if (err) {
			throw err;
			return;
		}
		console.log('Connection for /database opened');
		//Now do whatever you want with this connection obtained from the pool
		con.query("SELECT * FROM clothes", function (err, result, fields) {
		    if (err){
		    	con.release()
		    	throw err;
		    }
		    console.log(result[0]);
		    con.release();
		    res.send(result)
		});
	});
});

// DISPLAYS DATA FROM RFID
app.post('/data',urlencodedParser,(req,res)=>{
	console.log(req.body);
	getConnection(function(err, con){
		if (err) {
			con.release();
			throw err;
		}
		//Now do whatever you want with this connection obtained from the pool 

		var details=req.body;
		UID=details.rfid.trim();
		var sql= "SELECT * FROM `clothes` WHERE `UID`= '"+UID+"' ;";
		
		con.query(sql, function (err, result, fields) {
			if (err) {
				con.release();
				throw err;
				
			}
		if(!result[0]){
			console.log("ADD ITEM TO INVENTORY FIRST");
			res.redirect('/add')
		}
		else if(result[0].inside==1){
			// ITEMS IS IN WARDROBE, BEING TAKEN OUT
			values=[0,UID];
			con.query("UPDATE clothes SET inside =? WHERE `UID` = ?",values,(err)=>{
				if (err) {
					con.release();
					throw err;
				}
			});
			console.log('Item taken out');
		}else{
			// ITEMS NOT IN WARDROBE, BEING PUT IN
			values=[1,UID];
			con.query("UPDATE clothes SET inside =? WHERE `UID` = ?",values,(err)=>{
				if (err) {
					con.release();
					throw err;
				}
			});
			console.log('Item put in');
		}
		con.release();

		});
	});
});


// ADDING COMPLETELY NEW CLOTH






// 404 if no other route
app.use(function (req, res) {
  res.status(404).sendFile(__dirname+'/404.html');
})

const ip = require("ip"); // gets local IP
var port = process.env.PORT || 8000

app.listen(port, function() {
	console.log('Running now on ' + ip.address() + ":" + port);
});
