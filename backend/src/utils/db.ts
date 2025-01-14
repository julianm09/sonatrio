import { Pool } from "pg";
import fs from "fs"

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
    ssl: {
        rejectUnauthorized: false,
    },
});


pool.on('connect', () => {
    console.log("Connected to the database");
});

pool.on('error', (err) => {
    console.error("Unexpected error on idle client", err);
});

export default pool;
