const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function dateFormatMonthframe(date){ return `${months[date.getMonth()]}, ${date.getDate()}`; }
function dateFormatButtons(date){ return `${months[date.getMonth()]}\n${date.getDate()}`; }

function setMonthFrame(currentDate)
{
    let yesterdayDate = new Date();
    yesterdayDate.setDate(currentDate.getDate() - 1);

    let lastDate = new Date();
    lastDate.setDate(currentDate.getDate() + 3); // Five days summary

    document.getElementById("monthframe").textContent = `${dateFormatMonthframe(yesterdayDate)} - ${dateFormatMonthframe(lastDate)}`;
}

function fillButtons(currentDate)
{
    let date = new Date();
    date.setDate(currentDate.getDate() - 1); // Fills from yesterday

    let buttons = document.getElementById("calendar").getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].textContent = dateFormatButtons(date);
        date.setDate(date.getDate() + 1);
    }
}

function selectButton(buttonId)
{
    // Deselects all buttons and selects chosen one
    let buttons = document.getElementById("calendar").getElementsByTagName("button");
    let currentButton;
    for (let i = 0; i < buttons.length; i++)
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
    showEvent(getCalendarItem(buttonId));
    switchBackgrounds(getCalendarItem(buttonId).backgroundURL); // TODO add picture change support
}

function getCalendarItem(buttonId)
{
    switch(buttonId)
    {
        case "calendar-button-0":
            return calendar[0];
        case "calendar-button-1":
            return calendar[1];
        case "calendar-button-2":
            return calendar[2];
        case "calendar-button-3":
            return calendar[3];
        case "calendar-button-4":
            return calendar[4];                                       
    }
}

class CalendarItem
{
    constructor(eventName, temperature, iconURL, motd, backgroundURL)
    {
        this.eventName = eventName;
        this.temperature = temperature;
        this.iconURL = iconURL;
        this.motd = motd;
        this.backgroundURL = backgroundURL;
    }
}

function showEvent(day)
{
    document.getElementById("event-name").textContent = day.eventName;
    document.getElementById("temp").textContent = `${day.temperature}°C`;
    document.getElementById("event-icon").src = day.iconURL;
    document.getElementById("motd").textContent = day.motd;
}

var background0 = false; // Bool to get current background
function switchBackgrounds(backgroundURL)
{
    background0 ? document.getElementById("background-image-1").src = backgroundURL : document.getElementById("background-image-0").src = backgroundURL;
    background0 = background0 ? false : true;
    document.getElementById("background-image-1").classList.toggle("transparent");
}

function preloadImage(url) { new Image().src = url; }

async function fetchAsync (url)
{
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

// MAIN
var currentDate;
var calendar = [];

async function main()
{
    // Builds page based on currentDate
    let dateResponse = await fetchAsync("http://127.0.0.1:3000/api/current-date");
    currentDate = new Date(Date.parse(dateResponse));
    setMonthFrame(currentDate);
    fillButtons(currentDate);

    // Gets events for 5 days from DB
    let calendarResponse = await fetchAsync("http://127.0.0.1:3000/api/weekly-events");
    let curItem;
    for (i = 0; i < 5; i++)
    {
        curItem = calendarResponse[i];
        preloadImage(curItem.icon);
        preloadImage(curItem.background);
        calendar[i] = new CalendarItem(curItem.name, curItem.temp, curItem.icon, curItem.phrase, curItem.background);
    }

    selectButton("calendar-button-1");
}

main();