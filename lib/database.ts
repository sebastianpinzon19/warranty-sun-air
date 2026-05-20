let Pool: any = undefined;
try {
  // Dynamically require to avoid errors when pg is not installed in some environments
  // and to keep the file usable when DATABASE_URL is not provided.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Pool = require('pg').Pool;
} catch (e) {
  Pool = undefined;
}

export interface Warranty {
  id: string;
  applicationType: string;
  ownerName: string;
  email: string;
  phone: string;
  installationDate: string | Date;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dealer: {
    name: string;
    email: string;
    phone: string;
  };
  products: Array<{
    serialNumber: string;
  }>;
  registeredAt: string | Date;
  status: string;
}

type PgPool = {
  query: (text: string, params?: any[]) => Promise<{ rowCount: number; rows: any[] }>;
};

const memoryStore: Warranty[] = [];
let cachedPool: PgPool | null | undefined;
let initPromise: Promise<void> | null = null;

function hasDatabaseUrl() {
  return !!process.env.DATABASE_URL && !!Pool;
}

function getPool(): PgPool | null {
  if (!hasDatabaseUrl()) return null;
  if (cachedPool === undefined) {
    cachedPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return cachedPool ?? null;
}

async function ensureTable() {
  const pool = getPool();
  if (!pool) return;
  if (!initPromise) {
    initPromise = (async () => {
      await pool.query(`
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
      `);
    })();
  }
  await initPromise;
}

export async function addWarranty(warranty: Warranty): Promise<void> {
  const pool = getPool();
  if (!pool) {
    memoryStore.push(warranty);
    return;
  }

  await ensureTable();
  await pool.query(
    `
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
    `,
    [
      warranty.id,
      warranty.applicationType,
      warranty.ownerName,
      warranty.email,
      warranty.phone,
      new Date(warranty.installationDate),
      JSON.stringify(warranty.address),
      JSON.stringify(warranty.dealer),
      JSON.stringify(warranty.products),
      new Date(warranty.registeredAt),
      warranty.status,
    ]
  );
}

export async function findWarrantyById(id: string): Promise<Warranty | undefined> {
  const pool = getPool();
  if (!pool) return memoryStore.find(w => w.id === id);

  await ensureTable();
  const res = await pool.query('SELECT * FROM warranties WHERE id = $1 LIMIT 1', [id]);
  if (res.rowCount === 0) return undefined;
  return mapRowToWarranty(res.rows[0]);
}

export async function findWarrantyByLastNameAndSerial(lastName: string, serialNumber: string): Promise<Warranty | undefined> {
  const pool = getPool();
  if (!pool) {
    return memoryStore.find(w => {
      const lastNameMatch = w.ownerName.toLowerCase().includes(lastName.toLowerCase());
      const serialMatch = w.products.some(p => p.serialNumber.toLowerCase() === serialNumber.toLowerCase());
      return lastNameMatch && serialMatch;
    });
  }

  await ensureTable();
  const namePattern = `%${lastName}%`;
  const serialQuery = JSON.stringify([{ serialNumber }]);
  const res = await pool.query(
    `SELECT * FROM warranties WHERE owner_name ILIKE $1 AND products @> $2::jsonb LIMIT 1`,
    [namePattern, serialQuery]
  );
  if (res.rowCount === 0) return undefined;
  return mapRowToWarranty(res.rows[0]);
}

export async function getAllWarranties(): Promise<Warranty[]> {
  const pool = getPool();
  if (!pool) return memoryStore.slice().reverse();

  await ensureTable();
  const res = await pool.query('SELECT * FROM warranties ORDER BY registered_at DESC');
  return res.rows.map(mapRowToWarranty);
}

function mapRowToWarranty(row: any): Warranty {
  return {
    id: row.id,
    applicationType: row.application_type,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    installationDate: row.installation_date,
    address: row.address,
    dealer: row.dealer,
    products: row.products,
    registeredAt: row.registered_at,
    status: row.status,
  };
}
