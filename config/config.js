require('dotenv').config();
const config={
    env: process.env.NODE_ENV || 'dev',
    isProduction: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3030,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    dbURL: process.env.DATABASE_URL
}
module.exports = {config};