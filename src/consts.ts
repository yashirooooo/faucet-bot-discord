// Load env

// eslint-disable-next-line node/no-extraneous-require
require('dotenv').config();

export const dbEndpoint = process.env.DB_ENDPOINT as string;
export const chainAddr = process.env.CHAIN_ADDR as string;
export const seeds = process.env.SEEDS as string;
export const token = process.env.TOKEN as string;
export const channel = process.env.CHANNEL as string;
export const trasferAmount = Number(process.env.AMOUNT as string);
