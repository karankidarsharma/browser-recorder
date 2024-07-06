chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "startRecording") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs)=> {
            var currentTab = tabs[0]
            if(currentTab){
                chrome.desktopCapture.chooseDesktopMedia(['screen','window','tab','audio'], currentTab, (streamId) => {
                    if(!streamId || !streamId.length){
                        return sendResponse({status: "Error", message:"Failed to set the stream ID"})
                    }
                    sendResponse({status: "streamId", streamId: streamId})
                })
              
            }else{
                sendResponse({status:"error", message:"something went wrong!"})
            }
            
        })
        return true
    }

    if(request.action === "saveStream") {
        console.log("Saving Stream")
        chrome.storage.local.set({stream: request.data})
        return sendResponse({status: "Saved", message:"stream has been saved"})
    } else {
        return sendResponse({status: "Error", message:"Couldn't save the response"})
    }
})