const cors = require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true, //access-control-allow-credentials:true
   optionSuccessStatus:200
}

const express = require("express");
const app = express();
const port = 3000;

const pool = require("./js/databases")

app.use(express.json());
app.use(cors(corsOptions));

// ROUTES
app.get("/api/current-date", (req, res) => {
   try {
       currentDate = getCurrentDate();
       res.json(currentDate);
   } catch (err) {
       console.error(err.message);
   } 
});

app.get("/api/events-list", async (req, res) => {
    try {
        const allEvents = await pool.query("SELECT * FROM events;");
        
        // Formats every file name as a link
        for (let i = 0; i < allEvents.rows.length; i++)
        {
            allEvents.rows[i] = namesToPaths(allEvents.rows[i]);
        }

        res.json(allEvents.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/random-event", async (req, res) => {
    try {
        const eventsLength = await eventListLength();
        const randomEvent = await getRandomEvent(eventsLength);

        randomEvent.rows[0] = namesToPaths(randomEvent.rows[0]);

        res.json(randomEvent.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/api/weekly-events", async (req, res) => {
    try {
        let minDate = new Date();
        let currentDate = getCurrentDate();
        let maxDate = new Date();

        minDate.setDate(currentDate.getDate() - 1)
        maxDate.setDate(currentDate.getDate() + 3);

        await clearDates(minDate, maxDate); // Removes all dates that are not in the range of 5 days
        await fillDates(currentDate); // Fills empty dates

        let req = await pool.query("SELECT * FROM week;");
        res.json(req.rows);
    } catch (err) {
        console.error(err.message);
    }
});


// FUNCTIONS
async function fillDates(currentDate)
{
    var eventsLength = await eventListLength();
    
    var timestamp;
    var request;

    var randomEvent;
    var randomTemp;

    currentDate.setDate(currentDate.getDate() - 1);
    for (let i = 0; i < 5; i++)
    {
        timestamp = currentDate.valueOf();
        request = await pool.query(`SELECT * FROM week WHERE date=(to_timestamp(${timestamp} / 1000.0));`);

        if (request.rows == false) // If current date is not filled
        {
            randomEvent = (await getRandomEvent(eventsLength)).rows[0];
            randomEvent = namesToPaths(randomEvent);

            // If temperature range is not specified in DB, fills it randomly
            randomTemp = (randomEvent.maxtemp == null) ? randomInt(-10, 30) : randomInt(randomEvent.mintemp, randomEvent.maxtemp);

            await pool.query(`INSERT INTO week(date, name, temp, phrase, icon, background) 
            VALUES(
                to_timestamp(${timestamp} / 1000.0), 
                '${randomEvent.name.replace("'", "''")}', 
                ${randomTemp}, 
                '${randomEvent.phrase.replace("'", "''")}', 
                '${randomEvent.icon.replace("'", "''")}', 
                '${randomEvent.background.replace("'", "''")}'
                );`
            );
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

async function clearDates(minDate, maxDate)
{
    let req = await pool.query(`SELECT * FROM week;`);
    for (let i = 0; i < req.rowCount; i++)
    {
        if(!dateInRange(req.rows[i].date, minDate, maxDate))
        {
            await pool.query(`DELETE FROM week WHERE date=(to_timestamp(${req.rows[i].date.valueOf()} / 1000.0));`)
        }
    }
}

async function eventListLength()
{
    const countEvents = await pool.query("SELECT count(*) FROM events;");
    return parseInt(countEvents.rows[0].count);
}

async function getRandomEvent(eventsLength)
{
    return await pool.query(`SELECT * FROM events WHERE id=${randomInt(1, eventsLength)};`);
}

function randomInt(min, max) // Inclusive
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentDate()
{
    currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
}

function namesToPaths(row) // Changes names of icon/background to absolute path
{
    row.icon = `/src/icons/${row.icon}.svg`;
    row.background = `/src/backgrounds/${row.background}.png`;
    return row;
}

function dateInRange(currentDate, minDate, maxDate)
{
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(23, 59, 59, 999);
    return (currentDate >= minDate && currentDate <= maxDate);
}

app.listen(port, () => {
    console.log("Server is listening on port", port);
});
