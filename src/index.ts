import {Client} from "pg";

const pgClient = new Client({
    user:"neondb_owner",
    password:"npg_UA41EGeORmPT",
    port: 5432,
    host:"ep-blue-silence-a1bhsl39-pooler.ap-southeast-1.aws.neon.tech",
    database:"neondb"
})
async function main() {
 await pgClient.connect()
}