import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ContactQueriesService } from './contact-queries.service';
import { CreateContactQueryDto } from './dto/create-contact-query.dto';
import { UpdateContactQueryDto } from './dto/update-contact-query.dto';

@Controller('contact-queries')
export class ContactQueriesController {
  constructor(private readonly contactQueriesService: ContactQueriesService) {}

  @Post()
  create(@Body() createContactQueryDto: CreateContactQueryDto) {
    return this.contactQueriesService.create(createContactQueryDto);
  }

  @Get()
  findAll() {
    return this.contactQueriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactQueriesService.findOne(Number(id));
  }

  @Get('search/:query')
  search(@Param('query') query: string) {
    return this.contactQueriesService.search(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactQueryDto: UpdateContactQueryDto,
  ) {
    return this.contactQueriesService.update(id, updateContactQueryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactQueriesService.remove(Number(id));
  }
}
