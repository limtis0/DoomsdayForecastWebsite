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

function selectButton(buttonId)
{
    // Deselects all buttons and selects chosen one
    var buttons = document.getElementById("calendar").getElementsByTagName("button");
    var currentButton;
    for (var i = 0; i < buttons.length; i++)
    {
        currentButton = buttons[i];
        if(currentButton.id == buttonId)
        {
            currentButton.classList.remove('button-unselected');
            currentButton.classList.add('button-selected');
        }
        else
        {
            currentButton.classList.remove('button-selected');
            currentButton.classList.add('button-unselected');
        }
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


// MAIN
var date = new Date();
setMonthFrame(date);
fillButtons(date);
selectButton("calendar-button-1");

let day = new CalendarItem("Sun explosion", 999999, "icons/witch.svg", "Turn the AC on", "backgrounds/hell.png");
showEvent(day);
