import { Router, Request, Response } from "express";
import { executeQuery } from "../database";
import { OkPacket, RowDataPacket } from 'mysql2/promise';

export class OngRoutes {

    getUsuariosComPet = async (req: Request, res: Response) => {
        try {
            const query = `
                        SELECT
                escolaridade,
                COUNT(id_usuario) AS total_usuarios_com_pet
            FROM
                Usuario
            WHERE
                possui_pet = 'sim'
            GROUP BY
                escolaridade
            ORDER BY
                total_usuarios_com_pet DESC;

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getPetsGrandesEDeMeio = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                nome,
                especie,
                raca,
                idade,
                porte
            FROM
                Pet
            WHERE
                porte IN ('grande', 'médio')
            ORDER BY
                idade DESC, nome ASC
            LIMIT 10;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getNumeroDeVoluntariosPorFuncao = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                V.funcao,
                COUNT(U.id_usuario) AS total_voluntarios
            FROM
                Voluntario AS V
            JOIN
                Usuario AS U ON V.id_voluntario = U.id_usuario
            GROUP BY
                V.funcao
            ORDER BY
                total_voluntarios DESC;

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getTotalDeAdocoesPorPorte = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                P.porte,
                COUNT(A.id_adocao) AS total_adocoes
            FROM
                Adocao AS A
            JOIN
                Pet AS P ON A.id_pet = P.id_pet
            GROUP BY
                P.porte
            ORDER BY
                total_adocoes DESC;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getTotalDeVoluntariosComHabilidadePorCidade = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                U.cidade,
                COUNT(DISTINCT U.id_usuario) AS total_voluntarios_com_habilidade
            FROM
                Usuario AS U
            JOIN
                Voluntario AS V ON U.id_usuario = V.id_voluntario
            JOIN
                Habilidade AS H ON U.id_usuario = H.id_usuario
            GROUP BY
                U.cidade
            ORDER BY
                total_voluntarios_com_habilidade DESC;

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getTotalDePetsPorEspeciePorEvento = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                E.nome_evento,
                P.especie,
                COUNT(PE.id_pet) AS total_pets_no_evento
            FROM
                Pet_Evento AS PE
            JOIN
                Pet AS P ON PE.id_pet = P.id_pet
            JOIN
                Evento_adocao AS E ON PE.id_evento = E.id_evento
            GROUP BY
                E.nome_evento, P.especie
            ORDER BY
                E.nome_evento, P.especie;

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getMediaDeIdadeDosPetsAdotadosPorCidade = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                U.cidade,
                ROUND(AVG(P.idade), 1) AS media_idade_pets_adotados
            FROM
                Adocao AS A
            JOIN
                Usuario AS U ON A.id_usuario = U.id_usuario
            JOIN
                Pet AS P ON A.id_pet = P.id_pet
            GROUP BY
                U.cidade
            HAVING
                COUNT(A.id_adocao) > 0 -- Garante que apenas cidades com adoções sejam mostradas
            ORDER BY
                media_idade_pets_adotados DESC;

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getTotalDeHabilidadesPorUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                U.tipo_usuario,
                COUNT(H.id_habilidade) AS total_habilidades
            FROM
                Usuario AS U
            JOIN
                Habilidade AS H ON U.id_usuario = H.id_usuario
            WHERE
                U.tipo_usuario = 'voluntário'
            GROUP BY
                U.tipo_usuario;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getUsuariosQueNaoPossuemPetEDesejamAdotar = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                U.nome,
                U.sobrenome,
                U.email,
                U.possui_pet
            FROM
                Usuario AS U
            LEFT JOIN
                Comum AS C ON U.id_usuario = C.id_comum
            WHERE
                U.possui_pet = 'não' AND C.deseja_adotar = 'sim';

            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getPetsComMaisDeUmaFoto = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                P.nome AS nome_pet,
                P.especie,
                COUNT(F.id_foto) AS total_fotos
            FROM
                Pet AS P
            JOIN
                Foto AS F ON P.id_pet = F.id_pet
            GROUP BY
                P.id_pet, P.nome, P.especie -- Agrupa por pet para contar suas fotos
            HAVING
                COUNT(F.id_foto) > 1 -- Filtra apenas pets com mais de uma foto
            ORDER BY
                total_fotos DESC;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getPetsDeCadaRacaAdotadosPorEvento = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                E.nome_evento,
                P.raca,
                P.especie,
                COUNT(PE.id_pet) AS pets_participantes,
                COUNT(A.id_adocao) AS pets_adotados
            FROM
                Pet_Evento AS PE
            -- Junta com a tabela Pet para obter a raça e espécie
            JOIN
                Pet AS P ON PE.id_pet = P.id_pet
            -- Junta com a tabela Evento_adocao para obter o nome do evento
            JOIN
                Evento_adocao AS E ON PE.id_evento = E.id_evento
            -- Junta com a tabela Adocao para verificar se o pet foi adotado
            LEFT JOIN
                Adocao AS A ON PE.id_pet = A.id_pet
            GROUP BY
                E.nome_evento, P.raca, P.especie
            ORDER BY
                pets_adotados DESC, pets_participantes DESC;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    getTotalDeAdocoesPorCidade = async (req: Request, res: Response) => {
        try {
            const query = `
            SELECT
                P.cidade,
                COUNT(A.id_adocao) AS total_adocoes_locais
            FROM
                Adocao AS A
            -- Junta com a tabela Pet para obter a cidade do pet
            JOIN
                Pet AS P ON A.id_pet = P.id_pet
            -- Junta com a tabela Usuario para obter a cidade do adotante
            JOIN
                Usuario AS U ON A.id_usuario = U.id_usuario
            -- Filtra apenas os casos em que a cidade do pet e do usuário são iguais
            WHERE
                P.cidade = U.cidade
            GROUP BY
                P.cidade
            ORDER BY
                total_adocoes_locais DESC;
            `;
            const ongs = await executeQuery(query) as RowDataPacket[];
            //montar o json

            res.json(ongs);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar ONGs',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // ==================== CRUD PET ====================

    // CREATE (C) - Criar novo pet
    createPet = async (req: Request, res: Response) => {
        try {
            const {
                nome,
                raca,
                especie,
                idade,
                sexo,
                porte,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado
            } = req.body;

            // Validação básica
            if (!nome || !especie) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome e espécie são obrigatórios'
                });
            }

            // Validação do campo sexo
            if (sexo && !['macho', 'fêmea'].includes(sexo.toLowerCase())) {
                return res.status(400).json({
                    status: 'error',
                    message: 'O sexo deve ser "macho" ou "fêmea"'
                });
            }

            const query = `
                INSERT INTO Pet (
                    nome,
                    raca,
                    especie,
                    idade,
                    sexo,
                    porte,
                    cep,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                nome,
                raca,
                especie,
                idade,
                sexo ? sexo.toLowerCase() : null,
                porte,
                cep || null,
                logradouro || null,
                numero || null,
                bairro || null,
                cidade || null,
                estado || null
            ];

            const result = await executeQuery(query, params) as OkPacket;

            return res.status(201).json({
                status: 'success',
                message: 'Pet criado com sucesso',
                data: {
                    id_pet: result.insertId,
                    nome,
                    especie,
                    raca: raca,
                    idade: idade
                }
            });

        } catch (error) {
            console.error('Erro ao criar pet:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao criar pet',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Listar todos os pets
    getAllPets = async (req: Request, res: Response) => {
        try {
            const query = `
                SELECT
                    id_pet,
                    nome,
                    raca,
                    especie,
                    idade,
                    sexo,
                    porte,
                    cidade,
                    estado
                FROM
                    Pet
                ORDER BY
                    nome ASC
            `;

            const pets = await executeQuery(query) as RowDataPacket[];

            return res.json({
                status: 'success',
                data: pets,
                count: pets.length
            });

        } catch (error) {
            console.error('Erro ao listar pets:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao listar pets',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Buscar pet por ID
    getPetById = async (req: Request, res: Response) => {
        try {
            const { id_pet } = req.body;
            console.log('Buscando pet com ID:', id_pet);
            if (!id_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID do pet é obrigatório'
                });
            }

            const query = `
                SELECT
                    id_pet,
                    nome,
                    raca,
                    especie,
                    idade,
                    sexo,
                    porte,
                    cep,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado
                FROM
                    Pet
                WHERE
                    id_pet = ?
            `;

            const pets = await executeQuery(query, [id_pet]) as RowDataPacket[];
            
            
            console.log('Pet encontrado:', pets);
            return res.json({
                status: 'success',
                data: pets[0]
            });

        } catch (error) {
            console.error('Erro ao buscar pet:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar pet',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar dados do pet
    updatePet = async (req: Request, res: Response) => {
        try {
            const { id_pet } = req.body;
            const {
                especie,
                porte,

            } = req.body;

            if (!id_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID do pet é obrigatório'
                });
            }

            // Primeiro verifica se o pet existe
            const checkQuery = `SELECT id_pet FROM Pet WHERE id_pet = ?`;
            const existingPet = await executeQuery(checkQuery, [id_pet]) as RowDataPacket[];

            if (existingPet.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pet não encontrado'
                });
            }

            // Constrói a query de atualização dinamicamente baseada nos campos fornecidos
            const updates: string[] = [];
            const params: any[] = [];

            if (especie !== undefined) {
                updates.push('especie = ?');
                params.push(especie);
            }

            if (porte !== undefined) {
                updates.push('porte = ?');
                params.push(porte);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nenhum campo para atualizar fornecido'
                });
            }

            const updateQuery = `UPDATE Pet SET ${updates.join(', ')} WHERE id_pet = ?`;
            params.push(id_pet);

            await executeQuery(updateQuery, params);

            // Busca o pet atualizado para retornar todas as colunas
            const updatedPetQuery = `
                SELECT
                    id_pet,
                    nome,
                    raca,
                    especie,
                    idade,
                    sexo,
                    porte,
                    cep,
                    logradouro,
                    numero,
                    bairro,
                    cidade,
                    estado
                FROM
                    Pet
                WHERE
                    id_pet = ?
            `;

            const updatedPetResult = await executeQuery(updatedPetQuery, [id_pet]) as RowDataPacket[];

            return res.json({
                status: 'success',
                message: 'Pet atualizado com sucesso',
                data: updatedPetResult[0]
            });

        } catch (error) {
            console.error('Erro ao atualizar pet:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar pet',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // DELETE (D) - Excluir pet e seus registros relacionados
    deletePet = async (req: Request, res: Response) => {
        try {
            const { id_pet } = req.body;

            if (!id_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID do pet é obrigatório'
                });
            }

            // Verifica se o pet existe
            const checkQuery = `SELECT id_pet FROM Pet WHERE id_pet = ?`;
            const existingPetResult = await executeQuery(checkQuery, [id_pet]) as RowDataPacket[];

            if (existingPetResult.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pet não encontrado'
                });
            }

            try {
                // Deleta registros relacionados em ordem (devido às foreign keys)
                // Faz todas as operações em sequência
            
                await executeQuery('DELETE FROM Pet WHERE id_pet = ?', [id_pet]);

                return res.json({
                    status: 'success',
                    message: 'Pet e todos os registros relacionados foram excluídos com sucesso',
                    data: {
                        id_pet: parseInt(id_pet)
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao excluir pet:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir pet',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // ==================== CRUD ADOÇÃO ====================

    // CREATE (C) - Criar novo registro de adoção
    createAdocao = async (req: Request, res: Response) => {
        try {
            const {
                id_pet,
                id_usuario
            } = req.body;
            console.log(req.body, req.body.id_usuario);
            // Validação básica - nenhum campo pode ser null
            if (!id_pet || !id_usuario) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID do pet e ID do usuário são obrigatórios'
                });
            }

            // Verifica se o pet existe
            const checkPetQuery = `SELECT id_pet FROM Pet WHERE id_pet = ?`;
            const existingPet = await executeQuery(checkPetQuery, [id_pet]) as RowDataPacket[];

            if (existingPet.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pet não encontrado'
                });
            }

            // Verifica se o usuário existe
            const checkUsuarioQuery = `SELECT id_usuario FROM Usuario WHERE id_usuario = ?`;
            const existingUsuario = await executeQuery(checkUsuarioQuery, [id_usuario]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário não encontrado'
                });
            }

            // Verifica se já existe uma adoção para este pet
            const checkAdocaoQuery = `SELECT id_adocao FROM Adocao WHERE id_pet = ?`;
            const existingAdocao = await executeQuery(checkAdocaoQuery, [id_pet]) as RowDataPacket[];

            if (existingAdocao.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Este pet já foi adotado'
                });
            }

            const query = `
                INSERT INTO Adocao (
                    id_pet,
                    id_usuario
                ) VALUES (?, ?)
            `;

            const params = [id_pet, id_usuario];

            const result = await executeQuery(query, params) as OkPacket;

            return res.status(201).json({
                status: 'success',
                message: 'Adoção criada com sucesso',
                data: {
                    id_adocao: result.insertId,
                    id_pet,
                    id_usuario
                }
            });

        } catch (error) {
            console.error('Erro ao criar adoção:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao criar adoção',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Listar todas as adoções com dados do pet e usuário
    getAllAdocoes = async (req: Request, res: Response) => {
        try {
            const query = `
                SELECT
                    A.id_adocao,
                    P.nome AS nome_pet,
                    U.nome AS nome_usuario,
                    A.id_pet,
                    A.id_usuario
                FROM
                    Adocao AS A
                JOIN
                    Pet AS P ON A.id_pet = P.id_pet
                JOIN
                    Usuario AS U ON A.id_usuario = U.id_usuario
                ORDER BY
                    A.id_adocao DESC
            `;

            const adocoes = await executeQuery(query) as RowDataPacket[];

            res.json({
                status: 'success',
                data: adocoes,
                count: adocoes.length
            });

        } catch (error) {
            console.error('Erro ao listar adoções:', error);
            res.status(500).json({
                status: 'error',
                message: 'Erro ao listar adoções',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Buscar adoção por ID
    getAdocaoById = async (req: Request, res: Response) => {
        try {
            const { id_adocao } = req.body;

            if (!id_adocao) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID da adoção é obrigatório'
                });
            }

            const query = `
                SELECT
                    A.id_adocao,
                    P.nome AS nome_pet,
                    U.nome AS nome_usuario,
                    A.id_pet,
                    A.id_usuario
                FROM
                    Adocao AS A
                JOIN
                    Pet AS P ON A.id_pet = P.id_pet
                JOIN
                    Usuario AS U ON A.id_usuario = U.id_usuario
                WHERE
                    A.id_adocao = ?
            `;

            const adocoes = await executeQuery(query, [id_adocao]) as RowDataPacket[];

            if (adocoes.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Adoção não encontrada'
                });
            }

            return res.json({
                status: 'success',
                data: adocoes[0]
            });

        } catch (error) {
            console.error('Erro ao buscar adoção:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar adoção',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar registro de adoção
    updateAdocao = async (req: Request, res: Response) => {
        try {
            const { id_adocao } = req.body;
            const {
                id_pet
            } = req.body;

            if (!id_adocao) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID da adoção é obrigatório'
                });
            }

            if (!id_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID do pet é obrigatório'
                });
            }

            // Primeiro verifica se a adoção existe
            const checkQuery = `SELECT id_adocao FROM Adocao WHERE id_adocao = ?`;
            const existingAdocao = await executeQuery(checkQuery, [id_adocao]) as RowDataPacket[];

            if (existingAdocao.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Adoção não encontrada'
                });
            }

            // Verifica se o pet existe
            const checkPetQuery = `SELECT id_pet FROM Pet WHERE id_pet = ?`;
            const existingPet = await executeQuery(checkPetQuery, [id_pet]) as RowDataPacket[];

            if (existingPet.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Pet não encontrado'
                });
            }

            // Verifica se já existe uma adoção para este pet (exceto a atual)
            const checkAdocaoPetQuery = `SELECT id_adocao FROM Adocao WHERE id_pet = ? AND id_adocao != ?`;
            const existingAdocaoPet = await executeQuery(checkAdocaoPetQuery, [id_pet, id_adocao]) as RowDataPacket[];

            if (existingAdocaoPet.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Este pet já foi adotado por outro usuário'
                });
            }

            const updateQuery = `
                UPDATE Adocao
                SET
                    id_pet = ?
                WHERE
                    id_adocao = ?
            `;

            const params = [id_pet, id_adocao];

            await executeQuery(updateQuery, params);

            // Busca a adoção atualizada
            const updatedAdocaoQuery = `
                SELECT
                    A.id_adocao,
                    P.nome AS nome_pet,
                    U.nome AS nome_usuario,
                    A.id_pet,
                    A.id_usuario
                FROM
                    Adocao AS A
                JOIN
                    Pet AS P ON A.id_pet = P.id_pet
                JOIN
                    Usuario AS U ON A.id_usuario = U.id_usuario
                WHERE
                    A.id_adocao = ?
            `;

            const updatedAdocaoResult = await executeQuery(updatedAdocaoQuery, [id_adocao]) as RowDataPacket[];

            return res.json({
                status: 'success',
                message: 'Adoção atualizada com sucesso',
                data: updatedAdocaoResult[0]
            });

        } catch (error) {
            console.error('Erro ao atualizar adoção:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar adoção',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // DELETE (D) - Excluir registro de adoção
    deleteAdocao = async (req: Request, res: Response) => {
        try {
            const { id_adocao } = req.body;

            if (!id_adocao) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID da adoção é obrigatório'
                });
            }

            // Verifica se a adoção existe
            const checkQuery = `SELECT id_adocao FROM Adocao WHERE id_adocao = ?`;
            const existingAdocaoResult = await executeQuery(checkQuery, [id_adocao]) as RowDataPacket[];

            if (existingAdocaoResult.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Adoção não encontrada'
                });
            }

            // Deleta a adoção
            await executeQuery('DELETE FROM Adocao WHERE id_adocao = ?', [id_adocao]);

            return res.json({
                status: 'success',
                message: 'Adoção excluída com sucesso',
                data: {
                    id_adocao: parseInt(id_adocao)
                }
            });

        } catch (error) {
            console.error('Erro ao excluir adoção:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir adoção',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // ==================== CRUD USUÁRIO COMUM ====================

    // CREATE (C) - Criar novo usuário comum
    createUsuarioComum = async (req: Request, res: Response) => {
        try {
            const {
                nome,
                sobrenome,
                email,
                senha,
                data_nascimento,
                telefone,
                cpf,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                complemento,
                escolaridade,
                possui_pet,
                deseja_adotar,
                deseja_contribuir
            } = req.body;

            // Validação básica
            if (!nome || !email || !senha) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome, email e senha são obrigatórios'
                });
            }

            try {
                // Insere o usuário
                const usuarioQuery = `
                    INSERT INTO Usuario (
                        tipo_usuario,
                        nome,
                        sobrenome,
                        email,
                        senha,
                        data_nascimento,
                        telefone,
                        cpf,
                        cep,
                        logradouro,
                        numero,
                        bairro,
                        cidade,
                        estado,
                        complemento,
                        escolaridade,
                        possui_pet
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const usuarioParams = [
                    'comum',
                    nome,
                    sobrenome,
                    email,
                    senha,
                    data_nascimento || null,
                    telefone,
                    cpf,
                    cep || '',
                    logradouro || '',
                    numero || '',
                    bairro || '',
                    cidade || '',
                    estado || '',
                    complemento || '',
                    escolaridade || '',
                    possui_pet || 'não'
                ];

                const usuarioResult = await executeQuery(usuarioQuery, usuarioParams) as OkPacket;
                const id_usuario = usuarioResult.insertId;

                // Insere o registro na tabela Comum
                const comumQuery = `
                    INSERT INTO Comum (
                        id_comum,
                        deseja_adotar,
                        deseja_contribuir
                    ) VALUES (?, ?, ?)
                `;

                const comumParams = [
                    id_usuario,
                    deseja_adotar || 'não',
                    deseja_contribuir || 'não'
                ];

                await executeQuery(comumQuery, comumParams);

                return res.status(201).json({
                    status: 'success',
                    message: 'Usuário comum criado com sucesso',
                    data: {
                        id_usuario,
                        nome,
                        email,
                        tipo_usuario: 'comum',
                        deseja_adotar: deseja_adotar || 'não',
                        deseja_contribuir: deseja_contribuir || 'não'
                    }
                });

            } catch (error) {
                console.error('Erro ao inserir usuário ou registro comum:', error);
                throw error;
            }

        } catch (error) {
            console.error('Erro ao criar usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao criar usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Buscar usuário comum por email
    getUsuarioComumByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            const query = `
                SELECT
                    U.id_usuario,
                    U.nome,
                    U.sobrenome,
                    U.email,
                    U.telefone,
                    U.cidade,
                    U.estado,
                    C.deseja_adotar,
                    C.deseja_contribuir
                FROM
                    Usuario AS U
                JOIN
                    Comum AS C ON U.id_usuario = C.id_comum
                WHERE
                    U.email = ?
            `;

            const usuarios = await executeQuery(query, [email]) as RowDataPacket[];

            if (usuarios.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            return res.json({
                status: 'success',
                data: usuarios[0]
            });

        } catch (error) {
            console.error('Erro ao buscar usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }



    // UPDATE (U) - Atualizar telefone do usuário comum
    updateTelefoneUsuarioComum = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { telefone } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!telefone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Telefone é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'comum'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            // Atualiza o telefone
            const updateQuery = `UPDATE Usuario SET telefone = ? WHERE email = ?`;
            await executeQuery(updateQuery, [telefone, email]);

            return res.json({
                status: 'success',
                message: 'Telefone do usuário comum atualizado com sucesso',
                data: {
                    email,
                    telefone
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar telefone do usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar telefone do usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar possui_pet do usuário comum
    updatePossuiPetUsuarioComum = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { possui_pet } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!possui_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Possui_pet é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'comum'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            // Atualiza possui_pet
            const updateQuery = `UPDATE Usuario SET possui_pet = ? WHERE email = ?`;
            await executeQuery(updateQuery, [possui_pet, email]);

            return res.json({
                status: 'success',
                message: 'Possui_pet do usuário comum atualizado com sucesso',
                data: {
                    email,
                    possui_pet
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar possui_pet do usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar possui_pet do usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar deseja_adotar do usuário comum
    updateDesejaAdotarUsuarioComum = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { deseja_adotar } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!deseja_adotar) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Deseja_adotar é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'comum'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Atualiza deseja_adotar
            const updateQuery = `UPDATE Comum SET deseja_adotar = ? WHERE id_comum = ?`;
            await executeQuery(updateQuery, [deseja_adotar, id_usuario]);

            return res.json({
                status: 'success',
                message: 'Deseja_adotar do usuário comum atualizado com sucesso',
                data: {
                    email,
                    deseja_adotar
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar deseja_adotar do usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar deseja_adotar do usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar deseja_contribuir do usuário comum
    updateDesejaContribuirUsuarioComum = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { deseja_contribuir } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!deseja_contribuir) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Deseja_contribuir é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'comum'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Atualiza deseja_contribuir
            const updateQuery = `UPDATE Comum SET deseja_contribuir = ? WHERE id_comum = ?`;
            await executeQuery(updateQuery, [deseja_contribuir, id_usuario]);

            return res.json({
                status: 'success',
                message: 'Deseja_contribuir do usuário comum atualizado com sucesso',
                data: {
                    email,
                    deseja_contribuir
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar deseja_contribuir do usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar deseja_contribuir do usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // DELETE (D) - Excluir usuário comum
    deleteUsuarioComum = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'comum'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário comum não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Inicia transação
            await executeQuery('START TRANSACTION');

            try {
                // Deleta registros relacionados em ordem
               
                await executeQuery('DELETE FROM Usuario WHERE email = ?', [email]);

                // Confirma a transação
                await executeQuery('COMMIT');

                return res.json({
                    status: 'success',
                    message: 'Usuário comum excluído com sucesso',
                    data: {
                        id_usuario,
                        email
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao excluir usuário comum:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir usuário comum',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // ==================== CRUD USUÁRIO ADMINISTRADOR ====================

    // CREATE (C) - Criar novo usuário administrador
    createUsuarioAdministrador = async (req: Request, res: Response) => {
        try {
            const {
                nome,
                sobrenome,
                email,
                senha,
                data_nascimento,
                telefone,
                cpf,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                complemento,
                escolaridade,
                possui_pet,
                funcao
            } = req.body;

            // Validação básica
            if (!nome || !sobrenome || !senha || !email || !telefone || !cpf) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome, email, senha e função são obrigatórios'
                });
            }

            // Inicia transação
            await executeQuery('START TRANSACTION');

            try {
                // Insere o usuário
                const usuarioQuery = `
                    INSERT INTO Usuario (
                        tipo_usuario,
                        nome,
                        sobrenome,
                        email,
                        senha,
                        data_nascimento,
                        telefone,
                        cpf,
                        cep,
                        logradouro,
                        numero,
                        bairro,
                        cidade,
                        estado,
                        complemento,
                        escolaridade,
                        possui_pet
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const usuarioParams = [
                    'administrador',
                    nome,
                    sobrenome,
                    email,
                    senha,
                    data_nascimento || null,
                    telefone,
                    cpf,
                    cep || '',
                    logradouro || '',
                    numero || '',
                    bairro || '',
                    cidade || '',
                    estado || '',
                    complemento || '',
                    escolaridade || '',
                    possui_pet || 'não'
                ];

                const usuarioResult = await executeQuery(usuarioQuery, usuarioParams) as OkPacket;
                const id_usuario = usuarioResult.insertId;

                // Insere o registro na tabela Administrador
                const adminQuery = `
                    INSERT INTO Administrador (
                        id_administrador,
                        funcao
                    ) VALUES (?, ?)
                `;

                const adminParams = [id_usuario, funcao || null];

                await executeQuery(adminQuery, adminParams);

                // Confirma a transação
                await executeQuery('COMMIT');

                return res.status(201).json({
                    status: 'success',
                    message: 'Usuário administrador criado com sucesso',
                    data: {
                        id_usuario,
                        nome,
                        email,
                        tipo_usuario: 'administrador',
                        funcao
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao criar usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao criar usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Buscar usuário administrador por email
    getUsuarioAdministradorByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            const query = `
                SELECT
                    U.id_usuario,
                    U.nome,
                    U.sobrenome,
                    U.email,
                    U.telefone,
                    U.possui_pet,
                    U.cidade,
                    U.estado,
                    A.funcao
                FROM
                    Usuario AS U
                JOIN
                    Administrador AS A ON U.id_usuario = A.id_administrador
                WHERE
                    U.email = ?
            `;

            const usuarios = await executeQuery(query, [email]) as RowDataPacket[];

            if (usuarios.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário administrador não encontrado'
                });
            }

            return res.json({
                status: 'success',
                data: usuarios[0]
            });

        } catch (error) {
            console.error('Erro ao buscar usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }


    // UPDATE (U) - Atualizar telefone do usuário administrador
    updateTelefoneUsuarioAdministrador = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { telefone } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!telefone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Telefone é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'administrador'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário administrador não encontrado'
                });
            }

            // Atualiza o telefone
            const updateQuery = `UPDATE Usuario SET telefone = ? WHERE email = ?`;
            await executeQuery(updateQuery, [telefone, email]);

            return res.json({
                status: 'success',
                message: 'Telefone do usuário administrador atualizado com sucesso',
                data: {
                    email,
                    telefone
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar telefone do usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar telefone do usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar possui_pet do usuário administrador
    updatePossuiPetUsuarioAdministrador = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { possui_pet } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!possui_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Possui_pet é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'administrador'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário administrador não encontrado'
                });
            }

            // Atualiza possui_pet
            const updateQuery = `UPDATE Usuario SET possui_pet = ? WHERE email = ?`;
            await executeQuery(updateQuery, [possui_pet, email]);

            return res.json({
                status: 'success',
                message: 'Possui_pet do usuário administrador atualizado com sucesso',
                data: {
                    email,
                    possui_pet
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar possui_pet do usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar possui_pet do usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar funcao do usuário administrador
    updateFuncaoUsuarioAdministrador = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const { funcao } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!funcao) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Funcao é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'administrador'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário administrador não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Atualiza funcao
            const updateQuery = `UPDATE Administrador SET funcao = ? WHERE id_administrador = ?`;
            await executeQuery(updateQuery, [funcao, id_usuario]);

            return res.json({
                status: 'success',
                message: 'Funcao do usuário administrador atualizado com sucesso',
                data: {
                    email,
                    funcao
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar funcao do usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar funcao do usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // DELETE (D) - Excluir usuário administrador
    deleteUsuarioAdministrador = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'administrador'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário administrador não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Inicia transação
            await executeQuery('START TRANSACTION');

            try {
                // Deleta registros relacionados em ordem
                
                
                await executeQuery('DELETE FROM Usuario WHERE email = ?', [email]);

                // Confirma a transação
                await executeQuery('COMMIT');

                return res.json({
                    status: 'success',
                    message: 'Usuário administrador excluído com sucesso',
                    data: {
                        id_usuario,
                        email
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao excluir usuário administrador:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir usuário administrador',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // ==================== CRUD USUÁRIO VOLUNTÁRIO ====================

    // CREATE (C) - Criar novo usuário voluntário
    createUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const {
                nome,
                sobrenome,
                email,
                senha,
                data_nascimento,
                telefone,
                cpf,
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                complemento,
                escolaridade,
                possui_pet,
                funcao,
                habilidade
            } = req.body;

            // Validação básica
            if (!nome || !sobrenome || !senha || !email || !telefone || !cpf) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Nome, email, senha e função são obrigatórios'
                });
            }

            // Inicia transação
            await executeQuery('START TRANSACTION');

            try {
                // Insere o usuário
                const usuarioQuery = `
                    INSERT INTO Usuario (
                        tipo_usuario,
                        nome,
                        sobrenome,
                        email,
                        senha,
                        data_nascimento,
                        telefone,
                        cpf,
                        cep,
                        logradouro,
                        numero,
                        bairro,
                        cidade,
                        estado,
                        complemento,
                        escolaridade,
                        possui_pet
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                const usuarioParams = [
                    'voluntário',
                    nome,
                    sobrenome,
                    email,
                    senha,
                    data_nascimento || null,
                    telefone,
                    cpf,
                    cep || '',
                    logradouro || '',
                    numero || '',
                    bairro || '',
                    cidade || '',
                    estado || '',
                    complemento || '',
                    escolaridade || '',
                    possui_pet || 'não'
                ];

                const usuarioResult = await executeQuery(usuarioQuery, usuarioParams) as OkPacket;
                const id_usuario = usuarioResult.insertId;

                // Insere o registro na tabela Voluntario
                const voluntarioQuery = `
                    INSERT INTO Voluntario (
                        id_voluntario,
                        funcao
                    ) VALUES (?, ?)
                `;

                const voluntarioParams = [id_usuario, funcao || null];

                await executeQuery(voluntarioQuery, voluntarioParams);

                const habilidadeQuery = `
                    INSERT INTO Habilidade (
                        id_voluntario,
                        habilidade
                    ) VALUES (?, ?)
                `;

                const habilidadeParams = [id_usuario, habilidade || null];

                await executeQuery(habilidadeQuery, habilidadeParams);

                // Confirma a transação
                await executeQuery('COMMIT');

                return res.status(201).json({
                    status: 'success',
                    message: 'Usuário voluntário criado com sucesso',
                    data: {
                        id_usuario,
                        nome,
                        email,
                        tipo_usuario: 'voluntário',
                        funcao
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao criar usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao criar usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // READ (R) - Buscar usuário voluntário por email
    getUsuarioVoluntarioByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            const query = `
                SELECT
                    U.id_usuario,
                    U.nome,
                    U.sobrenome,
                    U.email,
                    U.telefone,
                    U.possui_pet,
                    U.cidade,
                    U.estado,
                    V.funcao
                FROM
                    Usuario AS U
                JOIN
                    Voluntario AS V ON U.id_usuario = V.id_voluntario
                WHERE
                    U.email = ?
            `;

            const usuarios = await executeQuery(query, [email]) as RowDataPacket[];

            if (usuarios.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário voluntário não encontrado'
                });
            }

            return res.json({
                status: 'success',
                data: usuarios[0]
            });

        } catch (error) {
            console.error('Erro ao buscar usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao buscar usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar telefone do usuário voluntário
    updateTelefoneUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const { telefone } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!telefone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Telefone é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário voluntário não encontrado'
                });
            }

            // Atualiza o telefone
            const updateQuery = `UPDATE Usuario SET telefone = ? WHERE email = ?`;
            await executeQuery(updateQuery, [telefone, email]);

            return res.json({
                status: 'success',
                message: 'Telefone do usuário voluntário atualizado com sucesso',
                data: {
                    email,
                    telefone
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar telefone do usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar telefone do usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar possui_pet do usuário voluntário
    updatePossuiPetUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const { possui_pet } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!possui_pet) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Possui_pet é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário voluntário não encontrado'
                });
            }

            // Atualiza possui_pet
            const updateQuery = `UPDATE Usuario SET possui_pet = ? WHERE email = ?`;
            await executeQuery(updateQuery, [possui_pet, email]);

            return res.json({
                status: 'success',
                message: 'Possui_pet do usuário voluntário atualizado com sucesso',
                data: {
                    email,
                    possui_pet
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar possui_pet do usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar possui_pet do usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // UPDATE (U) - Atualizar funcao do usuário voluntário
    updateFuncaoUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const { funcao } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            if (!funcao) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Funcao é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário voluntário não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Atualiza funcao
            const updateQuery = `UPDATE Voluntario SET funcao = ? WHERE id_voluntario = ?`;
            await executeQuery(updateQuery, [funcao, id_usuario]);

            return res.json({
                status: 'success',
                message: 'Funcao do usuário voluntário atualizado com sucesso',
                data: {
                    email,
                    funcao
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar funcao do usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao atualizar funcao do usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }

    // DELETE (D) - Excluir usuário voluntário
    deleteUsuarioVoluntario = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;

            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email é obrigatório'
                });
            }

            // Verifica se o usuário existe
            const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
            const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

            if (existingUsuario.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuário voluntário não encontrado'
                });
            }

            const id_usuario = existingUsuario[0].id_usuario;

            // Inicia transação
            await executeQuery('START TRANSACTION');

            try {
                // Deleta registros relacionados em ordem
               
                await executeQuery('DELETE FROM Usuario WHERE email = ?', [email]);

                // Confirma a transação
                await executeQuery('COMMIT');

                return res.json({
                    status: 'success',
                    message: 'Usuário voluntário excluído com sucesso',
                    data: {
                        id_usuario,
                        email
                    }
                });

            } catch (error) {
                // Em caso de erro, faz rollback
                await executeQuery('ROLLBACK');
                throw error;
            }

        } catch (error) {
            console.error('Erro ao excluir usuário voluntário:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao excluir usuário voluntário',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
}

// Correções nas rotas de voluntário - adicionar ao rotasOng.ts

// READ (R) - Buscar usuário voluntário por email - CORRIGIDO
// getUsuarioVoluntarioByEmail = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body; // Mudança: pegar do body ao invés de params

//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Email é obrigatório'
//             });
//         }

//         const query = `
//             SELECT
//                 U.id_usuario,
//                 U.nome,
//                 U.sobrenome,
//                 U.email,
//                 U.telefone,
//                 U.possui_pet,
//                 U.cidade,
//                 U.estado,
//                 V.funcao
//             FROM
//                 Usuario AS U
//             JOIN
//                 Voluntario AS V ON U.id_usuario = V.id_voluntario
//             WHERE
//                 U.email = ?
//         `;

//         const usuarios = await executeQuery(query, [email]) as RowDataPacket[];

//         if (usuarios.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Usuário voluntário não encontrado'
//             });
//         }

//         return res.json({
//             status: 'success',
//             data: usuarios[0]
//         });

//     } catch (error) {
//         console.error('Erro ao buscar usuário voluntário:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Erro ao buscar usuário voluntário',
//             error: error instanceof Error ? error.message : 'Erro desconhecido'
//         });
//     }
// }

// // UPDATE (U) - Atualizar telefone do usuário voluntário - CORRIGIDO
// updateTelefoneUsuarioVoluntario = async (req: Request, res: Response) => {
//     try {
//         const { email, telefone } = req.body; // Mudança: pegar do body ao invés de params

//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Email é obrigatório'
//             });
//         }

//         if (!telefone) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Telefone é obrigatório'
//             });
//         }

//         // Verifica se o usuário existe
//         const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
//         const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

//         if (existingUsuario.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Usuário voluntário não encontrado'
//             });
//         }

//         // Atualiza o telefone
//         const updateQuery = `UPDATE Usuario SET telefone = ? WHERE email = ?`;
//         await executeQuery(updateQuery, [telefone, email]);

//         return res.json({
//             status: 'success',
//             message: 'Telefone do usuário voluntário atualizado com sucesso',
//             data: {
//                 email,
//                 telefone
//             }
//         });

//     } catch (error) {
//         console.error('Erro ao atualizar telefone do usuário voluntário:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Erro ao atualizar telefone do usuário voluntário',
//             error: error instanceof Error ? error.message : 'Erro desconhecido'
//         });
//     }
// }

// // UPDATE (U) - Atualizar possui_pet do usuário voluntário - CORRIGIDO
// updatePossuiPetUsuarioVoluntario = async (req: Request, res: Response) => {
//     try {
//         const { email, possui_pet } = req.body; // Mudança: pegar do body ao invés de params

//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Email é obrigatório'
//             });
//         }

//         if (!possui_pet) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Possui_pet é obrigatório'
//             });
//         }

//         // Verifica se o usuário existe
//         const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
//         const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

//         if (existingUsuario.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Usuário voluntário não encontrado'
//             });
//         }

//         // Atualiza possui_pet
//         const updateQuery = `UPDATE Usuario SET possui_pet = ? WHERE email = ?`;
//         await executeQuery(updateQuery, [possui_pet, email]);

//         return res.json({
//             status: 'success',
//             message: 'Possui_pet do usuário voluntário atualizado com sucesso',
//             data: {
//                 email,
//                 possui_pet
//             }
//         });

//     } catch (error) {
//         console.error('Erro ao atualizar possui_pet do usuário voluntário:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Erro ao atualizar possui_pet do usuário voluntário',
//             error: error instanceof Error ? error.message : 'Erro desconhecido'
//         });
//     }
// }

// // UPDATE (U) - Atualizar funcao do usuário voluntário - CORRIGIDO
// updateFuncaoUsuarioVoluntario = async (req: Request, res: Response) => {
//     try {
//         const { email, funcao } = req.body; // Mudança: pegar do body ao invés de params

//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Email é obrigatório'
//             });
//         }

//         if (!funcao) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Funcao é obrigatório'
//             });
//         }

//         // Verifica se o usuário existe
//         const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
//         const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

//         if (existingUsuario.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Usuário voluntário não encontrado'
//             });
//         }

//         const id_usuario = existingUsuario[0].id_usuario;

//         // Atualiza funcao
//         const updateQuery = `UPDATE Voluntario SET funcao = ? WHERE id_voluntario = ?`;
//         await executeQuery(updateQuery, [funcao, id_usuario]);

//         return res.json({
//             status: 'success',
//             message: 'Funcao do usuário voluntário atualizado com sucesso',
//             data: {
//                 email,
//                 funcao
//             }
//         });

//     } catch (error) {
//         console.error('Erro ao atualizar funcao do usuário voluntário:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Erro ao atualizar funcao do usuário voluntário',
//             error: error instanceof Error ? error.message : 'Erro desconhecido'
//         });
//     }
// }

// // DELETE (D) - Excluir usuário voluntário - CORRIGIDO
// deleteUsuarioVoluntario = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body; // Mudança: pegar do body ao invés de params

//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Email é obrigatório'
//             });
//         }

//         // Verifica se o usuário existe
//         const checkQuery = `SELECT id_usuario FROM Usuario WHERE email = ? AND tipo_usuario = 'voluntário'`;
//         const existingUsuario = await executeQuery(checkQuery, [email]) as RowDataPacket[];

//         if (existingUsuario.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Usuário voluntário não encontrado'
//             });
//         }

//         const id_usuario = existingUsuario[0].id_usuario;

//         // Inicia transação
//         await executeQuery('START TRANSACTION');

//         try {
//             // Deleta registros relacionados em ordem
//             await executeQuery('DELETE FROM Usuario WHERE email = ?', [email]);

//             // Confirma a transação
//             await executeQuery('COMMIT');

//             return res.json({
//                 status: 'success',
//                 message: 'Usuário voluntário excluído com sucesso',
//                 data: {
//                     id_usuario,
//                     email
//                 }
//             });

//         } catch (error) {
//             // Em caso de erro, faz rollback
//             await executeQuery('ROLLBACK');
//             throw error;
//         }

//     } catch (error) {
//         console.error('Erro ao excluir usuário voluntário:', error);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Erro ao excluir usuário voluntário',
//             error: error instanceof Error ? error.message : 'Erro desconhecido'
//         });
//     }
// }