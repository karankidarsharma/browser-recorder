chrome.storage.local.get(['dataFile'], function(data){
            
    document.getElementById('recordedVideo').src = result.dataFile
    console.log("Video loaded...")

})