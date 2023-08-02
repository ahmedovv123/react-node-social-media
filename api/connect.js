import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password123!", // keep this in .env
  database: "social",
});
