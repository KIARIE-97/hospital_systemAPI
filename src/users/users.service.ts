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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
