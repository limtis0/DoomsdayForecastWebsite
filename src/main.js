const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function dateFormatMonthframe(date){ return `${months[date.getMonth()]}, ${date.getDate()}`; }
function dateFormatButtons(date){ return `${months[date.getMonth()]}\n${date.getDate()}`; }

// Filling monthframe
var date = new Date();
date.setDate(date.getDate() - 1);

// Filling monthframe
document.getElementById("monthframe").textContent = dateFormatMonthframe(date);

// Filling buttons with current dates
var buttons = document.getElementById("calendar").getElementsByTagName("button");
for (var i = 0; i < buttons.length; i++)
{
    buttons[i].textContent = dateFormatButtons(date);
}


