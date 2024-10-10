playBtn = document.querySelector(".bx-play");
pauseBtn = document.querySelector(".bx-pause");

let interval;

playBtn.addEventListener('click', function () {

    let hr = document.querySelector(".hour").value;
    let mins = document.querySelector(".mins").value;
    let secs = document.querySelector(".secs").value;
    let total_time = (hr * 3600) + (mins * 60) + (secs);
    

    this.classList.toggle("hidden");
    pauseBtn.classList.toggle("hidden");


    interval = setInterval(function () {
        chrome.tabs.query({}, function(tabs) {

            let inactiveTabIds = tabs.filter(tab => !tab.active).map(tab => tab.id);
            
            if (inactiveTabIds.length > 0) {
                chrome.tabs.remove(inactiveTabIds);
            }
        });
    }, total_time * 1000);
});

pauseBtn.addEventListener('click', function () {
    
    this.classList.toggle("hidden");
    playBtn.classList.toggle("hidden");
    
    
    clearInterval(interval);
});

