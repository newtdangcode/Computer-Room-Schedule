import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards, Res, UnauthorizedException, Header, Headers } from '@nestjs/common';
import { RegisterEmployeeDto } from '../dto/account/register-employee.dto';
import { LoginDto } from '../dto/account/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { access } from 'fs';

@Controller('api/v1/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
       
    ){}

    @Post('refresh-token')
    async refreshToken(@Body() {refresh_token}) {
        console.log('refresh token...');
        const refreshedToken = await this.authService.refreshToken(refresh_token);
        return { message: 'Employee refreshed token successfully', data: refreshedToken};
    }

    @UseGuards(AuthGuard)
    @Post('register-employee')
    @UsePipes(ValidationPipe)
    async employeeRegister(@Body() registerEmployeeDto: RegisterEmployeeDto) {
        console.log('employee resgiter api...');
        const registeredEmployee = await this.authService.employeeRegister(registerEmployeeDto);
        return { message: 'Employee registered successfully', data: registeredEmployee };
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() LoginDto: LoginDto) {
        console.log('user login api...');
        const loggedUser = await this.authService.login(LoginDto);
        return { message: 'User logged in successfully', data: loggedUser };
    }
    
    @Get('check-login')
    @UsePipes(ValidationPipe)
    async checkLogin(@Headers('authorization') authorizationHeader: string) {
        
        // Kiểm tra xem header Authorization có tồn tại không
        if (!authorizationHeader) {
            // Nếu không có, trả về lỗi hoặc thực hiện xử lý phù hợp
            throw new UnauthorizedException('Missing access token');
        }

        const splitHeader = authorizationHeader.split(' ');
        if (splitHeader.length < 2) {
            throw new UnauthorizedException('Invalid access token format');
        }
        const access_token = splitHeader[1];
        const checkLogged = await this.authService.CheckLogin(access_token);
        console.log('check login api...');
        return { message: 'User is logged in', data: checkLogged };
    }
    

   
}
