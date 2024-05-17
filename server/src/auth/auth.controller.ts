import { Controller, Post, Get, Body, UsePipes, ValidationPipe, UseGuards, Res, UnauthorizedException, Header, Headers } from '@nestjs/common';
import { RegisterEmployeeDto } from '../dto/register-employee.dto';
import { LoginEmployeeDto } from '../dto/login-employee.dto';
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

    @Post('employee/login')
    @UsePipes(ValidationPipe)
    async employeeLogin(@Body() loginEmployeeDto: LoginEmployeeDto) {
        console.log('employee login api...');
        const loggedInEmployee = await this.authService.employeeLogin(loginEmployeeDto);
        return { message: 'Employee logged in successfully', data: loggedInEmployee };
    }
    

    @Get('employee/check-login')
    @UsePipes(ValidationPipe)
    async checkLogin(@Headers('authorization') authorizationHeader: string) {
        console.log(authorizationHeader);
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
        const checkLoggegEmployee = await this.authService.employeeCheckLogin(access_token);
        console.log('check login api...');
        return { message: 'Employee is logged in', data: checkLoggegEmployee };
    }
    

   
}
