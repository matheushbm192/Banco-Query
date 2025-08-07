import express from 'express';
import cors from 'cors';
import { testConnection } from './database';
import { serverConfig } from './config';
import { OngRoutes } from './rotas/rotasOng';

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5501'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor Speed-Banco ONG está funcionando!',
    timestamp: new Date().toISOString(),
    status: 'online'
  });
});

// Rota para testar a conexão com o banco de dados
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      status: 'success',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Erro ao verificar conexão com banco de dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Instanciar a classe de rotas
const ongRoutes = new OngRoutes();

// Rotas da API - Estatísticas de Usuários e Pets
app.get('/api/usuarios-com-pet', ongRoutes.getUsuariosComPet);
app.get('/api/pets-grandes-medio', ongRoutes.getPetsGrandesEDeMeio);
app.get('/api/voluntarios-por-funcao', ongRoutes.getNumeroDeVoluntariosPorFuncao);
app.get('/api/adocoes-por-porte', ongRoutes.getTotalDeAdocoesPorPorte);
app.get('/api/voluntarios-habilidade-cidade', ongRoutes.getTotalDeVoluntariosComHabilidadePorCidade);
app.get('/api/pets-por-especie-evento', ongRoutes.getTotalDePetsPorEspeciePorEvento);
app.get('/api/media-idade-pets-cidade', ongRoutes.getMediaDeIdadeDosPetsAdotadosPorCidade);
app.get('/api/habilidades-voluntarios', ongRoutes.getTotalDeHabilidadesPorUsuarioVoluntario);
app.get('/api/usuarios-sem-pet-adotar', ongRoutes.getUsuariosQueNaoPossuemPetEDesejamAdotar);
app.get('/api/pets-multiplas-fotos', ongRoutes.getPetsComMaisDeUmaFoto);
app.get('/api/pets-raca-adotados-evento', ongRoutes.getPetsDeCadaRacaAdotadosPorEvento);
app.get('/api/adocoes-por-cidade', ongRoutes.getTotalDeAdocoesPorCidade);

// ==================== ROTAS CRUD PET ====================
// CREATE (C) - Criar novo pet
app.post('/api/pets', ongRoutes.createPet);

// READ (R) - Listar todos os pets
app.get('/api/pets', ongRoutes.getAllPets);

// READ (R) - Buscar pet por ID
app.post('/api/pets/buscar', ongRoutes.getPetById);

// UPDATE (U) - Atualizar dados do pet
app.put('/api/pets/atualizar', ongRoutes.updatePet);

// DELETE (D) - Excluir pet e registros relacionados
app.delete('/api/pets/excluir', ongRoutes.deletePet);

// ==================== ROTAS CRUD ADOÇÃO ====================
// CREATE (C) - Criar novo registro de adoção
app.post('/api/adocoes', ongRoutes.createAdocao);

// READ (R) - Listar todas as adoções
app.get('/api/adocoes', ongRoutes.getAllAdocoes);

// READ (R) - Buscar adoção por ID
app.post('/api/adocoes/buscar', ongRoutes.getAdocaoById);

// UPDATE (U) - Atualizar registro de adoção
app.put('/api/adocoes/atualizar', ongRoutes.updateAdocao);

// DELETE (D) - Excluir registro de adoção
app.delete('/api/adocoes/excluir', ongRoutes.deleteAdocao);

// ==================== ROTAS CRUD USUÁRIO COMUM ====================
// CREATE (C) - Criar novo usuário comum
app.post('/api/usuarios/comum', ongRoutes.createUsuarioComum);

// READ (R) - Buscar usuário comum por email
app.post('/api/usuarios/comum/buscar', ongRoutes.getUsuarioComumByEmail);

// UPDATE (U) - Atualizar telefone do usuário comum
app.put('/api/usuarios/comum/telefone', ongRoutes.updateTelefoneUsuarioComum);

// UPDATE (U) - Atualizar possui_pet do usuário comum
app.put('/api/usuarios/comum/possui_pet', ongRoutes.updatePossuiPetUsuarioComum);

// UPDATE (U) - Atualizar deseja_adotar do usuário comum
app.put('/api/usuarios/comum/deseja_adotar', ongRoutes.updateDesejaAdotarUsuarioComum);

// UPDATE (U) - Atualizar deseja_contribuir do usuário comum
app.put('/api/usuarios/comum/deseja_contribuir', ongRoutes.updateDesejaContribuirUsuarioComum);

// DELETE (D) - Excluir usuário comum
app.delete('/api/usuarios/comum/excluir', ongRoutes.deleteUsuarioComum);

// ==================== ROTAS CRUD USUÁRIO ADMINISTRADOR ====================
// CREATE (C) - Criar novo usuário administrador
app.post('/api/usuarios/administrador', ongRoutes.createUsuarioAdministrador);

// READ (R) - Buscar usuário administrador por email
app.post('/api/usuarios/administrador/buscar', ongRoutes.getUsuarioAdministradorByEmail);

// UPDATE (U) - Atualizar telefone do usuário administrador
app.put('/api/usuarios/administrador/telefone', ongRoutes.updateTelefoneUsuarioAdministrador);

// UPDATE (U) - Atualizar possui_pet do usuário administrador
app.put('/api/usuarios/administrador/possui_pet', ongRoutes.updatePossuiPetUsuarioAdministrador);

// UPDATE (U) - Atualizar funcao do usuário administrador
app.put('/api/usuarios/administrador/funcao', ongRoutes.updateFuncaoUsuarioAdministrador);

// DELETE (D) - Excluir usuário administrador
app.delete('/api/usuarios/administrador/excluir', ongRoutes.deleteUsuarioAdministrador);

// ==================== ROTAS CRUD USUÁRIO VOLUNTÁRIO ====================
// CREATE (C) - Criar novo usuário voluntário
app.post('/api/usuarios/voluntario', ongRoutes.createUsuarioVoluntario);

// READ (R) - Buscar usuário voluntário por email
app.post('/api/usuarios/voluntario/buscar', ongRoutes.getUsuarioVoluntarioByEmail);

// UPDATE (U) - Atualizar telefone do usuário voluntário
app.put('/api/usuarios/voluntario/telefone', ongRoutes.updateTelefoneUsuarioVoluntario);

// UPDATE (U) - Atualizar possui_pet do usuário voluntário
app.put('/api/usuarios/voluntario/possui_pet', ongRoutes.updatePossuiPetUsuarioVoluntario);

// UPDATE (U) - Atualizar funcao do usuário voluntário
app.put('/api/usuarios/voluntario/funcao', ongRoutes.updateFuncaoUsuarioVoluntario);

// DELETE (D) - Excluir usuário voluntário
app.delete('/api/usuarios/voluntario/excluir', ongRoutes.deleteUsuarioVoluntario);

// Middleware para tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erro no servidor:', err);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Função para iniciar o servidor
async function startServer() {
  try {
    // Testar conexão com banco de dados
    console.log('🔍 Testando conexão com banco de dados...');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexão com banco de dados estabelecida!');
    } else {
      console.log('⚠️  Aviso: Não foi possível conectar com o banco de dados');
    }

    // Iniciar servidor
    const port = serverConfig.port;
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
      console.log(`📱 Ambiente: ${serverConfig.nodeEnv}`);
      console.log(`🌐 Acesse: http://localhost:${port}`);
      console.log(`🔗 Health Check: http://localhost:${port}/api/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais para encerramento graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Recebido sinal SIGINT, encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Recebido sinal SIGTERM, encerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();
