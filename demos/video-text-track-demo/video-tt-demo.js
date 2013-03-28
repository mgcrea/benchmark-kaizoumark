// video-tt-demo.js
// Copyright David Corvoysier 2012
// http://www.kaizou.org

window.addEventListener("load",init,false);
var video;
function init(event){
    video = document.getElementById("video");
}
function setSubtitle(se){
    language = se.options[se.selectedIndex].value;
    tracks = video.textTracks;
    for(var j=0; j < tracks.length;j++){
        track = video.textTracks[j];
        if(track.kind === "subtitles"){
            if(track.language == language){
                track.mode = 'showing';
            }else{
                track.mode = 'disabled';
            }
        }
    }
} 
function displayChapters(trackElt){
    if((trackElt) && (textTrack = trackElt.track)){
        if(textTrack.kind === "chapters"){
            textTrack.mode = 'hidden';
            var chapterBlock = document.getElementById("chapters");
            for (var i = 0; i < textTrack.cues.length; ++i) {
                var cue = textTrack.cues[i];
                var input = document.createElement("input");
                input.type = "radio"
                input.name = "chapters"
                input.value = cue.startTime;
                input.id = "CHAPTERID" + cue.startTime;
                input.addEventListener("click",
                                        function(evt){
                                            var canvas = document.getElementById('canvas');
                                            var ctx = canvas.getContext('2d');
                                            ctx.drawImage(video,0, 0,video.videoWidth,video.videoHeight,0,0,canvas.width,canvas.height);
                                            video.currentTime = this.value;
                                            canvas.className = 'front';
                                            video.className = 'back';
                                            var flipper = document.getElementById('flipper');
                                            flipper.addEventListener('webkitTransitionEnd',
                                                                    function(){
                                                                        flipper.className = '';                                                                        
                                                                        canvas.className = 'back';
                                                                        video.className = 'front';
                                                                    },false);
                                            flipper.className = 'rotating';
                                        },
                                        false);
                chapterBlock.appendChild(input);
                var label = document.createElement("label");
                label.setAttribute("for",input.id);
                label.innerHTML = cue.text;
                chapterBlock.appendChild(label);
            }
            textTrack.addEventListener("cuechange",
                                        function(evt){
                                            var chapterId = "CHAPTERID" + this.activeCues[0].startTime;
                                            if(chapter = document.getElementById(chapterId)){
                                                chapter.checked = true;
                                            }
                                        },
                                        false);
        }
    }
}
