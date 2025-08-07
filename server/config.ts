import dotenv from 'dotenv';

// Carregando variáveis de ambiente
dotenv.config();

// Configurações do banco de dados
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '2222123',
  database: process.env.DB_NAME || 'projeto_ONG',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Configurações do servidor
export const serverConfig = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development'
}; 