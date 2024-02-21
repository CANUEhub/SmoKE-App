import { NextResponse } from "next/server";
import conn from '../lib/db'

// To handle a GET request to /api
export async function GET(request) {
  const id = request.nextUrl.searchParams.get("sett_id");
  const year = request.nextUrl.searchParams.get("year");
  //SELECT year,day,co_pm25_avg FROM smoke.hist_comm_day WHERE commid IN (${id}) AND YEAR IN (${year}) 
  try {

    const res = await conn.query(`SELECT * FROM smoke.smoke_hist_all
    WHERE commid IN (${id})
    AND hcayear IN (${year})
    AND hclvar = 'aqhi_avg'
    AND hcayear IN (${year})
    AND haavar = 'AQHIavg'
    AND halvar = 'aqhi_avg'
    AND hcayear IN (${year})
    AND haacanvar = 'AQHIavg'
    AND halcanvar = 'aqhi_avg'`);
//     const res = await conn.query(`SELECT * FROM smoke.smoke_hist_all
// WHERE commid IN (${id})
// AND hcayear IN (${year})
// AND hclvar = 'aqhi_avg'
// AND haayear IN (${year})
// AND haavar = 'AQHIavg'
// AND halvar = 'aqhi_avg'
// AND haacanyear IN (${year})
// AND halcanvar = 'AQHIavg'
// AND haacanvar = 'aqhi_avg'`);
    // const res = await conn.query(`SELECT year,day,aqhi_avg FROM smoke.hist_comm_day WHERE commid IN (${id}) AND YEAR IN (${year})`);
    console.log('aggregated', res);
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