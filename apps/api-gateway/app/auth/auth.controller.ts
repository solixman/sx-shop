import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface AuthResponse {
  accessToken: string;
  userId: string;
}


@Controller('auth')
export class AuthController {
  
constructor(@Inject("AUTH-SERVICE") private readonly authClient:ClientProxy){}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
      const email = body.email;
      const password = body.password;
      return await firstValueFrom(this.authClient.send<AuthResponse>('auth-login',{email,password}))
      
      
    }
    
    
    @Post('register')
    async register(@Body() body:{name:string,email:string,password:string}){
      
      const email = body.email;
      const name = body.name;
      const password = body.password;
     return firstValueFrom(this.authClient.send<AuthResponse>("auth-register",{name,email,password}))

   }
}
