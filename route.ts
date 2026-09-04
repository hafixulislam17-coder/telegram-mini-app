import {NextRequest,NextResponse} from "next/server"; import {supabase} from "@/lib/supabase";
export async function POST(req:NextRequest){
 const {telegramId,method,address,amount}=await req.json(); const a=Number(amount);
 if(!a||a<=0) return NextResponse.json({error:"Invalid amount"},{status:400});
 const {data:u}=await supabase.from("users").select("balance").eq("telegram_id",telegramId).single();
 const {data:s}=await supabase.from("settings").select("value").eq("key","min_withdraw").single();
 if(!u||Number(u.balance)<a) return NextResponse.json({error:"Insufficient balance"},{status:400});
 if(a<Number(s?.value||50)) return NextResponse.json({error:"Below minimum withdrawal"},{status:400});
 await supabase.from("withdrawals").insert({telegram_id:telegramId,method,address,amount:a});
 await supabase.rpc("credit_balance",{p_telegram_id:telegramId,p_amount:-a,p_reason:"withdraw_hold"});
 return NextResponse.json({ok:true});
}