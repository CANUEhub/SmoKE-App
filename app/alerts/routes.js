import { NextResponse } from "next/server";
import conn from '../lib/db'

// To handle a GET request to /api
export async function GET(request) {
  const id = request.nextUrl.searchParams.get("sett_id");
  //SELECT year,day,co_pm25_avg FROM smoke.hist_comm_day WHERE commid IN (${id}) AND YEAR IN (${year}) 
  try {

    const res = await conn.query(`SELECT DISTINCT * FROM smoke.alerts 
    WHERE commid IN (${id})`);
    // const res = await conn.query(`SELECT year,day,aqhi_avg FROM smoke.hist_comm_day WHERE commid IN (${id}) AND YEAR IN (${year})`);
    console.log('alerts', res);
    return NextResponse.json({ message: res.rows }, { status: 200 }); 
  } catch (error) {
    console.error(error);
  }

  
}

// To handle a POST request to /api
export async function POST(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// Same logic to add a `PATCH`, `DELETE`...

async function retrieveData() {
  try {
    const res = await pool.query("SELECT * FROM aqhi_cur_temp");
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  }
}