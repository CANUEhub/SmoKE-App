import { NextResponse } from "next/server";
import conn from '../lib/db'

// To handle a GET request to /api
export async function GET(request) {
  const admin_area = request.nextUrl.searchParams.get("admin_area");
  const year = request.nextUrl.searchParams.get("year");
  //SELECT year,day,co_pm25_avg FROM smoke.hist_comm_day WHERE commid IN (${id}) AND YEAR IN (${year}) 
  try {
    // SELECT value FROM smoke.hist_admin_ann WHERE admin_area IN (24) AND YEAR IN (2011) AND VAR IN ('COPM25')
    const res = await conn.query(`SELECT value, var FROM smoke.hist_admin_ann WHERE admin_area IN (${admin_area}) AND YEAR IN (${year})`);
    console.log("annual Average pm25", res);
    return NextResponse.json({ message: res.rows }, { status: 200 }); 
  } catch (error) {
    console.error(error);
  }

//   try {
//     console.log("req nom", req.body)
//     const query = "SELECT * FROM aqhi_cur_temp"
//     const values = [req.body.content]
//   const result = await conn.query(
//       query
//   );
//   console.log( "ttt", result );
//   return NextResponse.json({ message: result }, { status: 200 }); 
// } catch ( error ) {
//   console.log( error );
// }
  
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