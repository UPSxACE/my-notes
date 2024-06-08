import dayjs, { Dayjs } from "dayjs";
import { sql } from "drizzle-orm";
import { Db } from "../drizzle";

export default async function getDatabaseTime(db: Db): Promise<Dayjs> {
  const now = await db.execute(sql`select NOW();`);
  return dayjs(now[0].now as Date);
}
