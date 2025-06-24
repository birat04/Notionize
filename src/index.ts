import {Client} from "pg";

const pgClient = new Client("postgresql://neondb_owner:npg_UA41EGeORmPT@ep-blue-silence-a1bhsl39-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
async function main() {
 await pgClient.connect()
 const response = await pgClient.query("SELECT * FROM todo.tasks")
    console.log(response.rows)
}
main()