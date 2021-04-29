const express=require('express');
const app=express();
const server=require('http').Server(app);
const {v4}=require('uuid');
const socket=require('socket.io');
const io=socket(server);

app.use('/',express.static(__dirname+'/public'));
app.set('views',__dirname+'/views');
app.set('view engine', 'hbs');

app.get('/',(req,res)=>{
    res.redirect(`/${v4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomid:req.params.room});
})

io.on('connection',(socket)=>{
    socket.on('join-room',(roomid,userId)=>{
      //  console.log(userId,'joined');
        socket.join(roomid);
        socket.to(roomid).emit("user-connected",userId);

        socket.on('disconnect',()=>{
            socket.to(roomid).emit('user-disconnected',userId)
        });
    });
    
})

server.listen(4444,()=>{
    console.log("SERVER STARTED ON http://localhost:4444");
})