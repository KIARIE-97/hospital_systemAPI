import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { AppMailerService } from 'src/mailer/mailer.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly appMailerService: AppMailerService,
  ) {}
  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(data, salt);
  }
  private excludePassword(user: User): Partial<User> {
    const { password, hashedRefreshToken, ...rest } = user;
    return rest;
  }

  async findAll(): Promise<Partial<User>[]> {
    let users: User[];
    users = await this.userRepository.find();

    return users.map((user) => this.excludePassword(user));
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      select: ['id'],
    });
    if (existingUser) {
      throw new Error(`User with email ${createUserDto.email} already exists`);
    }
    const newUser: Partial<User> = {
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: await this.hashData(createUserDto.password),
      phone_number: createUserDto.phone_number,
      role: createUserDto.role,
      status: createUserDto.status,
    };
    const savedUser = await this.userRepository.save(newUser);
  
    return this.excludePassword(savedUser);
  }

  async remove(id: number): Promise<string> {
    return await this.userRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No user found with id ${id}`;
        }
        return `user with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing user:', error);
        throw new Error(`Failed to remove user with id ${id}`);
      });
  }

  findOne(id: number): Promise<User | string> {
    return this.userRepository
      .findOneBy({ id })
      .then((profile) => {
        if (!profile) {
          return `No profile found with id ${id}`;
        }
        return profile;
      })
      .catch((error) => {
        console.error('Error finding profile:', error);
        throw new Error(`Failed to find profile with id ${id}`);
      });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    await this.userRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  // Reset password for a user
  async resetPassword(user_id: number, newPassword: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }
    user.password = await this.hashData(newPassword);
    await this.userRepository.save(user);
    // Send notification email
    try {
      await this.appMailerService.sendPassresetMail(
        user.email,
        user.first_name,
      );
    } catch (err) {
      console.error('Error sending email:', err);
    }
    console.log(
      `Password reset for user with id ${user_id} and email ${user.email}`,
    );
    return 'Password reset successfully';
  }
}
