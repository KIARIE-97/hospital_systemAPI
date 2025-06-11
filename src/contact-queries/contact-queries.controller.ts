import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContactQueriesService } from './contact-queries.service';
import { CreateContactQueryDto } from './dto/create-contact-query.dto';
import { UpdateContactQueryDto } from './dto/update-contact-query.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/action.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('contact-queries')
@ApiBearerAuth('access-token')
@Controller('contact-queries')
export class ContactQueriesController {
  constructor(private readonly contactQueriesService: ContactQueriesService) {}
  @Public()
  @Post()
  create(@Body() createContactQueryDto: CreateContactQueryDto) {
    return this.contactQueriesService.create(createContactQueryDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get()
  findAll() {
    return this.contactQueriesService.findAll();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.contactQueriesService.search(query);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactQueriesService.findOne(Number(id));
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, 'Contactquery'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactQueryDto: UpdateContactQueryDto,
  ) {
    return this.contactQueriesService.update(id, updateContactQueryDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Contactquery'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactQueriesService.remove(id);
  }
}
