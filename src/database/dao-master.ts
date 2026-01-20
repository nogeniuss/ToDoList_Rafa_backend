import { Pool } from 'pg';

export class DaoMaster {
  private pool: Pool;

  getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        connectionString: process.env.URL_NEON,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    }

    return this.pool;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const pool = this.getPool();
      const result = await pool.query(sql, params);
      return result.rows;
    } catch (error) {
      return []
      console.log(error)
    }
  }


  async select<T = any>(
    table: string,
    where: Record<string, any> = {},
  ): Promise<T[]> {
    const keys = Object.keys(where);
    const values = Object.values(where);

    let sql = `SELECT * FROM ${table}`;

    if (keys.length) {
      const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    return this.query<T>(sql, values);
  }

  async insert<T = any>(
    table: string,
    data: Record<string, any>,
  ): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.query<T>(sql, values);
    return result[0];
  }

  async update<T = any>(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<T> {
    const dataKeys = Object.keys(data);
    const whereKeys = Object.keys(where);

    const setClause = dataKeys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');

    const whereClause = whereKeys
      .map((key, i) => `${key} = $${dataKeys.length + i + 1}`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(where)];

    const sql = `
      UPDATE ${table}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING *
    `;

    const result = await this.query<T>(sql, values);
    return result[0];
  }

  async delete(
    table: string,
    where: Record<string, any>,
  ): Promise<boolean> {
    const keys = Object.keys(where);
    const values = Object.values(where);

    const conditions = keys.map((key, i) => `${key} = $${i + 1}`);

    const sql = `
      DELETE FROM ${table}
      WHERE ${conditions.join(' AND ')}
    `;

    await this.query(sql, values);
    return true;
  }

  async createTableUser() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      );
    `)
  }

  async createTableTasks() {
    await this.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_user UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        data  TIMESTAMP,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT,
        prioridade TEXT,
        concluida BOOLEAN DEFAULT FALSE
      );
    `)
  }

  async createTables(): Promise<void> {
    await Promise.all([
      this.createTableUser(),
      this.createTableTasks()
    ]);
  }
}
