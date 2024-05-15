import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Account } from 'src/entities/account.entity';
import { Employee } from 'src/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account,Employee]),
    JwtModule.register({
      global: true,
      secret:'123456',
      signOptions:{expiresIn:'1h'}
    }),
    ConfigModule,
    forwardRef(() => EmployeeModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
