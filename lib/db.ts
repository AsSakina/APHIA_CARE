import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let _sql: NeonQueryFunction<false, false> | null = null

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL
}

export function isDatabaseConfigured(): boolean {
  return !!getDatabaseUrl()
}

function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const connectionString = getDatabaseUrl()
    if (!connectionString) {
      throw new DatabaseNotConfiguredError()
    }
    _sql = neon(connectionString)
  }
  return _sql
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "La base de données n'est pas configurée. Veuillez connecter votre base de données Neon dans les paramètres du projet.",
    )
    this.name = "DatabaseNotConfiguredError"
  }
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const db = getDb()
  return db(strings, ...values)
}

export type QueryResult<T> = T[]
