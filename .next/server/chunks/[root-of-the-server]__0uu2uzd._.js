module.exports=[14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},72536,(e,t,r)=>{t.exports=e.x("pg-cb1a3b828ed0717a",()=>require("pg-cb1a3b828ed0717a"))},79604,e=>{"use strict";let t,r;try{r=e.r(72536).Pool}catch(e){r=void 0}let a=[],n=null;function s(){return process.env.DATABASE_URL&&r?(void 0===t&&(t=new r({connectionString:process.env.DATABASE_URL})),t??null):null}async function i(){let e=s();e&&(n||(n=(async()=>{await e.query(`
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
      `)})()),await n)}async function o(e){let t=s();t?(await i(),await t.query(`
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
    `,[e.id,e.applicationType,e.ownerName,e.email,e.phone,new Date(e.installationDate),JSON.stringify(e.address),JSON.stringify(e.dealer),JSON.stringify(e.products),new Date(e.registeredAt),e.status])):a.push(e)}async function d(e){let t=s();if(!t)return a.find(t=>t.id===e);await i();let r=await t.query("SELECT * FROM warranties WHERE id = $1 LIMIT 1",[e]);if(0!==r.rowCount)return u(r.rows[0])}async function p(e,t){let r=s();if(!r)return a.find(r=>{let a=r.ownerName.toLowerCase().includes(e.toLowerCase()),n=r.products.some(e=>e.serialNumber.toLowerCase()===t.toLowerCase());return a&&n});await i();let n=`%${e}%`,o=JSON.stringify([{serialNumber:t}]),d=await r.query("SELECT * FROM warranties WHERE owner_name ILIKE $1 AND products @> $2::jsonb LIMIT 1",[n,o]);if(0!==d.rowCount)return u(d.rows[0])}async function l(){let e=s();return e?(await i(),(await e.query("SELECT * FROM warranties ORDER BY registered_at DESC")).rows.map(u)):a.slice().reverse()}function u(e){return{id:e.id,applicationType:e.application_type,ownerName:e.owner_name,email:e.email,phone:e.phone,installationDate:e.installation_date,address:e.address,dealer:e.dealer,products:e.products,registeredAt:e.registered_at,status:e.status}}e.s(["addWarranty",0,o,"findWarrantyById",0,d,"findWarrantyByLastNameAndSerial",0,p,"getAllWarranties",0,l])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0uu2uzd._.js.map