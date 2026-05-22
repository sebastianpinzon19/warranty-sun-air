"use strict";(()=>{var e={};e.id=352,e.ids=[352],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},97335:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>T,patchFetch:()=>y,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>w,staticGenerationAsyncStorage:()=>E});var r={};a.r(r),a.d(r,{POST:()=>c});var i=a(49303),o=a(88716),n=a(60670),s=a(87070),u=a(24544),l=a(14749);async function c(e){try{let{lastName:t,serialNumber:a}=await (e.json?e.json():Promise.resolve(e.body||{})),r=e.headers?.get?(0,l.Tk)(e.headers):"unknown";if(!t||!a)return await (0,l.Ay)({action:"warranty_lookup_validation_failed",actor:r,outcome:"failure",severity:"warning",resource:"/api/warranty/lookup",details:{reason:"missing_required_fields"}}),s.NextResponse.json({error:"Last name and serial number are required"},{status:400});let i=(e,t=200)=>"string"==typeof e?e.trim().slice(0,t):"",o=i(t,100),n=i(a,64);if(o.length<2||n.length<4)return await (0,l.Ay)({action:"warranty_lookup_validation_failed",actor:r,outcome:"failure",severity:"warning",resource:"/api/warranty/lookup",details:{reason:"invalid_lengths"}}),s.NextResponse.json({error:"Invalid lookup information"},{status:400});if(!("string"==typeof n&&/^[A-Z0-9\-]{4,64}$/i.test(n.trim())))return await (0,l.Ay)({action:"warranty_lookup_validation_failed",actor:r,outcome:"failure",severity:"warning",resource:"/api/warranty/lookup",details:{reason:"invalid_serial_format"}}),s.NextResponse.json({error:"Invalid serial number format"},{status:400});let c=await (0,u.Uo)(o,n);if(c)return await (0,l.Ay)({action:"warranty_lookup_success",actor:r,outcome:"success",severity:"info",resource:"/api/warranty/lookup",details:{warrantyId:c.id}}),s.NextResponse.json({found:!0,warranty:{id:c.id,status:c.status}});return await (0,l.Ay)({action:"warranty_lookup_not_found",actor:r,outcome:"failure",severity:"info",resource:"/api/warranty/lookup",details:{}}),s.NextResponse.json({found:!1,message:"No warranty found with the provided information. Please check your details and try again."},{status:404})}catch(a){console.error("Error looking up warranty:",a);let t=e.headers?.get?(0,l.Tk)(e.headers):"unknown";return await (0,l.Ay)({action:"warranty_lookup_failed",actor:t,outcome:"failure",severity:"critical",resource:"/api/warranty/lookup",details:{message:a instanceof Error?a.message:String(a)}}),s.NextResponse.json({error:"Failed to lookup warranty"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/warranty/lookup/route",pathname:"/api/warranty/lookup",filename:"route",bundlePath:"app/api/warranty/lookup/route"},resolvedPagePath:"C:\\Users\\sebas\\OneDrive\\Desktop\\programing\\sun-air-web\\warranty-system\\app\\api\\warranty\\lookup\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:p,staticGenerationAsyncStorage:E,serverHooks:w}=d,T="/api/warranty/lookup/route";function y(){return(0,n.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:E})}},14749:(e,t,a)=>{a.d(t,{Ay:()=>n,Tk:()=>o,Tl:()=>s,gQ:()=>u});var r=a(24544);async function i(){let e=(0,r.zx)();e&&(await e.query(`
    CREATE TABLE IF NOT EXISTS audits (
      id BIGSERIAL PRIMARY KEY,
      action TEXT NOT NULL,
      actor TEXT,
      outcome TEXT,
      severity TEXT,
      resource TEXT,
      details JSONB,
      created_at TIMESTAMP DEFAULT now()
    );
  `),await e.query("ALTER TABLE audits ADD COLUMN IF NOT EXISTS outcome TEXT;"),await e.query("ALTER TABLE audits ADD COLUMN IF NOT EXISTS severity TEXT;"),await e.query("ALTER TABLE audits ADD COLUMN IF NOT EXISTS resource TEXT;"))}function o(e){let t=e.get("x-forwarded-for"),a=e.get("x-real-ip");return String(t||a||"unknown").split(",")[0].trim()}async function n(e){let t=(0,r.zx)(),a=e.action,o=e.actor||null,n=e.outcome||"success",s=e.severity||"info",u=e.resource||null,l=e.details||{};if(!t){try{console.info("[AUDIT]",{action:a,actor:o,outcome:n,severity:s,resource:u,details:l})}catch(e){}return}await i();try{await t.query("INSERT INTO audits (action, actor, outcome, severity, resource, details) VALUES ($1,$2,$3,$4,$5,$6)",[a,o,n,s,u,JSON.stringify(l)])}catch(e){console.error("Failed to write audit log",e)}}async function s(e={}){let t=(0,r.zx)();if(!t)return{rows:[],total:0};await i();let a=Math.max(Number(e.page||1),1),o=Math.min(Math.max(Number(e.pageSize||100),1),500),n=[],s=[];e.action&&(s.push(e.action),n.push(`action = $${s.length}`)),e.outcome&&(s.push(e.outcome),n.push(`outcome = $${s.length}`)),e.severity&&(s.push(e.severity),n.push(`severity = $${s.length}`)),e.from&&(s.push(e.from),n.push(`created_at >= $${s.length}::timestamp`)),e.to&&(s.push(e.to),n.push(`created_at <= $${s.length}::timestamp`));let u=n.length>0?`WHERE ${n.join(" AND ")}`:"",l={created_at:"created_at",action:"action",severity:"severity",outcome:"outcome"}[e.sortBy||"created_at"]||"created_at",c="asc"===e.sortOrder?"ASC":"DESC",d=`SELECT COUNT(*)::int AS total FROM audits ${u}`,p=await t.query(d,s),E=p.rows[0]?.total||0;s.push(o),s.push((a-1)*o);let w=`SELECT * FROM audits ${u} ORDER BY ${l} ${c} LIMIT $${s.length-1} OFFSET $${s.length}`;return{rows:(await t.query(w,s)).rows,total:E}}async function u(){let e=(0,r.zx)();return e?(await i(),(await e.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE outcome = 'success')::int AS success,
      COUNT(*) FILTER (WHERE outcome = 'failure')::int AS failure,
      COUNT(*) FILTER (WHERE outcome = 'forbidden')::int AS forbidden,
      COUNT(*) FILTER (WHERE severity = 'critical')::int AS critical,
      COUNT(*) FILTER (WHERE severity = 'warning')::int AS warning,
      COUNT(*) FILTER (WHERE severity = 'info')::int AS info,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '24 hours')::int AS last24h
    FROM audits;
  `)).rows[0]||{total:0,success:0,failure:0,forbidden:0,critical:0,warning:0,info:0,last24h:0}):{total:0,success:0,failure:0,forbidden:0,critical:0,warning:0,info:0,last24h:0}}},24544:(e,t,a)=>{let r,i;a.d(t,{Uo:()=>p,fE:()=>c,getAllWarranties:()=>E,mB:()=>d,zx:()=>u});try{i=a(35900).Pool}catch(e){i=void 0}let o=[],n=null;function s(){return process.env.DATABASE_URL&&i?(void 0===r&&(r=new i({connectionString:process.env.DATABASE_URL})),r??null):null}function u(){return s()}async function l(){let e=s();e&&(n||(n=(async()=>{await e.query(`
        CREATE TABLE IF NOT EXISTS warranties (
          id TEXT PRIMARY KEY,
          application_type TEXT,
          owner_name TEXT,
          email TEXT,
          phone TEXT,
          installation_date TIMESTAMP,
          address JSONB,
          dealer JSONB,
          products JSONB,
          registered_at TIMESTAMP,
          status TEXT
        );
      `)})()),await n)}async function c(e){let t=s();if(!t){o.push(e);return}await l(),await t.query(`
      INSERT INTO warranties
      (id, application_type, owner_name, email, phone, installation_date, address, dealer, products, registered_at, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (id) DO UPDATE SET
        application_type = EXCLUDED.application_type,
        owner_name = EXCLUDED.owner_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        installation_date = EXCLUDED.installation_date,
        address = EXCLUDED.address,
        dealer = EXCLUDED.dealer,
        products = EXCLUDED.products,
        registered_at = EXCLUDED.registered_at,
        status = EXCLUDED.status
    `,[e.id,e.applicationType,e.ownerName,e.email,e.phone,new Date(e.installationDate),JSON.stringify(e.address),JSON.stringify(e.dealer),JSON.stringify(e.products),new Date(e.registeredAt),e.status])}async function d(e){let t=s();if(!t)return o.find(t=>t.id===e);await l();let a=await t.query("SELECT * FROM warranties WHERE id = $1 LIMIT 1",[e]);if(0!==a.rowCount)return w(a.rows[0])}async function p(e,t){let a=s();if(!a)return o.find(a=>{let r=a.ownerName.toLowerCase().includes(e.toLowerCase()),i=a.products.some(e=>e.serialNumber.toLowerCase()===t.toLowerCase());return r&&i});await l();let r=`%${e}%`,i=JSON.stringify([{serialNumber:t}]),n=await a.query("SELECT * FROM warranties WHERE owner_name ILIKE $1 AND products @> $2::jsonb LIMIT 1",[r,i]);if(0!==n.rowCount)return w(n.rows[0])}async function E(){let e=s();return e?(await l(),(await e.query("SELECT * FROM warranties ORDER BY registered_at DESC")).rows.map(w)):o.slice().reverse()}function w(e){return{id:e.id,applicationType:e.application_type,ownerName:e.owner_name,email:e.email,phone:e.phone,installationDate:e.installation_date,address:e.address,dealer:e.dealer,products:e.products,registeredAt:e.registered_at,status:e.status}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972],()=>a(97335));module.exports=r})();