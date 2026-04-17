import { neon } from '@neondatabase/serverless';

// Esto buscará automáticamente la variable en el archivo .env.local
const sql = neon(process.env.DATABASE_URL);

export default sql;
