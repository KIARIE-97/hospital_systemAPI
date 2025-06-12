import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('seed endpoint called');
    return this.seedService.seed();
  }
}
