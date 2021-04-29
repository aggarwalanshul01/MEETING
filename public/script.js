const socket= io();

const video_grid=document.getElementById('video-grid');
const myvideo=document.createElement('video');
const mypeer=new Peer()
myvideo.muted=true;
console.log(video_grid);
let myvideostream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:false
}).then((stream)=>{
    myvideostream=stream;
    addVideoStream(myvideo,stream);

    mypeer.on('call',(call)=>{
        call.answer(stream)
        const video=document.createElement('video')
        call.on('stream',(userVideoStream)=>{
            addVideoStream(video,userVideoStream);
        })
    })

    socket.on('user-connected',userid=>{
        connecToNewUser(userid,stream);
    })
})
let peers={}
socket.on('user-disconnected',(userid)=>{
    if(peers[userId]) peers[userid].close()
})

mypeer.on('open',id=>{
 //   console.log("ppppppp");
    socket.emit('join-room',ROOM_ID,id);
})

const connecToNewUser=(userId,stream)=>{
    const call=mypeer.call(userId,stream);
    const video= document.createElement('video');
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream);
    })
    call.on('close',()=>{
        video.remove()
    })
    peers[userId]=call
}

let addVideoStream=(myvideo,stream)=>{
    myvideo.srcObject=stream;
    myvideo.addEventListener('loadedmetadata',()=>{
        myvideo.play();
    })
    video_grid.append(myvideo);
}