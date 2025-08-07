import mysql from 'mysql2/promise';
import { dbConfig } from './config';

// Configuração da conexão com o banco de dados MySQL

// Criando pool de conexões
const pool = mysql.createPool(dbConfig);

// Função para testar a conexão
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    return false;
  }
}

// Função para executar queries
export async function executeQuery(query: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Erro ao executar query:', error);
    throw error;
  }
}

// Função para obter uma conexão do pool
export async function getConnection() {
  return await pool.getConnection();
}

// Exportando o pool para uso direto se necessário
export default pool; 