#!/usr/bin/env node
// pre_migration_check.js
// Scans the latest migration SQL for 'ADD COLUMN ... NOT NULL' and warns if the target table is non-empty.

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('No migrations folder found:', migrationsDir);
    process.exit(0);
  }
  const items = fs.readdirSync(migrationsDir).filter(name => fs.lstatSync(path.join(migrationsDir, name)).isDirectory()).sort();
  if (!items.length) {
    console.error('No migration directories found');
    process.exit(0);
  }
  const latest = items[items.length - 1];
  const migrationSqlPath = path.join(migrationsDir, latest, 'migration.sql');
  if (!fs.existsSync(migrationSqlPath)) {
    console.error('No migration.sql in', latest);
    process.exit(0);
  }
  const sql = fs.readFileSync(migrationSqlPath, 'utf8');

  // regex to find ALTER TABLE "Table" ADD COLUMN "col" <type> NOT NULL
  const re = /ALTER\s+TABLE\s+"?([\w$]+)"?\s+ADD\s+COLUMN\s+"?([\w$]+)"?[\s\S]*?NOT\s+NULL/gi;
  let match;
  const problems = [];
  while ((match = re.exec(sql)) !== null) {
    const table = match[1];
    const column = match[2];
    problems.push({ table, column });
  }

  if (!problems.length) {
    console.log('No non-null column additions detected in latest migration.');
    process.exit(0);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Set DATABASE_URL in environment to check the live database.');
    process.exit(2);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  let hasIssue = false;
  for (const p of problems) {
    try {
      const res = await client.query(`SELECT count(*) AS cnt FROM \"${p.table}\"`);
      const cnt = parseInt(res.rows[0].cnt, 10);
      if (cnt > 0) {
        hasIssue = true;
        console.error(`Table ${p.table} has ${cnt} rows; adding NOT NULL column '${p.column}' will fail.`);
        console.error('Suggested backfill SQL (example):');
        console.error(`-- add nullable column\nALTER TABLE \"${p.table}\" ADD COLUMN \"${p.column}\" TEXT;`);
        console.error(`-- backfill from email local-part (change as appropriate)\nUPDATE \"${p.table}\" SET \"${p.column}\" = split_part(\"email\", '@', 1) WHERE \"${p.column}\" IS NULL;`);
        console.error(`-- then set NOT NULL\nALTER TABLE \"${p.table}\" ALTER COLUMN \"${p.column}\" SET NOT NULL;`);
        console.error('---');
      } else {
        console.log(`Table ${p.table} is empty; adding NOT NULL column is safe.`);
      }
    } catch (e) {
      console.error('Error checking table', p.table, e.message);
      hasIssue = true;
    }
  }

  await client.end();

  if (hasIssue) process.exit(3);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
