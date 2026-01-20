import { DaoMaster } from "src/database/dao-master";
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";

type Task = {
    id: string
    id_user: string
    data: Date
    titulo: string
    descricao?: string
    prioridade: string
    concluida: boolean
}

type CreateTaskDto = {
    id_user: string
    data: Date
    titulo: string
    descricao?: string
    prioridade: number
}

type UpdateTaskDto = {
    data?: Date
    titulo?: string
    descricao?: string
    prioridade?: number
    concluida?: boolean
}

@Injectable()
export class TaskService {
    private dao = new DaoMaster()

    async createTask(data: CreateTaskDto) {
        try {
            if (!data.id_user || !data.titulo) {
                throw new BadRequestException('ID do usuário e título são obrigatórios');
            }

            const novaTask = await this.dao.insert('tasks', {
                id_user: data.id_user,
                data: data.data || new Date(),
                titulo: data.titulo,
                descricao: data.descricao || null,
                prioridade: data.prioridade.toString(),
            });

            return novaTask;

        } catch (error) {
            console.log(error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Erro ao criar task');
        }
    }

    async getTaskById(id: string) {
        try {
            const tasks = await this.dao.select<Task>('tasks', { id });
            
            if (!tasks || tasks.length === 0) {
                throw new NotFoundException('Task não encontrada');
            }

            return tasks[0];

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Erro ao buscar task');
        }
    }

    async getTasksByUser(id_user: string) {
        try {
            const tasks = await this.dao.select<Task>('tasks', { id_user });
            
            return tasks || [];

        } catch (error) {
            console.log(error);
            throw new BadRequestException('Erro ao buscar tasks do usuário');
        }
    }

    async getAllTasks() {
        try {
            const tasks = await this.dao.select<Task>('tasks');
            
            return tasks || [];

        } catch (error) {
            console.log(error);
            throw new BadRequestException('Erro ao buscar todas as tasks');
        }
    }

    async updateTask(id: string, data: UpdateTaskDto) {
        try {
            // Verifica se a task existe
            const tasks = await this.dao.select<Task>('tasks', { id });
            
            if (!tasks || tasks.length === 0) {
                throw new NotFoundException('Task não encontrada');
            }

            // Prepara os dados para atualização
            const updateData: any = {};

            if (data.data !== undefined) {
                updateData.data = data.data;
            }

            if (data.titulo !== undefined) {
                updateData.titulo = data.titulo;
            }

            if (data.descricao !== undefined) {
                updateData.descricao = data.descricao;
            }

            if (data.prioridade !== undefined) {
                updateData.prioridade = data.prioridade.toString();
            }

            if (data.concluida !== undefined) {
                updateData.concluida = data.concluida;
            }

            // Se não há nada para atualizar
            if (Object.keys(updateData).length === 0) {
                throw new BadRequestException('Nenhum dado para atualizar');
            }

            const taskAtualizada = await this.dao.update('tasks', updateData, { id });

            return taskAtualizada;

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Erro ao atualizar task');
        }
    }

    async deleteTask(id: string) {
        try {
            // Verifica se a task existe
            const tasks = await this.dao.select<Task>('tasks', { id });
            
            if (!tasks || tasks.length === 0) {
                throw new NotFoundException('Task não encontrada');
            }

            await this.dao.delete('tasks', { id });

            return { message: 'Task deletada com sucesso' };

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Erro ao deletar task');
        }
    }

    async toggleTaskComplete(id: string) {
        try {
            // Busca a task atual
            const tasks = await this.dao.select<Task>('tasks', { id });
            
            if (!tasks || tasks.length === 0) {
                throw new NotFoundException('Task não encontrada');
            }

            const task = tasks[0];

            // Inverte o status de concluída
            const taskAtualizada = await this.dao.update('tasks', 
                { concluida: !task.concluida }, 
                { id }
            );

            return taskAtualizada;

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Erro ao alterar status da task');
        }
    }
}