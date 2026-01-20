import basicAuth from "express-basic-auth";

const PASSW = process.env.PASSWORD

export const swaggerAuth = basicAuth({
    users: {
        admin: `${PASSW}`
    },
    challenge: true
});