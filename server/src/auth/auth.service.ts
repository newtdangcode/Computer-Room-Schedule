import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { promises } from 'dns';
import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmployeeService } from 'src/employee/employee.service';
import { UpdateAccountDto } from './dto/update-account.dto';
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => EmployeeService)) private employeeService:EmployeeService,
        @InjectRepository(Account) private accountRepository:Repository<Account>,
        @InjectRepository(Employee) private employeeRepository:Repository<Employee>,
        private jwtService:JwtService,
        private configService:ConfigService,
    ){}

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bycrypt.genSalt(saltRound);
        const hash = await bycrypt.hash(password, salt);
        return hash;
    }

    private async generateToken(payload:{id:number, username:string}) {
        const access_token = await this.jwtService.signAsync(payload, {
            //expiresIn: process.env.EXP_IN_ACCESS_TOKEN,
            expiresIn: '1h',
        });
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret:process.env.SECRET,
            //expiresIn: process.env.EXP_IN_REFRESH_TOKEN,
            expiresIn: '1d',
        });
        await this.accountRepository.update(
            {username: payload.username},
            {refresh_token: refresh_token}
        )
        return {access_token};
    }
    async refreshToken(refresh_token: string){
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token,{
                secret:process.env.SECRET,
            })
            console.log(verify);
            const checkExistToken = await this.accountRepository.findOneBy({
                username: verify.username, 
                refresh_token
            });
            
            if(checkExistToken) {
                const payload = {
                    id: verify.id,
                    username: verify.username,
                };
                return this.generateToken(payload);
            } else {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            }
        }catch(error){
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
            
        }
    }

    async employeeRegister(registerEmployeeDto:RegisterEmployeeDto) {
        try{
            const hashPassword = await this.hashPassword(registerEmployeeDto.password);
            const account = {
                username: registerEmployeeDto.username,
                password: hashPassword,
                refresh_token: null,
                email: registerEmployeeDto.email,
                role_id: {id: registerEmployeeDto.role_id}
            };

            const checkExistUsername = await this.accountRepository.findOneBy({
                username: account.username,
            });
            const checkExistEmail = await this.accountRepository.findOneBy({
                email: account.email,
            });
            const checkExistCode = await this.employeeRepository.findOneBy({
                code: registerEmployeeDto.code,
            });

            if(checkExistUsername) {
                throw new HttpException('Username đã tồn tại', HttpStatus.BAD_REQUEST);
            } else if(checkExistEmail) {
                throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
            } else if(checkExistCode) {
                throw new HttpException('Mã nhân viên đã tồn tại', HttpStatus.BAD_REQUEST);
            } else {
                const accountCreated = await this.accountRepository.save(account);
                const user = {
                    code: registerEmployeeDto.code,
                    first_name: registerEmployeeDto.first_name,
                    last_name: registerEmployeeDto.last_name,
                    phone_number: registerEmployeeDto.phone_number,
                    account_id: {id: accountCreated.id}
                };
                const userCreated = await this.employeeRepository.save(user);
                const data = {...accountCreated,...userCreated};
                return data;
            }
        } catch(error) {
            throw new HttpException(error.message, error.status);
        }
        
        
    }

    async employeeLogin(loginEmployeeDto:LoginEmployeeDto) {
        
        const account = await this.accountRepository.findOne(
            {
                where:{username:loginEmployeeDto.username}
            }
        )
        if(!account) {
            throw new HttpException("Username is not exist!", HttpStatus.UNAUTHORIZED);
        }
        const checkPass = bycrypt.compareSync(loginEmployeeDto.password, account.password);
        if(!checkPass) {
            throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED);
        }

        const payload = {
            id: account.id,
            username: account.username,
        };
        const generateTokenData = await this.generateToken(payload);
        const employee = await this.employeeService.getOneByUsername(account.username);
        return {...employee,...generateTokenData};
    
    }
    async employeeCheckLogin(access_token: string) {
        
        if (!access_token) {
            throw new UnauthorizedException("Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập");
        }

        try {
            const decoded = this.jwtService.verify(access_token);
            const account = await this.getOneAccountById(decoded.id);
            
            return await this.employeeService.getOneByUsername(account.username);
        } catch (error) {
            throw new UnauthorizedException("Invalid access token");
        }
    }

    

    async getOneAccountById(id:number) {
        return await this.accountRepository.findOne({
            where: {id},
            relations: ['role_id']
        });
    }
    async accountUpdate(updateAccountDto:UpdateAccountDto, id:number) {
        try {
            const account = await this.getOneAccountById(id)
            if(account){
                if(updateAccountDto.password) {
                    updateAccountDto.password = await this.hashPassword(updateAccountDto.password);
                }

                let checkExistUsername = null;
                if(updateAccountDto.username) {
                    checkExistUsername = await this.accountRepository.findOneBy({
                        username: updateAccountDto.username,
                    });
                }
                let checkExistEmail = null;
                if(updateAccountDto.email) {
                    checkExistEmail = await this.accountRepository.findOneBy({
                        email: updateAccountDto.email,
                    });
                    
                }
                
                
                if(checkExistUsername&&checkExistUsername.id!==account.id) {
                    throw new HttpException('Username đã tồn tại', HttpStatus.BAD_REQUEST);
                } else if(checkExistEmail&&checkExistEmail.id!==account.id) {
                    throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
                } else {
                    const is_active = updateAccountDto.acc_is_active;
                    delete updateAccountDto.acc_is_active;
                    let updateDto = {};
                    if(is_active!==undefined) {
                        updateDto = {...updateAccountDto, is_active};
                    }else{
                        updateDto = updateAccountDto;
                    }
                    await this.accountRepository.update(id, updateDto);

                }

            } else {
                throw new HttpException('Id of account is not exist',HttpStatus.BAD_REQUEST);
            }
        }catch(error){
            throw new HttpException(error.message, error.status);
        }
        

    }

    
   
    
}
