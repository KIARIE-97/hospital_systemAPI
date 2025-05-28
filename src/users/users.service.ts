import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository
      .save(createUserDto)
      .then((user) => {
        return user;
      })
      .catch((error) => {
        console.error('Error creating profile:', error);
        throw new Error('Profile creation failed');
      });
  }

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const newUser = this.patientRepository.create({
  //     first_name: createUserDto.first_name,
  //     last_name: createUserDto.last_name,
  //     email: createUserDto.email,
  //     password: createUserDto.password,
  //     phone_number: createUserDto.phone_number,
  //     role: createUserDto.role,
  //     status: createUserDto.status
  //   });

  //   return this.patientRepository.save(newUser);
  // }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
