const streamMusic='https://api.mp3.zing.vn/api/streaming/audio/';
const searchApi="https://ac.mp3.zing.vn/complete?type=artist,song,key,code&num=500&query=";
let isPlay=true;
const player=document.querySelectorAll(".block_play");
var playIcon=player[1].querySelector('.bi-pause')
const audio = document.querySelector('#audio');
const inforMusic=document.querySelector('.name__Siger');
var nameMusic=inforMusic.getElementsByTagName("<h2>");
var singer=inforMusic.getElementsByTagName("<h3>")
let currenIndex=0;
var imgBottom=document.querySelector(".img__bottom img");
var imgPlay=document.querySelector(".img__play img");
var renderListSong=document.querySelector(".list");
var renderMusic=document.querySelector('.ranger_music h4');
var rangeElement=document.getElementById("input__range");
var searchSong=document.getElementById("search_song");
var searchButton=document.getElementById("btn__search");
var title=document.querySelector(".header.title");
var queryImg=document.querySelector(".img__play img");
player[1].onclick=function () {
    if(isPlay===false){
        player[1].innerHTML=`<i class="bi bi-pause"></i>`;
        isPlay=true;
    
        audio.play();
    }else{
        player[1].innerHTML=`<i class="bi bi-play"></i>`;
        isPlay=false;
      
        audio.pause();
    } 

}
player[0].onclick=function () {
    currenIndex--;
    if(currenIndex<0){
        currenIndex=99;
    }
    renderCurrentMusic(arrayObject[currenIndex])
}
player[2].onclick=function (params) {
   currenIndex++;
   renderCurrentMusic(arrayObject[currenIndex])

}
var arrayObject=[];
//get Api zing mp3 music
const apiZingChart="https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1";
 function Start() {
      audio.currentTime=0;
      getData(function (data) {
      arrayObject= data.data.song.map(function (e,index) {
          return {
              'index':index,
              'id':e.id,
              'name':e.name,
              'singer':e.artists_names,
              'img':e.thumbnail,
              'stream':`${streamMusic}${e.id}/320`,
          }
      })
 
      render(arrayObject)
     if(arrayObject[currenIndex].stream!=undefined){
        renderCurrentMusic(arrayObject[currenIndex]);
     }
    })
 }
 let getData =(callback)=>{
    fetch(apiZingChart)
    .then(response => response.json())
    .then(data =>callback(data))
    .catch(function () {
        alert("Mạng yếu quá.Vào lại sau nhé!");
    })
 }
 Start();


function renderCurrentMusic (song) {
    audio.src=song.stream;
    const promise=new Promise(function (resolve,rejcect) {
        return resolve(song.stream);
    }).then(function (data) {
        audio.src=data;
    })
  var pm= audio.play();
  if (pm !== undefined) {
    pm.then(() => {
     audio.play();
    }).catch(error => {
      console.log("waitting")
      audio.play();
    });
  }

    inforMusic.innerHTML=`
    <h2>${song.name}</h2>
    <h3>${song.singer}</h3>`
    imgBottom.src=song.img;
    imgPlay.src=song.img;   
 
 }
 var imgDefaul= '/img/td1.png';
function render(data) {
    var htmlRender='';
    data.forEach(element => {
         if(element.singer==undefined){
            element.singer='';
            element.img=imgDefaul;
         }
        htmlRender+=`<li>
        <img src="${element.img}" alt="">
        <div class="infor__song">
           <div class="name__infor">
               <h3>${element.name}</h3>
               <h4>${element.singer}</h4>
           </div>
            <div class="timer">
               <h5></h5>
           </div>
           <div class="btnPlay">
               <button onclick="playSong(${element.index})"> <i class="bi bi-play"></i></button>
           </div>
        </div>
    </li>`
    });
    renderListSong.innerHTML=htmlRender;
}
function playSong (id) {
    audio.currentTime=0;
    currenIndex=id;
    renderCurrentMusic(arrayObject[currenIndex])
}
var drs;
var curs;
function updateTrackTime(track){
    var currTimeDiv = document.getElementById('currentTime');
    var durationDiv = document.getElementById('duration');
  
    var currTime = Math.floor(track.currentTime).toString(); 
    var duration = Math.floor(track.duration).toString();
    currTimeDiv.innerHTML = formatSecondsAsTime(currTime);
    drs=duration;
    curs=currTime;
    if (isNaN(duration)){
      durationDiv.innerHTML = '00:00';
    } 
    else{
      durationDiv.innerHTML = formatSecondsAsTime(duration);
    }
    rangeElement.value=(currTime/duration)*100;
  }
  function formatSecondsAsTime(secs, format) {
    var hr  = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
  
    if (min < 10){ 
      min = "0" + min; 
    }
    if (sec < 10){ 
      sec  = "0" + sec;
    }
  
    return min + ':' + sec;
  }
  rangeElement.onchange=function () {
    var valueof = rangeElement.value;
     rangeElement.value=valueof;
      audio.currentTime=(valueof/100)*drs;
      audio.play(); 
}
var arraySong=[];
searchButton.onclick=function () {
    searchSong.style.display="block";
    title.style.display="none";
    var strSearch=searchSong.value;
   if(searchSong!=true){  
       
        search(strSearch,function (songs) {
          
            if(songs.result===true){
                arrayObject=songs.data[0].song.map(function (element,index) {
                    return {
                        'index':index,
                        'id':element.id,
                        'name':element.name,
                        'singer':element.artists_names,
                        'img':element.thumbnail,
                        'stream':`${streamMusic}${element.id}/320`,
                    }
                })
                render(arrayObject);
            }else{
                      
            }
        });
    } 
}
function search(strSearch,callback) {
var urlSearch=searchApi+strSearch;
console.log(urlSearch);
fetch(urlSearch)
.then(function (response) {
    return response.json();
})
.then(function(data){
   callback(data);
})
.catch(function (reason) {
    console.log(reason);
})
}