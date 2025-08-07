// JavaScript para o Dashboard ONG

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuração da API
    const API_BASE_URL = 'http://localhost:3000/api';
    
    // Mapeamento das queries para endpoints
    const queryEndpoints = {
        'usuarios-com-pet': '/usuarios-com-pet',
        'pets-grandes-medio': '/pets-grandes-medio',
        'voluntarios-por-funcao': '/voluntarios-por-funcao',
        'adocoes-por-porte': '/adocoes-por-porte',
        'voluntarios-habilidade-cidade': '/voluntarios-habilidade-cidade',
        'pets-por-especie-evento': '/pets-por-especie-evento',
        'media-idade-pets-cidade': '/media-idade-pets-cidade',
        'habilidades-voluntarios': '/habilidades-voluntarios',
        'usuarios-sem-pet-adotar': '/usuarios-sem-pet-adotar',
        'pets-multiplas-fotos': '/pets-multiplas-fotos',
        'pets-raca-adotados-evento': '/pets-raca-adotados-evento'
    };
    
    // Mapeamento dos títulos das queries
    const queryTitles = {
        'usuarios-com-pet': '👥 Usuários com Pet por Escolaridade',
        'pets-grandes-medio': '🐾 Pets Grandes e Médios',
        'voluntarios-por-funcao': '🤝 Voluntários por Função',
        'adocoes-por-porte': '🏠 Adoções por Porte',
        'voluntarios-habilidade-cidade': '🌍 Voluntários com Habilidade por Cidade',
        'pets-por-especie-evento': '🎉 Pets por Espécie em Eventos',
        'media-idade-pets-cidade': '📈 Média de Idade dos Pets por Cidade',
        'habilidades-voluntarios': '⚡ Habilidades dos Voluntários',
        'usuarios-sem-pet-adotar': '💝 Usuários sem Pet que Desejam Adotar',
        'pets-multiplas-fotos': '📸 Pets com Múltiplas Fotos',
        'pets-raca-adotados-evento': '🏆 Pets de Cada Raça Adotados por Evento'
    };
    
    // Botões de consulta no aside
    const queryButtons = document.querySelectorAll('.nav-btn[data-query]');
    
    queryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const queryType = this.getAttribute('data-query');
            executeQuery(queryType, this);
        });
    });
    
    // Função para executar queries
    async function executeQuery(queryType, button) {
        if (!queryEndpoints[queryType]) {
            showNotification('Query não encontrada!', 'error');
            return;
        }
        
        // Remove active de todos os botões
        queryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adiciona active ao botão clicado
        button.classList.add('active');
        button.classList.add('loading');
        
        const originalText = button.textContent;
        button.textContent = '⏳ Carregando...';
        button.disabled = true;
        
        try {
            const startTime = Date.now();
            const response = await fetch(`${API_BASE_URL}${queryEndpoints[queryType]}`);
            const endTime = Date.now();
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Atualiza a interface
            updateResultsTable(data, queryType);
            updateStats(data.length, endTime - startTime);
            updateQueryTitle(queryTitles[queryType]);
            
            showNotification(`Consulta executada com sucesso! ${data.length} registros encontrados.`, 'success');
            
        } catch (error) {
            console.error('Erro ao executar query:', error);
            showNotification(`Erro ao executar consulta: ${error.message}`, 'error');
            
            // Mostra dados de exemplo em caso de erro
            showExampleData(queryType);
        } finally {
            // Restaura o botão
            button.classList.remove('loading');
            button.textContent = originalText;
            button.disabled = false;
        }
    }
    
    // Função para atualizar a tabela de resultados
    function updateResultsTable(data, queryType) {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');
        
        if (!data || data.length === 0) {
            tableHeader.innerHTML = '<tr><th>Nenhum resultado encontrado</th></tr>';
            tableBody.innerHTML = '<tr><td colspan="100" class="loading-message">Nenhum dado disponível</td></tr>';
            return;
        }
        
        // Cria cabeçalho da tabela
        const headers = Object.keys(data[0]);
        const headerRow = headers.map(header => `<th>${formatHeader(header)}</th>`).join('');
        tableHeader.innerHTML = `<tr>${headerRow}</tr>`;
        
        // Cria linhas da tabela
        const rows = data.map(row => {
            const cells = headers.map(header => `<td>${formatCellValue(row[header])}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        
        tableBody.innerHTML = rows;
    }
    
    // Função para formatar cabeçalhos
    function formatHeader(header) {
        return header
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/([A-Z])/g, ' $1')
            .trim();
    }
    
    // Função para formatar valores das células
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
    
    // Função para atualizar estatísticas
    function updateStats(recordCount, queryTime) {
        document.getElementById('totalRecords').textContent = recordCount.toLocaleString('pt-BR');
        document.getElementById('queryTimeDisplay').textContent = `${queryTime}ms`;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('pt-BR');
        document.getElementById('resultCount').textContent = `${recordCount} registros encontrados`;
        document.getElementById('queryTime').textContent = `Tempo: ${queryTime}ms`;
    }
    
    // Função para atualizar título da query
    function updateQueryTitle(title) {
        document.getElementById('queryTitle').textContent = title;
    }
    
    // Função para mostrar dados de exemplo
    function showExampleData(queryType) {
        const exampleData = {
            'usuarios-com-pet': [
                { escolaridade: 'Ensino Superior', total_usuarios_com_pet: 45 },
                { escolaridade: 'Ensino Médio', total_usuarios_com_pet: 32 },
                { escolaridade: 'Ensino Fundamental', total_usuarios_com_pet: 18 }
            ],
            'pets-grandes-medio': [
                { nome: 'Rex', especie: 'Cachorro', raca: 'Labrador', idade: 3, porte: 'grande' },
                { nome: 'Thor', especie: 'Cachorro', raca: 'Pastor Alemão', idade: 2, porte: 'grande' },
                { nome: 'Luna', especie: 'Gato', raca: 'Maine Coon', idade: 1, porte: 'médio' }
            ],
            'voluntarios-por-funcao': [
                { funcao: 'Cuidados com Pets', total_voluntarios: 15 },
                { funcao: 'Administrativo', total_voluntarios: 8 },
                { funcao: 'Eventos', total_voluntarios: 12 }
            ]
        };
        
        const data = exampleData[queryType] || [{ exemplo: 'Dados de exemplo' }];
        updateResultsTable(data, queryType);
        updateStats(data.length, 150);
        updateQueryTitle(queryTitles[queryType] + ' (Dados de Exemplo)');
    }
    
    // Botões de ação
    const refreshAllBtn = document.getElementById('refreshAll');
    const clearResultsBtn = document.getElementById('clearResults');
    
    if (refreshAllBtn) {
        refreshAllBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.textContent = '⏳ Atualizando...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = '🔄 Atualizar Tudo';
                showNotification('Todas as consultas foram atualizadas!', 'success');
            }, 2000);
        });
    }
    
    if (clearResultsBtn) {
        clearResultsBtn.addEventListener('click', function() {
            // Limpa a tabela
            document.getElementById('tableHeader').innerHTML = '<tr><th>Selecione uma consulta</th></tr>';
            document.getElementById('tableBody').innerHTML = `
                <tr>
                    <td colspan="100" class="loading-message">
                        <div class="loading-spinner"></div>
                        <p>Selecione uma consulta para ver os resultados</p>
                    </td>
                </tr>
            `;
            
            // Limpa estatísticas
            document.getElementById('totalRecords').textContent = '0';
            document.getElementById('queryTimeDisplay').textContent = '0ms';
            document.getElementById('resultCount').textContent = '0 registros encontrados';
            document.getElementById('queryTime').textContent = '';
            document.getElementById('queryTitle').textContent = '📋 Resultados da Consulta';
            
            // Remove active de todos os botões
            queryButtons.forEach(btn => btn.classList.remove('active'));
            
            showNotification('Resultados limpos com sucesso!', 'success');
        });
    }
    
    // Função para mostrar notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Adiciona estilos inline para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Cores baseadas no tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Animação para notificações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Console log para debug
    console.log('🚀 Dashboard ONG carregado com sucesso!');
    console.log('📊 Consultas disponíveis:', Object.keys(queryEndpoints));
    console.log('🔧 Funcionalidades: execução de queries, notificações, loading states');
    
    // Inicializa com mensagem de boas-vindas
    showNotification('Dashboard carregado! Selecione uma consulta no menu lateral.', 'info');
    
    // // CRUD Button Event Listeners
    // document.querySelectorAll('.crud-btn').forEach(button => {
    //     button.addEventListener('click', function() {
    //         const crudType = this.dataset.crud;
    //         const action = this.dataset.action;
    //         handleCrudAction(crudType, action);
    //     });
    // });

    // // Cancel Button Event Listeners
    // document.querySelectorAll('.cancel-btn').forEach(button => {
    //     button.addEventListener('click', function() {
    //         const formId = `${this.dataset.form}Form`;
    //         document.getElementById(formId).style.display = 'none';
    //     });
    // });

    // // Form Submit Event Listeners
    // document.querySelectorAll('.submit-btn').forEach(button => {
    //     button.addEventListener('click', async function() {
    //         const formType = this.dataset.form;
    //         const formId = `${formType}Form`;
    //         const form = document.getElementById(formId);
    //         console.log(`Submitting form: ${formType}`);
    //         try {
    //             const formData = getFormData(formType);
    //             console.log(`Submitting form: `, formData);
    //             const response = await submitFormData(formType, formData);
                
    //             if (response.ok) {
    //                 showNotification('Operação realizada com sucesso!', 'success');
    //                 form.style.display = 'none';
    //                 form.reset();
    //             } else {
    //                 throw new Error('Erro na operação');
    //             }
    //         } catch (error) {
    //             showNotification(error.message, 'error');
    //         }
    //     });
    // });

    // // Handle CRUD Actions
    // function handleCrudAction(type, action) {
    //     const formId = `${type}Form`;
    //     const form = document.getElementById(formId);
    //     const titleId = `${type}CrudTitle`;
    //     const title = document.getElementById(titleId);

    //     // Hide all other forms first
    //     document.querySelectorAll('.crud-form').forEach(form => {
    //         form.style.display = 'none';
    //     });

    //     switch(action) {
    //         case 'create':
    //             title.textContent = `Criar Novo ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    //             form.reset();
    //             form.style.display = 'block';
    //             break;
    //         case 'read':
    //             title.textContent = `Buscar ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    //             form.reset();
    //             showSearchFields(type);
    //             form.style.display = 'block';
    //             break;
    //         case 'update':
    //             title.textContent = `Atualizar ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    //             form.reset();
    //             form.style.display = 'block';
    //             break;
    //         case 'delete':
    //             title.textContent = `Excluir ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    //             form.reset();
    //             showDeleteConfirmation(type);
    //             form.style.display = 'block';
    //             break;
    //     }
    // }

    // Get Form Data Based on Type
    // function getFormData(type) {
    //     const formData = {};
    //     const form = document.getElementById(`${type}Form`);
        
    //     // Get all input, select, and textarea elements
    //     form.querySelectorAll('input, select, textarea').forEach(element => {
    //         const fieldName = element.id.replace(`${type}`, '');
            
    //         if (element.type === 'checkbox') {
    //             formData[fieldName] = element.checked;
    //         } else if (element.type === 'file') {
    //             formData[fieldName] = element.files[0];
    //         } else {
    //             // Converte para número se for um campo de ID
    //             if (fieldName.toLowerCase().includes('id') && element.value) {
    //                 formData[fieldName] = Number(element.value);
    //             } else {
    //                 formData[fieldName] = element.value;
    //             }
    //         }
    //     });

    //     return formData;
    // }

   
    // Show Search Fields
    // function showSearchFields(type) {
    //     const form = document.getElementById(`${type}Form`);
        
    //     // Hide all fields except search-related ones
    //     form.querySelectorAll('input, select, textarea').forEach(element => {
    //         if (!element.id.toLowerCase().includes('email') && 
    //             !element.id.toLowerCase().includes('id')) {
    //             element.style.display = 'none';
    //         }
    //     });
    // }

    // Show Delete Confirmation
    function showDeleteConfirmation(type) {
        const form = document.getElementById(`${type}Form`);
        
        // Hide all fields except ID/email
        form.querySelectorAll('input, select, textarea').forEach(element => {
            if (!element.id.toLowerCase().includes('email') && 
                !element.id.toLowerCase().includes('id')) {
                element.style.display = 'none';
            }
        });
    }
});

// Função global para mostrar notificações
window.showNotification = function(message, type) {
    // Reutiliza a função de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease-out;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
};
