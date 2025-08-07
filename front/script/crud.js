// CRUD Operations Handler - VERSÃO CORRIGIDA
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

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            font-family: Arial, sans-serif;
        ">
            ${message}
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 4000);
}

// Inicialização do CRUD
document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:3000/api';

    // Handle CRUD button clicks
    document.querySelectorAll('.crud-btn').forEach(button => {
        button.addEventListener('click', function () {
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
                switch (action) {
                    case 'create':
                        titleElement.textContent = `Criar Novo ${crudType.charAt(0).toUpperCase() + crudType.slice(1)}`;
                        form.reset(); // Limpa o formulário
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

                // Store current action in form
                form.setAttribute('data-current-action', action);

                // Handle which fields to show based on action
                const idField = form.querySelector(`#${crudType}Id, #${crudType}Email`);
                const petLocationSection = form.querySelector('.pet-location-section');

                if (action === 'create') {
                    // Show all fields for create, except ID field
                    form.querySelectorAll('input, select, textarea').forEach(input => {

                        // Para adoção no create, mostrar apenas petIdAdocao e usuarioIdAdocao
                        if (crudType === 'adocao') {
                            if (input.id === 'petIdAdocao' || input.id === 'usuarioIdAdocao') {
                                input.style.display = 'block';
                                input.required = true;
                            } else {
                                input.style.display = 'none';
                                input.required = false;
                            }
                        }
                        // Para outros tipos, lógica original
                        else if (input.id.toLowerCase().includes('id') && !input.id.toLowerCase().includes('pid')) {
                            input.style.display = 'none';
                            input.required = false;
                        } else {
                            input.style.display = 'block';
                        }
                    });
                    form.querySelectorAll('.form-section').forEach(section => {
                        section.style.display = 'block';
                    });
                } else if (action === 'read' || action === 'delete') {
                    // Show only ID/email field for read and delete
                    form.querySelectorAll('input, select, textarea').forEach(input => {
                        // Para adoção, mostrar apenas o campo adocaoId
                        if (crudType === 'adocao') {
                            if (input.id === 'adocaoId') {
                                input.style.display = 'block';
                                input.required = true;
                            } else {
                                input.style.display = 'none';
                                input.required = false;
                            }
                        } else if (crudType === 'pet') {
                            if (petLocationSection) {
                                petLocationSection.style.display = 'none';
                            }
                            // Mostrar apenas o campo ID do pet
                            form.querySelectorAll('input, select, textarea').forEach(input => {
                                if (input.id === 'petId') {
                                    input.style.display = 'block';
                                    input.required = true;
                                } else {
                                    input.style.display = 'none';
                                    input.required = false;
                                }
                            });
                        }

                        // Para outros tipos, lógica original
                        else if (input.id.toLowerCase().includes('email') ||
                            (input.id.toLowerCase().includes('id') && !input.id.toLowerCase().includes('pid'))) {
                            input.style.display = 'block';
                            input.required = true;
                        } else {
                            input.style.display = 'none';
                            input.required = false;
                        }
                    });
                } else if (action === 'update') {
                    // Update operation - show specific fields based on form type
                    form.querySelectorAll('input, select, textarea').forEach(input => {
                        input.style.display = 'none';
                        input.required = false;
                    });

                    if (crudType === 'pet') {
                        // Para Pet: mostrar ID, espécie e porte
                        ['petId', 'petSpecies', 'petSize'].forEach(fieldId => {
                            const field = document.getElementById(fieldId);
                            if (field) {
                                field.style.display = 'block';
                                if (fieldId !== 'petId') field.required = true;
                            }
                        });
                    } else if (crudType === 'adocao') {
                        // Para Adoção: mostrar ID e novo pet
                        ['adocaoId', 'petIdAdocao'].forEach(fieldId => {
                            const field = document.getElementById(fieldId);
                            if (field) {
                                field.style.display = 'block';
                                if (fieldId !== 'adocaoId') field.required = true;
                            }
                        });
                    } else {
                        // Para usuários: mostrar email e telefone
                        const prefix = crudType;
                        [`${prefix}Email`, `${prefix}Telefone`].forEach(fieldId => {
                            const field = document.getElementById(fieldId);
                            if (field) {
                                field.style.display = 'block';
                                field.required = true;
                            }
                        });
                    }

                    form.querySelectorAll('.form-section').forEach((section, index) => {
                        section.style.display = index === 0 ? 'block' : 'none';
                    });
                }
            }
        });
    });

    // Handle form cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function () {
            const formType = this.dataset.form;
            const form = document.getElementById(`${formType}Form`);
            if (form) {
                form.style.display = 'none';
                form.reset();
            }
        });
    });

    // Handle form submissions
    document.querySelectorAll('.submit-btn').forEach(button => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();

            const formType = this.dataset.form;
            const form = document.getElementById(`${formType}Form`);

            if (!form) {
                showNotification('Formulário não encontrado', 'error');
                return;
            }

            const action = form.getAttribute('data-current-action') || 'create';

            // Get form data
            const formData = new FormData(form);
            const data = {};

            // Convert FormData to object and handle field mapping
            for (let [key, value] of formData.entries()) {
                if (value.trim() !== '') {
                    // Convert numeric fields
                    if (key.includes('id') || key === 'idade') {
                        data[key] = parseInt(value) || value;
                    } else {
                        data[key] = value;
                    }
                }
            }

            // Handle special cases for different actions
            if (action === 'read' || action === 'delete') {
                // For read/delete, get the identifier from visible inputs
                const visibleInputs = form.querySelectorAll('input[style*="block"], input:not([style*="none"])');
                const identifierInput = Array.from(visibleInputs).find(input =>
                    input.value.trim() !== '' &&
                    (input.id.includes('Email') || input.id.includes('Id'))
                );

                if (identifierInput) {
                    if (identifierInput.id.includes('Email')) {
                        data.email = identifierInput.value;
                    } else if (identifierInput.id.includes('Id')) {
                        const idKey = getIdKeyForType(formType);
                        data[idKey] = parseInt(identifierInput.value);
                    }
                }
            }

            try {
                let response;

                // Select the appropriate API function based on form type and action
                switch (formType) {
                    case 'pet':
                        response = await handlePetOperation(action, data);
                        break;
                    case 'adocao':
                        response = await handleAdocaoOperation(action, data);
                        break;
                    case 'usuario':
                        response = await handleUsuarioOperation(action, data);
                        break;
                    case 'admin':
                        response = await handleAdminOperation(action, data);
                        break;
                    case 'voluntario':
                        response = await handleVoluntarioOperation(action, data);
                        break;
                    default:
                        throw new Error(`Tipo de formulário não suportado: ${formType}`);
                }

                if (response.ok) {
                    const responseData = await response.json();
                    showNotification(getSuccessMessage(action, formType), 'success');
                    form.style.display = 'none';
                    form.reset();

                    // Update results table if it's a read operation
                    if (action === 'read' && responseData.data) {
                        updateResultsTable(responseData, formType, action);
                    }
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro na operação ${action}`);
                }
            } catch (error) {
                console.error('Erro completo:', error);
                showNotification(error.message || 'Erro na operação', 'error');
            }
        });
    });

    // Helper functions for API operations
    function getIdKeyForType(type) {
        const idKeys = {
            'pet': 'id_pet',
            'adocao': 'id_adocao',
            'usuario': 'id_usuario',
            'admin': 'id_usuario',
            'voluntario': 'id_usuario'
        };
        return idKeys[type] || 'id';
    }

    function getSuccessMessage(action, type) {
        const actions = {
            'create': 'criado',
            'read': 'encontrado',
            'update': 'atualizado',
            'delete': 'excluído'
        };
        return `${type.charAt(0).toUpperCase() + type.slice(1)} ${actions[action]} com sucesso!`;
    }

    // Pet operations
    async function handlePetOperation(action, data) {
        const endpoints = {
            'create': { url: `${API_BASE_URL}/pets`, method: 'POST' },
            'read': { url: `${API_BASE_URL}/pets/buscar`, method: 'POST' },
            'update': { url: `${API_BASE_URL}/pets/atualizar`, method: 'PUT' },
            'delete': { url: `${API_BASE_URL}/pets/excluir`, method: 'DELETE' }
        };

        const endpoint = endpoints[action];
        return fetch(endpoint.url, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    // Adocao operations
    async function handleAdocaoOperation(action, data) {
        const endpoints = {
            'create': { url: `${API_BASE_URL}/adocoes`, method: 'POST' },
            'read': { url: `${API_BASE_URL}/adocoes/buscar`, method: 'POST' },
            'update': { url: `${API_BASE_URL}/adocoes/atualizar`, method: 'PUT' },
            'delete': { url: `${API_BASE_URL}/adocoes/excluir`, method: 'DELETE' }
        };

        const endpoint = endpoints[action];
        return fetch(endpoint.url, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    // Usuario operations
    async function handleUsuarioOperation(action, data) {
        const endpoints = {
            'create': { url: `${API_BASE_URL}/usuarios/comum`, method: 'POST' },
            'read': { url: `${API_BASE_URL}/usuarios/comum/buscar`, method: 'POST' },
            'update': { url: `${API_BASE_URL}/usuarios/comum/telefone`, method: 'PUT' },
            'delete': { url: `${API_BASE_URL}/usuarios/comum/excluir`, method: 'DELETE' }
        };

        const endpoint = endpoints[action];
        return fetch(endpoint.url, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    // Admin operations
    async function handleAdminOperation(action, data) {
        const endpoints = {
            'create': { url: `${API_BASE_URL}/usuarios/administrador`, method: 'POST' },
            'read': { url: `${API_BASE_URL}/usuarios/administrador/buscar`, method: 'POST' },
            'update': { url: `${API_BASE_URL}/usuarios/administrador/telefone`, method: 'PUT' },
            'delete': { url: `${API_BASE_URL}/usuarios/administrador/excluir`, method: 'DELETE' }
        };

        const endpoint = endpoints[action];
        return fetch(endpoint.url, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    // Voluntario operations
    async function handleVoluntarioOperation(action, data) {
        const endpoints = {
            'create': { url: `${API_BASE_URL}/usuarios/voluntario`, method: 'POST' },
            'read': { url: `${API_BASE_URL}/usuarios/voluntario/buscar`, method: 'POST' },
            'update': { url: `${API_BASE_URL}/usuarios/voluntario/telefone`, method: 'PUT' },
            'delete': { url: `${API_BASE_URL}/usuarios/voluntario/excluir`, method: 'DELETE' }
        };

        const endpoint = endpoints[action];
        return fetch(endpoint.url, {
            method: endpoint.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    // Function to update results table
    function updateResultsTable(data, type, action) {
        let resultsSection = document.querySelector('.results-section');

        if (!resultsSection) {
            resultsSection = createResultsSection();
        }

        const tableBody = resultsSection.querySelector('#tableBody');
        const tableHeader = resultsSection.querySelector('#tableHeader');

        if (!tableBody || !tableHeader) return;

        // Clear table
        tableBody.innerHTML = '';
        tableHeader.innerHTML = '';

        // Get data array
        const responseData = data.data || data;
        const items = Array.isArray(responseData) ? responseData : [responseData];

        if (items.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="100%">Nenhum resultado encontrado</td></tr>';
            return;
        }

        // Create headers based on first item
        const firstItem = items[0];
        const headers = Object.keys(firstItem);

        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = formatHeader(header);
            headerRow.appendChild(th);
        });
        tableHeader.appendChild(headerRow);

        // Add data rows
        items.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = formatCellValue(item[header]);
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });

        // Update result count
        const resultCount = resultsSection.querySelector('#resultCount');
        if (resultCount) {
            resultCount.textContent = `${items.length} registro${items.length === 1 ? '' : 's'} encontrado${items.length === 1 ? '' : 's'}`;
        }

        // Show results section
        resultsSection.style.display = 'block';
    }

    // Function to create results section if it doesn't exist
    function createResultsSection() {
        const section = document.createElement('section');
        section.className = 'results-section';
        section.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h3 id="queryTitle">Resultados</h3>
                    <div class="results-info">
                        <span id="resultCount" class="result-count">0 resultados</span>
                    </div>
                </div>
                <div class="table-wrapper">
                    <table id="resultsTable" class="results-table">
                        <thead id="tableHeader"></thead>
                        <tbody id="tableBody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(section);
        }

        return section;
    }
});