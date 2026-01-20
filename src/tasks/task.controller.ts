import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Delete, Param, UseGuards, Patch } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto, UpdateTaskDto } from "./class-validator";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
    constructor(
        private readonly taskService: TaskService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Criar Task' })
    @ApiResponse({ status: 201, description: 'Task criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Body() body: CreateTaskDto) {
        return this.taskService.createTask(body);
    }

    @Get()
    @ApiOperation({ summary: 'Buscar todas as tasks' })
    @ApiResponse({ status: 200, description: 'Tasks encontradas' })
    async getAllTasks() {
        return this.taskService.getAllTasks();
    }

    @Get('user/:id_user')
    @ApiOperation({ summary: 'Buscar tasks por usuário' })
    @ApiResponse({ status: 200, description: 'Tasks do usuário encontradas' })
    async getTasksByUser(@Param('id_user') id_user: string) {
        return this.taskService.getTasksByUser(id_user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar task por ID' })
    @ApiResponse({ status: 200, description: 'Task encontrada' })
    @ApiResponse({ status: 404, description: 'Task não encontrada' })
    async getTaskById(@Param('id') id: string) {
        return this.taskService.getTaskById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar task' })
    @ApiResponse({ status: 200, description: 'Task atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Task não encontrada' })
    async updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto) {
        return this.taskService.updateTask(id, body);
    }

    @Patch(':id/toggle')
    @ApiOperation({ summary: 'Alternar status de conclusão da task' })
    @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
    @ApiResponse({ status: 404, description: 'Task não encontrada' })
    async toggleComplete(@Param('id') id: string) {
        return this.taskService.toggleTaskComplete(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deletar task' })
    @ApiResponse({ status: 204, description: 'Task deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'Task não encontrada' })
    async deleteTask(@Param('id') id: string) {
        return this.taskService.deleteTask(id);
    }
}