// CRUD Operations Handler
// Funções utilitárias
function formatHeader(header) {
    return header
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/([A-Z])/g, ' $1')
        .trim();
}

function formatCellValue(value) {
    if (value === null || value === undefined) {
        return '-';
    }
    
    if (typeof value === 'number') {
        return value.toLocaleString('pt-BR');
    }
    
    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }
    
    return String(value);
}

// Inicialização do CRUD
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:3000/api';

    // Handle CRUD button clicks
    document.querySelectorAll('.crud-btn').forEach(button => {
        button.addEventListener('click', function() {
            const crudType = this.dataset.crud;
            const action = this.dataset.action;
            const formId = `${crudType}Form`;
            const titleId = `${crudType}CrudTitle`;
            
            // Hide all forms first
            document.querySelectorAll('.crud-form').forEach(form => {
                form.style.display = 'none';
            });

            // Show the selected form
            const form = document.getElementById(formId);
            const titleElement = document.getElementById(titleId);
            
            if (form && titleElement) {
                form.style.display = 'block';
                
                // Set the appropriate title based on action
                switch(action) {
                    case 'create':
                        titleElement.textContent = `Criar Novo ${crudType.charAt(0).toUpperCase() + crudType.slice(1)}`;
                        break;
                    case 'read':
                        titleElement.textContent = `Buscar ${crudType.charAt(0).toUpperCase() + crudType.slice(1)}`;
                        break;
                    case 'update':
                        titleElement.textContent = `Atualizar ${crudType.charAt(0).toUpperCase() + crudType.slice(1)}`;
                        break;
                    case 'delete':
                        titleElement.textContent = `Excluir ${crudType.charAt(0).toUpperCase() + crudType.slice(1)}`;
                        break;
                }

                // Handle which fields to show based on action
                const idField = form.querySelector(`#${crudType}Id`);
                if (idField) {
                    idField.style.display = action === 'create' ? 'none' : 'block';
                }

                // Show/hide fields based on action
                if (action === 'create') {
                    // Show all fields for create, except the ID field
                    form.querySelectorAll('input, select, textarea').forEach(input => {
                        if (input.id === `${crudType}Id`) {
                            input.style.display = 'none';
                        } else {
                            input.style.display = 'block';
                        }
                    });
                    // Make sure all form sections are visible
                    form.querySelectorAll('.form-section').forEach(section => {
                        section.style.display = 'block';
                    });
                } else if (action === 'read' || action === 'delete') {
                    // Show only ID/email field for read and delete
                    form.querySelectorAll('input, select, textarea').forEach(input => {
                        if (!input.id.toLowerCase().includes('id') && 
                            !input.id.toLowerCase().includes('email')) {
                            input.style.display = 'none';
                        } else {
                            input.style.display = 'block';
                        }
                    });
                    // Hide form sections for read/delete
                    form.querySelectorAll('.form-section').forEach(section => {
                        section.style.display = 'none';
                    });
                } else {
                    // Update operation - show specific fields based on form type
                    if (crudType === 'pet') {
                        // Para atualização de Pet, mostrar apenas ID, espécie e porte
                        form.querySelectorAll('input, select, textarea').forEach(input => {
                            const showField = input.id === 'petId' || 
                                            input.id === 'petSpecies' || 
                                            input.id === 'petSize';
                            input.style.display = showField ? 'block' : 'none';
                        });
                        // Mostrar apenas a seção que contém os campos necessários
                        form.querySelectorAll('.form-section').forEach(section => {
                            section.style.display = section.querySelector('#petSpecies, #petSize') ? 'block' : 'none';
                        });
                    } else if (crudType === 'adocao') {
                        // Para atualização de Adoção, mostrar apenas ID e status
                        form.querySelectorAll('input, select, textarea').forEach(input => {
                            const showField = input.id === 'adocaoId' || 
                                            input.id === 'adocaoStatus';
                            input.style.display = showField ? 'block' : 'none';
                        });
                        form.querySelectorAll('.form-section').forEach(section => {
                            section.style.display = section.querySelector('#adocaoStatus') ? 'block' : 'none';
                        });
                    } else if (crudType === 'usuario' || crudType === 'admin' || crudType === 'voluntario') {
                        // Para atualização de usuários, mostrar apenas ID, email e senha
                        const prefix = crudType === 'usuario' ? 'usuario' : 
                                     crudType === 'admin' ? 'admin' : 'voluntario';
                        form.querySelectorAll('input, select, textarea').forEach(input => {
                            const showField = input.id === `${prefix}Id` || 
                                            input.id === `${prefix}Email` || 
                                            input.id === `${prefix}Senha`;
                            input.style.display = showField ? 'block' : 'none';
                        });
                        form.querySelectorAll('.form-section').forEach(section => {
                            section.style.display = section.querySelector(`#${prefix}Email, #${prefix}Senha`) ? 'block' : 'none';
                        });
                    }
                }
            }
        });
    });

    // Handle form cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const formId = `${this.dataset.form}Form`;
            const formContainer = document.querySelector(`#${formId}`).closest('.crud-form-container');
            const form = document.getElementById(formId);
            if (form && formContainer) {
                formContainer.style.display = 'none';
                if (form instanceof HTMLFormElement) {
                    form.reset();
                }
            }
        });
    });

    // Handle form submissions
    document.querySelectorAll('.submit-btn').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário
            const formType = this.dataset.form;
            const form = document.getElementById(`${formType}Form`);
            
            if (!(form instanceof HTMLFormElement)) {
                console.error('Elemento não é um formulário válido');
                return;
            }
            const action = form.querySelector('h5').textContent.toLowerCase().includes('criar') ? 'create' : 
                          form.querySelector('h5').textContent.toLowerCase().includes('atualizar') ? 'update' :
                          form.querySelector('h5').textContent.toLowerCase().includes('excluir') ? 'delete' : 'read';

            // Get form data
            const formData = {};
            form.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.style.display !== 'none' && input.value) {
                    // Map the field IDs to the expected backend property names
                    const fieldMaps = {
                        pet: {
                            'petId': 'id_pet',
                            'petName': 'nome',
                            'petSpecies': 'especie',
                            'petBreed': 'raca',
                            'petAge': 'idade',
                            'petSex': 'sexo',
                            'petSize': 'porte',
                            'petCep': 'cep',
                            'petLogradouro': 'logradouro',
                            'petNumero': 'numero',
                            'petBairro': 'bairro',
                            'petCidade': 'cidade',
                            'petEstado': 'estado'
                        },
                        adocao: {
                            'adocaoId': 'id_adocao',
                            'id_pet': 'id_pet',
                            'id_usuario': 'id_usuario'
                        },
                        usuario: {
                            'usuarioId': 'id_usuario',
                            'usuarioNome': 'nome',
                            'usuarioSobrenome': 'sobrenome',
                            'usuarioEmail': 'email',
                            'usuarioSenha': 'senha',
                            'usuarioDataNascimento': 'data_nascimento',
                            'usuarioTelefone': 'telefone',
                            'usuarioCpf': 'cpf',
                            'usuarioCep': 'cep',
                            'usuarioLogradouro': 'logradouro',
                            'usuarioNumero': 'numero',
                            'usuarioBairro': 'bairro',
                            'usuarioCidade': 'cidade',
                            'usuarioEstado': 'estado',
                            'usuarioComplemento': 'complemento',
                            'usuarioEscolaridade': 'escolaridade',
                            'usuarioPossuiPet': 'possui_pet',
                            'usuarioDesejaAdotar': 'deseja_adotar',
                            'usuarioDesejaContribuir': 'deseja_contribuir'
                        },
                        admin: {
                            'adminId': 'id_usuario',
                            'adminNome': 'nome',
                            'adminSobrenome': 'sobrenome',
                            'adminEmail': 'email',
                            'adminSenha': 'senha',
                            'adminDataNascimento': 'data_nascimento',
                            'adminTelefone': 'telefone',
                            'adminCpf': 'cpf',
                            'adminCep': 'cep',
                            'adminLogradouro': 'logradouro',
                            'adminNumero': 'numero',
                            'adminBairro': 'bairro',
                            'adminCidade': 'cidade',
                            'adminEstado': 'estado',
                            'adminComplemento': 'complemento',
                            'adminEscolaridade': 'escolaridade',
                            'adminPossuiPet': 'possui_pet',
                            'adminFuncao': 'funcao'
                        },
                        voluntario: {
                            'voluntarioId': 'id_usuario',
                            'voluntarioNome': 'nome',
                            'voluntarioSobrenome': 'sobrenome',
                            'voluntarioEmail': 'email',
                            'voluntarioSenha': 'senha',
                            'voluntarioDataNascimento': 'data_nascimento',
                            'voluntarioTelefone': 'telefone',
                            'voluntarioCpf': 'cpf',
                            'voluntarioCep': 'cep',
                            'voluntarioLogradouro': 'logradouro',
                            'voluntarioNumero': 'numero',
                            'voluntarioBairro': 'bairro',
                            'voluntarioCidade': 'cidade',
                            'voluntarioEstado': 'estado',
                            'voluntarioComplemento': 'complemento',
                            'voluntarioEscolaridade': 'escolaridade',
                            'voluntarioPossuiPet': 'possui_pet',
                            'voluntarioFuncao': 'funcao',
                            'voluntarioHabilidade': 'habilidade'
                        }
                    };
                    const key = fieldMaps[formType]?.[input.id] || input.id.replace(formType, '').toLowerCase();
                    // Converte para número se o campo for um ID ou idade
                    if (key.toLowerCase().includes('id') || key === 'idade') {
                        formData[key] = input.value ? Number(input.value) : null;
                    } else {
                        formData[key] = input.value;
                    }
                }
            });

            try {
                // Select the appropriate API function based on form type and action
                let response;
                switch (formType) {
                    case 'pet':
                        switch (action) {
                            case 'create': response = await createPet(formData); break;
                            case 'read': response = await readPet(formData); break;
                            case 'update': response = await updatePet(formData); break;
                            case 'delete': response = await deletePet(formData); break;
                        }
                        break;
                    case 'adocao':
                        switch (action) {
                            case 'create': response = await createAdocao(formData); break;
                            case 'read': response = await readAdocao(formData); break;
                            case 'update': response = await updateAdocao(formData); break;
                            case 'delete': response = await deleteAdocao(formData); break;
                        }
                        break;
                    case 'usuario':
                        switch (action) {
                            case 'create': response = await createUsuario(formData); break;
                            case 'read': response = await readUsuario(formData); break;
                            case 'update': response = await updateUsuario(formData); break;
                            case 'delete': response = await deleteUsuario(formData); break;
                        }
                        break;
                    case 'admin':
                        switch (action) {
                            case 'create': response = await createAdmin(formData); break;
                            case 'read': response = await readAdmin(formData); break;
                            case 'update': response = await updateAdmin(formData); break;
                            case 'delete': response = await deleteAdmin(formData); break;
                        }
                        break;
                    case 'voluntario':
                        switch (action) {
                            case 'create': response = await createVoluntario(formData); break;
                            case 'read': response = await readVoluntario(formData); break;
                            case 'update': response = await updateVoluntario(formData); break;
                            case 'delete': response = await deleteVoluntario(formData); break;
                        }
                        break;
                    default:
                        throw new Error(`Tipo de formulário não suportado: ${formType}`);
                }

                if (response.ok) {
                    const data = await response.json();
                    showNotification('Operação realizada com sucesso!', 'success');
                    form.style.display = 'none';
                    form.reset();

                    // Atualiza a tabela de resultados
                    updateResultsTable(data, formType, action);
                } else {
                    throw new Error('Erro na operação');
                }
            } catch (error) {
                console.error('Erro completo:', error);
                if (error.response) {
                    const errorData = await error.response.json();
                    showNotification(errorData.message || error.message, 'error');
                } else {
                    showNotification(error.message, 'error');
                }
            }
        });
    });

    // Funções específicas para operações CRUD
    // === PETS ===
    async function createPet(data) {
        const response = await fetch(`${API_BASE_URL}/pets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function readPet(data) {
        const response = await fetch(`${API_BASE_URL}/pets/buscar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function updatePet(data) {
        const response = await fetch(`${API_BASE_URL}/pets/atualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function deletePet(data) {
        const response = await fetch(`${API_BASE_URL}/pets/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    // === ADOÇÕES ===
    async function createAdocao(data) {
        const response = await fetch(`${API_BASE_URL}/adocoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function readAdocao(data) {
        const response = await fetch(`${API_BASE_URL}/adocoes/buscar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function updateAdocao(data) {
        const response = await fetch(`${API_BASE_URL}/adocoes/atualizar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function deleteAdocao(data) {
        const response = await fetch(`${API_BASE_URL}/adocoes/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    // === USUÁRIO COMUM ===
    async function createUsuario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/comum`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function readUsuario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/comum/buscar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function updateUsuario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/comum/telefone`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function deleteUsuario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/comum/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    // === ADMINISTRADOR ===
    async function createAdmin(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/administrador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function readAdmin(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/administrador/buscar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function updateAdmin(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/administrador/telefone`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function deleteAdmin(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/administrador/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    // === VOLUNTÁRIO ===
    async function createVoluntario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/voluntario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function readVoluntario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/voluntario/buscar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function updateVoluntario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/voluntario/telefone`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    async function deleteVoluntario(data) {
        const response = await fetch(`${API_BASE_URL}/usuarios/voluntario/excluir`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response;
    }

    // Handle API calls for CRUD operations
    async function handleApiCall(type, action, data) {
        console.log('Tipo:', type, 'Ação:', action, 'Dados:', data);
        
        // Mapa de funções
        const functionMap = {
            pet: {
                create: createPet,
                read: readPet,
                update: updatePet,
                delete: deletePet
            },
            adocao: {
                create: createAdocao,
                read: readAdocao,
                update: updateAdocao,
                delete: deleteAdocao
            },
            usuario: {
                create: createUsuario,
                read: readUsuario,
                update: updateUsuario,
                delete: deleteUsuario
            },
            admin: {
                create: createAdmin,
                read: readAdmin,
                update: updateAdmin,
                delete: deleteAdmin
            },
            voluntario: {
                create: createVoluntario,
                read: readVoluntario,
                update: updateVoluntario,
                delete: deleteVoluntario
            }
        };

        // Chama a função específica para o tipo e ação
        const operation = functionMap[type]?.[action];
        if (!operation) {
            throw new Error(`Operação não suportada: ${type} ${action}`);
        }

        return operation(data);
    }

    // Função para atualizar a tabela de resultados
    function updateResultsTable(data, type, action) {
        const resultsSection = document.querySelector('.results-section') || createResultsSection();
        const tableBody = resultsSection.querySelector('tbody');
        
        // Limpa a tabela se for uma operação de leitura
        if (action === 'read') {
            tableBody.innerHTML = '';
        }

        // Configura o cabeçalho baseado no tipo
            const headers = getHeadersForType(type);
        updateTableHeaders(resultsSection.querySelector('thead'), headers);

        // Atualiza o contador de resultados
        const resultCount = resultsSection.querySelector('.result-count');
        // Verifica se os dados estão dentro de uma propriedade data
        const responseData = data.data || data;
        const items = Array.isArray(responseData) ? responseData : [responseData];
        resultCount.textContent = `${items.length} registro${items.length === 1 ? '' : 's'} encontrado${items.length === 1 ? '' : 's'}`;        // Adiciona os dados na tabela
        items.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = formatCellValue(item[header.key]);
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });

        // Mostra a seção de resultados
        resultsSection.style.display = 'block';
    }

    // Função para criar a seção de resultados se não existir
    function createResultsSection() {
        const section = document.createElement('div');
        section.className = 'results-section';
        section.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h3>Resultados</h3>
                    <div class="results-info">
                        <span class="result-count">0 resultados</span>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table class="results-table">
                        <thead><tr></tr></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(section);
        return section;
    }

    // Função para obter os cabeçalhos baseado no tipo
    function getHeadersForType(type) {
        const headers = {
            pet: [
                { key: 'id_pet', label: 'id_pet' },
                { key: 'nome', label: 'Nome' },
                { key: 'especie', label: 'Espécie' },
                { key: 'raca', label: 'Raça' },
                { key: 'porte', label: 'Porte' },
                { key: 'idade', label: 'Idade' }
            ],
            adocao: [
                { key: 'id', label: 'ID' },
                { key: 'petId', label: 'ID do Pet' },
                { key: 'usuarioId', label: 'ID do Usuário' },
                { key: 'status', label: 'Status' },
                { key: 'dataAdocao', label: 'Data da Adoção' }
            ],
            usuario: [
                { key: 'id', label: 'ID' },
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'Email' },
                { key: 'telefone', label: 'Telefone' }
            ],
            admin: [
                { key: 'id', label: 'ID' },
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'Email' },
                { key: 'cargo', label: 'Cargo' }
            ],
            voluntario: [
                { key: 'id', label: 'ID' },
                { key: 'nome', label: 'Nome' },
                { key: 'email', label: 'Email' },
                { key: 'disponibilidade', label: 'Disponibilidade' }
            ]
        };
        return headers[type] || [];
    }

    // Função para atualizar os cabeçalhos da tabela
    function updateTableHeaders(thead, headers) {
        const headerRow = thead.querySelector('tr');
        headerRow.innerHTML = '';
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.label;
            headerRow.appendChild(th);
        });
    }
});
