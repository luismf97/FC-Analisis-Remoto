import dotenv from 'dotenv';
dotenv.config();

export const SERVER_PORT: number = Number( process.env.PORT ) || 5000;

export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;

export const WA_TOKEN = process.env.WA_TOKEN;
export const WA_VERYF = process.env.WA_VERYF;
export const WA_NUMBER = process.env.WA_NUMBER;