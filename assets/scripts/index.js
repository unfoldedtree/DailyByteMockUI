function setTime() {
    
    const d = new Date();
    let month = findMonth(d);
    let day = d.getDate();
    let hours = d.getHours();
    let ampm = "";
    if (hours >= 12) {
        ampm = "PM";
        if (hours > 12) {
            hours = hours - 12;
        }
    } else {
        if (hours == 0) {
            hours = 12;
        } 
        ampm = "AM";
    }
    let minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    let timeString = `${hours}:${minutes} ${ampm}`
    let builtString = `${month} ${day}, ${timeString}`
    return builtString
}

function findMonth(date) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return months[date.getMonth()].toUpperCase()
}

// initialize your calendar, once the page's DOM is ready
// $("#calendar").evoCalendar();

function startTime() {
    const headDateString = setTime()
    const today = new Date();
    $(".head-date").text(headDateString);
    setTimeout(startTime, 1000);
}

$(document).ready(function() {
    startTime()
    const d = new Date();
    const month = findMonth(d);
    const day = d.getDate();
    $(".today-month").text(month.substr(0,3));
    $(".today-day").text(day);
});

// $("today-carousel").mousemove(function(e){ 
//   if(curDown === true){
//     window.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY));
//   }
// });