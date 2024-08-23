import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity'; // Asegúrate de importar la entidad User si la estás usando

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; username: string },
  ) {
    // Registro de un nuevo usuario
    return this.authService.register(body.email, body.password, body.username);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // Validación del usuario y generación del token JWT
    const user = await this.authService.validateUser(body.email, body.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    // Obtener todos los usuarios
    return this.authService.findAllUsers();
  }
}
