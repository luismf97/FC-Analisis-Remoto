import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from '../global/environment';
const mysql = require('mysql2');

export default class MySQL {


    pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USERNAME,
        database: DB_NAME,
        password: DB_PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });


       

}