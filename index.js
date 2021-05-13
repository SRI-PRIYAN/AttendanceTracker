const express = require('express');
const knex = require('knex');

const PORT = process.env.PORT || 3000;
const app = express();
const db = knex({
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

app.get('/', (req, res) => {
    db.select('*').from('teacher')
    .then(console.table)
    .catch(console.log);

    res.send('Successfully selected from teacher table');
})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})
