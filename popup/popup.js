document.addEventListener('DOMContentLoaded', function(){



    const startBtn = document.getElementById("startBtn")
    const stopBtn = document.getElementById("stopBtn")
    

    let mediaRecorder;
    let recordedChunks = []
    
    startBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({action:"startRecording"}, async (response) => {
            if(response.status === "streamId"){

                try {

                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            mandatory:{
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: response.streamId
                            }
                        }
                    })

                    
                    handleStream(stream)
                    
                } catch(err){
                    console.error("Error ", err)
                }

            }else {
                console.error(response.message)
            }
        })
    })

    
        stopBtn.addEventListener('click', () => {
            mediaRecorder.stop();
            startBtn.disabled = false
            stopBtn.disabled = true
        })
    

    function handleStream(stream) {
        // chrome.storage.local.set({stream: stream})
        // chrome.runtime.sendMessage({action:"saveStream", data: stream}, async (response) => {
        //         console.log(response.message)
        // })
        recordedChunks = []
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (event) => {
            if(event.data.length > 0){
                recordedChunks.push(event.data)
                console.log(event.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob (recordedChunks, {type : 'video/webm'})
            const url = URL.createObjectURL(blob)

            chrome.storage.local.set({dataFile: url})
            chrome.tabs.create({ url: `chrome-extension://${chrome.runtime.id}/edit.html` });
   
        }

        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;

    }

})