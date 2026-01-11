import { Pool } from "pg";
import type { QueryResult } from "pg";

const pool = new Pool({
  user: "admin",
  password: "admin123",
  host: "localhost",
  port: 5432,
  database: "postgres",
});
type QueryParam = string | number | boolean | Date | null | undefined;
export const query = async (
  text: string,
  params?: QueryParam[]
): Promise<QueryResult<any>> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
};

export default pool;
