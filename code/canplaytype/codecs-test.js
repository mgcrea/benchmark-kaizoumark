function testCodecs(result){

    var tests = [
        {label: 'H264 baseline',
         type:'video/mp4; codecs="avc1.42E01E"',
         url:'sample_baseline.mp4'},
        {label: 'H264 high',
        type:'video/mp4; codecs="avc1.64001E"',
        url:'sample_high.mp4'},
        {label: 'WebM',
        type:'video/webm; codecs="vp8"',
        url:'sample.webm'}
    ];
    
    var index = 0;

    var sampler = document.createElement('video');
    sampler.style['visibility']='hidden';
    document.body.appendChild(sampler);

    sampler.addEventListener('error', function() { 
        if (this.error.code == 4) { 
            log('Supported: no');
            testNextCodec();
        } 
    }, true);
    
    sampler.addEventListener('loadedmetadata', function() { 
        if (typeof this.duration == 'number') { 
            log('Supported: yes'); 
            testNextCodec();
        } 
    }, true);
    
    function log(str) {
        var p = document.createElement('p');
        p.innerHTML = str;
        result.appendChild(p);
    }
        
	function testNextCodec() {
        if(index<tests.length){
            var cpt = sampler.canPlayType(tests[index].type);
            var result = 'canPlayType(' + tests[index].type + '): ' + (cpt ? cpt : 'no');
            log(tests[index].label + ":" + result);
            sampler.setAttribute('type', tests[index].type);
            sampler.src = tests[index].url;
            index++;
        }
	}
    testNextCodec();

};
