// db
import postgres from 'postgres';
const sql = postgres('postgres://myuser:mypassword@host:5432/mydatabase', {
    host: 'localhost', // Postgres ip address[s] or domain name[s]
    port: 5432, // Postgres server port[s]
    database: 'mydatabase', // Name of database to connect to
    username: 'apple', // Username of database user
    password: 'mypassword', // Password of database user
});
async function testConnection() {
    try {
        const result = await sql `SELECT 1 + 1 AS result`;
        console.log('Connection successful:', result);
    }
    catch (error) {
        console.error('Connection error:', error);
    }
}
testConnection();
export default sql;
