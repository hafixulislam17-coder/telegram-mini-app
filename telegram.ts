import crypto from "crypto";
export function verifyTelegramInitData(initData:string, botToken:string){
  const p=new URLSearchParams(initData); const hash=p.get("hash"); if(!hash) return null;
  p.delete("hash");
  const data=[...p.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n");
  const secret=crypto.createHmac("sha256","WebAppData").update(botToken).digest();
  const calc=crypto.createHmac("sha256",secret).update(data).digest("hex");
  if(!crypto.timingSafeEqual(Buffer.from(calc),Buffer.from(hash))) return null;
  const authDate=Number(p.get("auth_date")||0);
  if(Date.now()/1000-authDate>86400) return null;
  const user=JSON.parse(p.get("user")||"{}");
  return user;
}
