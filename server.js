const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const socket = require("socket.io");
const crypto = require("crypto");

var  mySqlConnection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '06082002Jg',
    database: 'project',
});

mySqlConnection.connect((err)=>{
    if(err){
        console.log(JSON.stringify(err, undefined, 2));
    }
    else{
        console.log("connected to projectDB");
    }
});

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(`connected to port: ${PORT}`);
    }
});
const io = socket(server);

var user;
var firstName;

app.use(express.static('public'));

app.get('/preGame', (req, res)=>{
    res.sendFile(__dirname + "/html/pregame.html");
});
app.get('/attributes', (req, res)=>{
    res.sendFile(__dirname + "/html/attributes.html");
});
app.get('/login', (req, res)=>{
    res.sendFile(__dirname + "/html/login.html");
});
app.get('/register', (req, res)=>{
    res.sendFile(__dirname + "/html/register.html");
});

app.get('/leaderboard', (req, res)=>{
    res.sendFile(__dirname + "/html/leaderboard.html");
});
app.get('/welcome', (req, res)=>{
    res.sendFile(__dirname + "/html/landing.html");
});

app.post('/login', urlencodedParser, (req, res)=>{
    console.log(req.body);
    mySqlConnection.query("SELECT * FROM users WHERE username = ?", [req.body.username], (err, result)=>{
        hashTwo = crypto.createHash('sha256');
        console.log(result);
        //console.log(results[0].password);
        hashTwo.update(req.body.password);
        var hashedPassword = hashTwo.digest('hex');
        hashTwo.end();
        if(result.length == 0){
            hashTwo.end();
            console.log("loggin failed 0");
            res.sendFile(__dirname + "/html/loginFailed.html");
        }
        else if(hashedPassword == result[0].password){
            hashTwo.end();
            user = req.body.username;
            firstName = result[0].firstName;
            console.log("logged");
            res.sendFile(__dirname + "/html/landing.html");
        }
        else{
            hashTwo.end();
            console.log("loggin failed");
            res.sendFile(__dirname + "/html/loginFailed.html");
        }
    });
});

app.post('/register', urlencodedParser, (req, res)=>{
    console.log(req.body);
    const insertSql = "INSERT INTO users (username, password, firstName, lastName, age) VALUES (?, ?, ?, ?, ?)";
    mySqlConnection.query("SELECT * FROM users WHERE username = ?", [req.body.username], (err, results)=>{
        console.log(results);
        if(results.length == 0){
            const hash = crypto.createHash('sha256');
            hash.update(req.body.password)
            mySqlConnection.query(insertSql, [req.body.username, hash.digest('hex'), req.body.firstName, req.body.lastName, req.body.age], (err, result)=>{
                if(err){
                    hash.end();
                    console.log(JSON.stringify(err, undefined, 2));
                    var insertErr = JSON.stringify(err, undefined, 2);
                    res.send(`<h1>${insertErr}</h1>`);
                }
                else{
                    user = req.body.username;
                    firstName = req.body.firstName;
                    hash.end();
                    res.sendFile(__dirname + "/html/landing.html");
                }
            });
        }
        else{
            res.sendFile(__dirname + "/html/usernameTaken.html");
        }
    });
});

//sockets

let scoreVar;
let difficulty;
let mainValue;

let finalHealth;
let finalSpeed;
let finalDamage;
let finalBulletSpeed;
let finalRegen;

io.on('connection', (socket)=>{
    console.log("New pre-game connection: " + socket.id);
    socket.on('disconnect', ()=>{
        console.log('user disconnected: ', socket.id);
        io.emit('disconnect', socket.id);
    });

    socket.on('finished', (score, difficultyy)=>{
        scoreVar = score;
        difficulty = difficultyy;
        console.log("score variable updated " + scoreVar);
    });

    socket.on('attributeConnection', ()=>{
        socket.emit('getScore', scoreVar);
        console.log("score asked for");
        console.log(scoreVar);
    });

    socket.on('recieveAttributes', (health, speed, damage, bulletSpeed, regen)=>{
        console.log("Attributes recieved!");
        finalHealth = health;
        finalSpeed = speed;
        finalDamage = damage;
        finalBulletSpeed = bulletSpeed;
        finalRegen = regen;
    });

    socket.on('landing', ()=>{
        socket.emit('revieveUser', firstName);
    });

    socket.on('gameOver', ()=>{
        socket.emit('revieveVariables', user, mainValue);
    });

    socket.on('leaderConnect', ()=>{
        mySqlConnection.query("SELECT * FROM scores ORDER BY score DESC", (err, result)=>{
            console.log(result);
            socket.emit('postScores', result);
        });
    });
});

//main game

app.get('/main', (req, res)=>{
    res.sendFile(__dirname + "/html/game.html");
});

app.get('/game/over', (req, res)=>{
    res.sendFile(__dirname + "/html/gameOver.html");
});

const GAMEPORT = process.env.PORT || 8000;
const gameServer = app.listen(GAMEPORT, (err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to port: " + GAMEPORT);
    }
});

const gameio = socket(gameServer);

var players = {};
var bullets = {};
var chests = [];

gameio.on('connection', (socket)=>{
    console.log('a main game user connected:', socket.id);

    players[socket.id] = {
        speed: finalSpeed,
        rotation: 0,
        x: Math.floor(Math.random()*3052)+10,
        y: Math.floor(Math.random()*2380)+10,
        playerId: socket.id,
        health: finalHealth,
        bulletSpeed: finalBulletSpeed,
        fireRate: 200,
        regenPerKill: finalRegen,
        damage: finalDamage,
      };
    
    bullets[socket.id] = {
        x: players[socket.id].x + (97 * Math.sin(players[socket.id].rotation)),
        y: players[socket.id].y + (-97 * Math.cos(players[socket.id].rotation)),
        rotation: players[socket.id].rotation,
        bulletId: socket.id,
        bulletSpeed: players[socket.id].bulletSpeed,
    };

    for(var i = 0; i < 15; i ++){
        chests[i] = {
            x: Math.floor(Math.random()*3052)+10,
            y: Math.floor(Math.random()*2380)+10,
            size: Math.random()*3,
            index: i,
        }
    }

    socket.on('connected', ()=>{
        players[socket.id].health = finalHealth;
        players[socket.id].speed = finalSpeed;
        players[socket.id].damage = finalDamage;
        players[socket.id].bulletSpeed = finalBulletSpeed;
        players[socket.id].regenPerKill = finalRegen;

        socket.emit('currentPlayers', players);
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });
    
    socket.on('disconnect', function () {
        console.log('user disconnected: ', socket.id);
        delete players[socket.id];
        socket.broadcast.emit('remove', socket.id);

        io.emit('remove', socket.id);
      });

  socket.on('playerMovement', function(movementData){
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;

    bullets[socket.id].x = movementData.x + (97 * Math.sin(movementData.rotation));
    bullets[socket.id].y = movementData.y + (-97 * Math.cos(movementData.rotation));
    bullets[socket.id].rotation = movementData.rotation;

    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('keypress', ()=>{
      socket.emit('fire', bullets);
  });

  socket.on('emitBullets', function(inputBullet, rotation){
    socket.broadcast.emit('otherBullets', inputBullet, bullets[socket.id], rotation, bullets[socket.id].bulletSpeed);
  });

  socket.on('serverChests', ()=>{
    socket.emit('addChests', chests);
  });

  socket.on('died', (value)=>{
      mainValue = value;
    console.log('died.');
    mySqlConnection.query("INSERT INTO scores (username, score, difficulty) VALUES (?, ?, ?)", [user, value, difficulty], (err, result)=>{
        if (err) throw err;
        console.log('added.');
    });     
  });
});