CREATE DATABASE event_list;

--\c event_list

CREATE TABLE events
(
    id integer NOT NULL,
    name VARCHAR(255) NOT NULL,
    minTemp integer,
    maxTemp integer,
    phrase VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    background VARCHAR(255) NOT NULL
);

--import df1.csv to database

CREATE TABLE week
(
    timestamp date NOT NULL,
    name VARCHAR(255) NOT NULL,
    temp integer NOT NULL,
    phrase VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    background VARCHAR(255) NOT NULL
);