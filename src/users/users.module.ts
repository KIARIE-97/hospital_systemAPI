import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AppMailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard, AppMailerService],
})
export class UsersModule {}
