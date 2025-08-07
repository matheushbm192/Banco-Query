# 🐾 CRUD Pet - Documentação da API

## 🎯 **Visão Geral**

Este documento descreve as operações CRUD (Create, Read, Update, Delete) para a entidade **Pet** no sistema Speed-Banco ONG.

## 🔗 **Endpoints Disponíveis**

### **CREATE (C) - Criar Pet**
```http
POST /api/pets
```

**Body (JSON):**
```json
{
  "nome": "Thor",
  "raca": "Vira-Lata",
  "especie": "Cachorro",
  "idade": 2,
  "sexo": "macho",
  "porte": "médio",
  "cep": "15000-000",
  "logradouro": "Avenida Principal",
  "numero": "101",
  "bairro": "Vila Nova",
  "cidade": "São José do Rio Preto",
  "estado": "SP"
}
```

**Resposta (201):**
```json
{
  "status": "success",
  "message": "Pet criado com sucesso",
  "data": {
    "id_pet": 111,
    "nome": "Thor",
    "especie": "Cachorro",
    "raca": "Vira-Lata",
    "idade": 2
  }
}
```

---

### **READ (R) - Listar Todos os Pets**
```http
GET /api/pets
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id_pet": 111,
      "nome": "Thor",
      "raca": "Vira-Lata",
      "especie": "Cachorro",
      "idade": 2,
      "sexo": "macho",
      "porte": "médio",
      "cidade": "São José do Rio Preto",
      "estado": "SP"
    }
  ],
  "count": 1
}
```

---

### **READ (R) - Buscar Pet por ID**
```http
GET /api/pets/:id_pet
```

**Exemplo:**
```http
GET /api/pets/111
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "id_pet": 111,
    "nome": "Thor",
    "raca": "Vira-Lata",
    "especie": "Cachorro",
    "idade": 2,
    "sexo": "macho",
    "porte": "médio",
    "cep": "15000-000",
    "logradouro": "Avenida Principal",
    "numero": "101",
    "bairro": "Vila Nova",
    "cidade": "São José do Rio Preto",
    "estado": "SP"
  }
}
```

---

### **READ (R) - Buscar Pets por Espécie**
```http
GET /api/pets/especie/:especie
```

**Exemplo:**
```http
GET /api/pets/especie/Cachorro
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id_pet": 111,
      "nome": "Thor",
      "raca": "Vira-Lata",
      "especie": "Cachorro",
      "idade": 2,
      "sexo": "macho",
      "porte": "médio",
      "cidade": "São José do Rio Preto",
      "estado": "SP"
    }
  ],
  "count": 1
}
```

---

### **UPDATE (U) - Atualizar Pet**
```http
PUT /api/pets/:id_pet
```

**Exemplo:**
```http
PUT /api/pets/111
```

**Body (JSON):**
```json
{
  "nome": "Thor",
  "raca": "Labrador",
  "especie": "Cachorro",
  "idade": 3,
  "sexo": "macho",
  "porte": "grande",
  "cep": "15001-000",
  "logradouro": "Rua das Flores",
  "numero": "202",
  "bairro": "Centro",
  "cidade": "São José do Rio Preto",
  "estado": "SP"
}
```

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Pet atualizado com sucesso",
  "data": {
    "id_pet": 111,
    "nome": "Thor",
    "especie": "Cachorro",
    "raca": "Labrador",
    "cidade": "São José do Rio Preto",
    "estado": "SP"
  }
}
```

---

### **DELETE (D) - Excluir Pet**
```http
DELETE /api/pets/:id_pet
```

**Exemplo:**
```http
DELETE /api/pets/111
```

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Pet e todos os registros relacionados foram excluídos com sucesso",
  "data": {
    "id_pet": 111
  }
}
```

---

## ⚠️ **Códigos de Erro**

### **400 - Bad Request**
```json
{
  "status": "error",
  "message": "Nome e espécie são obrigatórios"
}
```

### **404 - Not Found**
```json
{
  "status": "error",
  "message": "Pet não encontrado"
}
```

### **500 - Internal Server Error**
```json
{
  "status": "error",
  "message": "Erro ao criar pet",
  "error": "Detalhes do erro"
}
```

---

## 🔧 **Exemplos de Uso com cURL**

### **Criar Pet**
```bash
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Thor",
    "raca": "Vira-Lata",
    "especie": "Cachorro",
    "idade": 2,
    "sexo": "macho",
    "porte": "médio",
    "cidade": "São José do Rio Preto",
    "estado": "SP"
  }'
```

### **Listar Pets**
```bash
curl -X GET http://localhost:3000/api/pets
```

### **Buscar por ID**
```bash
curl -X GET http://localhost:3000/api/pets/111
```

### **Buscar por Espécie**
```bash
curl -X GET http://localhost:3000/api/pets/especie/Cachorro
```

### **Atualizar Pet**
```bash
curl -X PUT http://localhost:3000/api/pets/111 \
  -H "Content-Type: application/json" \
  -d '{
    "porte": "grande",
    "especie": "Labrador",
    "idade": 3
  }'
```

### **Excluir Pet**
```bash
curl -X DELETE http://localhost:3000/api/pets/111
```

---

## 🗄️ **Estrutura do Banco de Dados**

### **Tabela Pet**
```sql
CREATE TABLE Pet (
    id_pet INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    raca VARCHAR(100),
    especie VARCHAR(50) NOT NULL,
    idade INT,
    sexo ENUM('macho', 'fêmea'),
    porte ENUM('pequeno', 'médio', 'grande'),
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2)
);
```

---

## 🔒 **Segurança e Validações**

### **Validações Implementadas:**
- ✅ **Campos obrigatórios**: nome, espécie
- ✅ **Verificação de existência** antes de UPDATE/DELETE
- ✅ **Transações** para DELETE (integridade referencial)
- ✅ **Sanitização** de parâmetros SQL
- ✅ **Tratamento de erros** com rollback

### **Recomendações de Segurança:**
- 🔐 **Validação de idade** (números positivos)
- 🔐 **Validação de CEP** (formato brasileiro)
- 🔐 **Validação de espécie** (lista de espécies válidas)
- 🔐 **Autenticação JWT** para operações sensíveis
- 🔐 **Rate limiting** para prevenir spam

---

## 📊 **Estatísticas da API**

| Operação | Endpoint | Método | Status |
|----------|----------|--------|--------|
| Criar | `/api/pets` | POST | ✅ Implementado |
| Listar | `/api/pets` | GET | ✅ Implementado |
| Buscar por ID | `/api/pets/:id` | GET | ✅ Implementado |
| Buscar por Espécie | `/api/pets/especie/:especie` | GET | ✅ Implementado |
| Atualizar | `/api/pets/:id` | PUT | ✅ Implementado |
| Excluir | `/api/pets/:id` | DELETE | ✅ Implementado |

---

## 🚀 **Como Testar**

1. **Inicie o servidor:**
   ```bash
   cd server
   npm start
   ```

2. **Teste com Postman ou cURL:**
   - Crie um pet
   - Liste todos os pets
   - Busque por ID ou espécie
   - Atualize dados
   - Exclua um pet

3. **Monitore os logs:**
   ```bash
   # Logs aparecem no console do servidor
   ```

---

## 📝 **Notas Importantes**

- 🔄 **Transações**: DELETE usa transações para manter integridade
- 🗑️ **Cascade**: Exclui registros relacionados automaticamente
- 🆔 **Auto-increment**: ID é gerado automaticamente
- ⚡ **Performance**: Queries otimizadas com índices
- 🐕 **Espécies**: Suporte para cães, gatos e outros animais

---

## 🔗 **Relacionamentos**

### **Tabelas Relacionadas:**
- **Adocao** - Registros de adoção do pet
- **Pet_Evento** - Participação em eventos
- **Vacinacao** - Histórico de vacinas
- **Foto** - Fotos do pet

### **Exclusão em Cascata:**
Quando um pet é excluído, todos os registros relacionados são removidos automaticamente:
1. `Adocao` (adoções)
2. `Pet_Evento` (participação em eventos)
3. `Vacinacao` (histórico de vacinas)
4. `Foto` (fotos do pet)
5. `Pet` (dados do pet)

---

**Desenvolvido para o projeto Speed-Banco ONG** 🐕 