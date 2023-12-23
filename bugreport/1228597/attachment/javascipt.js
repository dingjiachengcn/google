// javascript file that works on specific url: Youtube
// sent a message from the content page (need to listen from the event page which is a background script)
// send a message from the content page (need to listen from the event page which is a background script)
chrome.runtime.sendMessage({show: "showPageAction"});

// fires immediately after browser loads the object
window.onload = function(){ 
    /* additional feature
    document.getElementById('toggle_button').onclick = function() {
        var text = document.getElementById('toggle_button').innerHTML;
        if (text == 'Disable') {
            document.getElementById('toggle_button').innerHTML = 'Enable';
    var outerLayer = document.getElementsByClassName('video-ads ytp-ad-module');
    var adPlayerOverlay = document.getElementsByClassName('ytp-ad-player-overlay'); // popup ads in video
    var adImageOverlay = document.getElementsByClassName('ytp-ad-image-overlay');
    var button = document.getElementsByClassName('ytp-ad-skip-button ytp-button');
    var firstAd = document.getElementsByClassName('ytp-ad-text');

    function skipFirstInner(callback) {
        if (adPlayerOverlay[0] && adPlayerOverlay.length > 0) {
            adPlayerOverlay[0].style.visibility = 'hidden';
            callback();
        }
        else {
            document.getElementById('toggle_button').innerHTML = 'Disable';
        else if (adImageOverlay[0] && adImageOverlay.length > 0) {
            adImageOverlay[0].style.visibility = 'hidden';
            callback();
        }
    };
    */
    }

    setInterval(function(){ 
        var outerLayer = document.getElementsByClassName('video-ads ytp-ad-module');
        var firstInnerLayer = document.getElementsByClassName('ytp-ad-player-overlay');
        var secondInnerLayer = document.getElementsByClassName('ytp-ad-persisting-overlay');
        var thirdInnerLayer = document.getElementsByClassName('ytp-ad-overlay-slot');
        var button = document.getElementsByClassName('ytp-ad-skip-button ytp-button');

        // MutationObserver = window.MutationObserver;
        // var observer = new MutationObserver(function(mutations, observer) {
        //     console.log(mutations, observer);
        // });

        // observer.observe(document.getElementsByClassName('video-ads ytp-ad-module')[0], {
        //     subtree: true,
        //     attributes: true
        // });

        // var skip = document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0];
        // special case: ads will end in 5 seconds
        // if(document.getElementById('ad-text:bl') && document.getElementById('ad-text:bl').length > 0) {
        //     console.log("special case!");
        // }

        // if (skip && skip.length > 0) {
        //     skip.click();
        //     console.log('clicked')
        // }
    function clickSkipBtn() {
        if(button[0] && button.length > 0) {
            button[0].click();
        }
    }

    setInterval(function(){ 
        // remove ads that pops up in the video frame
        if (outerLayer && outerLayer.length > 0) {
            if (firstInnerLayer[0] && firstInnerLayer.length > 0)
                firstInnerLayer[0].style.visibility = "hidden";
            if (button[0] && button.length > 0) {
                button[0].click();
            }
            else if (secondInnerLayer[0] && secondInnerLayer.length > 0) {
                document.querySelector('video').currentTime = document.querySelector('video').duration;
                if (button[0] && button.length > 0) {
                    button[0].click();
            clickSkipBtn();
            skipFirstInner(function() {
                if((firstAd && firstAd[2] && firstAd[2].innerHTML.includes('Ad')) ||
                   (firstAd && firstAd[1] && firstAd[1].innerHTML.includes('Ad')) ||
                   (firstAd && firstAd[0] && firstAd[0].innerHTML.includes('Ad'))) {
                    clickSkipBtn();
                    document.querySelector('video').currentTime = document.querySelector('video').duration;
                }
            }
            // block ad popups during the video
            if (thirdInnerLayer[0] && thirdInnerLayer.length > 0) {
                thirdInnerLayer[0].style.visibility = "hidden";
            }

            // if (ads && ads.length > 0) {
                // mute ads first
                // if (document.getElementsByClassName('ytp-mute-button ytp-button')[0] && document.getElementsByClassName('ytp-mute-button ytp-button')[0].title == 'Mute (m)') 
                //     console.log ("mute");
                //     document.getElementsByClassName('ytp-mute-button ytp-button')[0].click()

                // if there's an ad, skip the video
                // document.querySelector('video').currentTime = document.querySelector('video').duration;

                // unmute for actual video content
                // if (document.getElementsByClassName('ytp-mute-button ytp-button')[0] && document.getElementsByClassName('ytp-mute-button ytp-button')[0].title == 'Unmute (m)') 
                //     console.log ("unmute");
                //     document.getElementsByClassName('ytp-mute-button ytp-button')[0].click()
            // }
            // document.getElementsByClassName('video-ads ytp-ad-module')[0].style.visibility = "hidden";
            });
        }

    }, 1);

    // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {todo: "change"})
    // });
}; 