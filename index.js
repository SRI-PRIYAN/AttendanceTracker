const express = require('express');
const knex = require('knex');

const PORT = process.env.PORT || 3000;
const app = express();
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
})

app.get('/', (req, res) => {
    let success = true;
    let teacherTable;

    db.select('*').from('teacher')
        .then(data => {
            console.table(data);
            teacherTable = JSON.stringify(data);
        })
        .catch(err => {
            success = false;
            console.log(err);
        });

    if (success)
        res.json(teacherTable);
    else
        res.status(400).send('Error While Retrieving Data');
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})
