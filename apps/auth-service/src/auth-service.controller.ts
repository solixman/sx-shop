import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth-service.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth-register')
  async register(@Payload() data: Record<string, unknown>) {
    const dto = plainToInstance(RegisterDto, data);
    await validateOrReject(dto);
    console.log("here");
    return this.authService.register(dto);
  }

  @MessagePattern('auth-login')
  async login(@Payload() data: Record<string, unknown>) {
    const dto = plainToInstance(LoginDto, data);
    await validateOrReject(dto);
    return this.authService.login(dto);
  }
}
