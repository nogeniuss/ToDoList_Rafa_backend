import { DaoMaster } from "src/database/dao-master";
import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

type User = {
    id: string
    email: string
    senha: string
}

type UpdateUserDto = {
    email?: string
    password?: string
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) {
    }
    private dao = new DaoMaster()


    async login(email: string, password: string) {
        try {
            if (!email || !password) {
                throw new UnauthorizedException('Email e senha são obrigatórios');
            }

            const users = await this.dao.select<User>('usuarios', { email });

            if (!users || users.length === 0) {
                throw new UnauthorizedException('Credenciais inválidas');
            }

            const user = users[0];

            const isValid = await bcrypt.compare(password, user.senha);

            if (!isValid) {
                throw new UnauthorizedException('Credenciais inválidas');
            }

            const payload = {
                sub: user.id,
                email: user.email
            };

            return {
                access_token: this.jwtService.sign(payload),
                user_id: user?.id,
                user_email: user?.email
            };

        } catch (error) {
            console.log(error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Erro ao fazer login');
        }
    }

    async register(email: string, password: string) {
        try {
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            const senhaCriptografada = await this.criptografarPassword(password);

            const novoUser = await this.dao.insert('usuarios', {
                email,
                senha: senhaCriptografada
            });

            // Não retorna a senha
            const { senha, ...userSemSenha } = novoUser;
            return userSemSenha;

        } catch (error) {
            console.log(error);
            throw new Error('Erro ao registrar usuário');
        }
    }

    async getUserById(id: string) {
        try {
            const users = await this.dao.select<User>('usuarios', { id });

            if (!users || users.length === 0) {
                throw new NotFoundException('Usuário não encontrado');
            }

            const user = users[0];

            // Não retorna a senha
            const { senha, ...userSemSenha } = user;
            return userSemSenha;

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Erro ao buscar usuário');
        }
    }

    async updateUser(id: string, data: UpdateUserDto) {
        try {
            // Verifica se o usuário existe
            const users = await this.dao.select<User>('usuarios', { id });

            if (!users || users.length === 0) {
                throw new NotFoundException('Usuário não encontrado');
            }

            // Prepara os dados para atualização
            const updateData: any = {};

            if (data.email) {
                updateData.email = data.email;
            }

            if (data.password) {
                updateData.senha = await this.criptografarPassword(data.password);
            }

            // Se não há nada para atualizar
            if (Object.keys(updateData).length === 0) {
                throw new Error('Nenhum dado para atualizar');
            }

            const userAtualizado = await this.dao.update('usuarios', updateData, { id });

            // Não retorna a senha
            const { senha, ...userSemSenha } = userAtualizado;
            return userSemSenha;

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async deleteUser(id: string) {
        try {
            // Verifica se o usuário existe
            const users = await this.dao.select<User>('usuarios', { id });

            if (!users || users.length === 0) {
                throw new NotFoundException('Usuário não encontrado');
            }

            await this.dao.delete('usuarios', { id });

            return { message: 'Usuário deletado com sucesso' };

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('Erro ao deletar usuário');
        }
    }


    private async criptografarPassword(password: string) {
        try {
            if (!password) {
                throw new Error('Senha é obrigatória');
            }

            return await bcrypt.hash(password, 12);

        } catch (error) {
            throw new Error('Falha ao criptografar senha');
        }
    }
}