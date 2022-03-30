const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function dateFormatMonthframe(date){ return `${months[date.getMonth()]}, ${date.getDate()}`; }
function dateFormatButtons(date){ return `${months[date.getMonth()]}\n${date.getDate()}`; }

function setMonthFrame(currentDate)
{
    var yesterdayDate = new Date();
    yesterdayDate.setDate(currentDate.getDate() - 1);

    var lastDate = new Date();
    lastDate.setDate(currentDate.getDate() + 3); // Five days summary

    document.getElementById("monthframe").textContent = `${dateFormatMonthframe(yesterdayDate)} - ${dateFormatMonthframe(lastDate)}`;
}

function fillButtons(currentDate)
{
    var date = new Date();
    date.setDate(currentDate.getDate() - 1); // Fills from yesterday

    var buttons = document.getElementById("calendar").getElementsByTagName("button");

    for (var i = 0; i < buttons.length; i++)
    {
        buttons[i].textContent = dateFormatButtons(date);
        date.setDate(date.getDate() + 1);
    }
}

class CalendarItem
{
    constructor(eventName, temperature, iconURL, motd, backgroundURL)
    {
        this.eventName = eventName;
        this.temperature = temperature;
        this.logoURL = iconURL;
        this.motd = motd;
        this.backgroundURL = backgroundURL;
    }
}

function showEvent(day)
{
    document.getElementById("event-name").textContent = day.eventName;
    document.getElementById("temp").textContent = `${day.temperature}°C`;
    document.getElementById("event-icon").src = day.logoURL;
    document.getElementById("motd").textContent = day.motd;
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${day.backgroundURL})`;
}

var date = new Date();
setMonthFrame(date);

// Filling buttons with current dates
fillButtons(date);

let day = new CalendarItem("Sun explosion", 999999, "./witch.svg", "Turn the AC on", "hell.png");

showEvent(day);
