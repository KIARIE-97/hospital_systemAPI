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
import { ApiBadRequestResponse, ApiBearerAuth, ApiOAuth2, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('contact-queries')
@ApiBearerAuth('access-token')
@Controller('contact-queries')
export class ContactQueriesController {
  constructor(private readonly contactQueriesService: ContactQueriesService) {}
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'Contactquery'))
  @Post()
  @ApiOperation({
    summary: 'Create a new contact query',
    description: 'Creates a new contact query with the provided details.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
      @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() createContactQueryDto: CreateContactQueryDto) {
    return this.contactQueriesService.create(createContactQueryDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get()
  @ApiOperation({
    summary: 'Get all contact queries',
    description: 'Retrieves a list of all contact queries.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  findAll() {
    return this.contactQueriesService.findAll();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get('search/:query')
  @ApiOperation({
    summary: 'Search contact queries',
    description: 'Searches for contact queries based on the provided query string.',
  })
  @ApiBadRequestResponse({ description: 'Invalid search query' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  search(@Param('query') query: string) {
    return this.contactQueriesService.search(query);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Contactquery'))
  @Get(':id')
  @ApiOperation({
    summary: 'Get contact query by ID',
    description: 'Retrieves a contact query by its unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid contact query ID' })
  findOne(@Param('id') id: string) {
    return this.contactQueriesService.findOne(Number(id));
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, 'Contactquery'))
  @Patch(':id')
@ApiOperation({
    summary: 'Update a contact query',
    description: 'Updates the details of an existing contact query.',
  })
@ApiBadRequestResponse({ description: 'Invalid input data' })
@ApiUnauthorizedResponse({ description: 'Authentication required' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactQueryDto: UpdateContactQueryDto,
  ) {
    return this.contactQueriesService.update(id, updateContactQueryDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Contactquery'))
  @Delete(':id')
@ApiOperation({
    summary: 'Delete a contact query',
    description: 'Deletes a contact query by its unique ID.',
  })  
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactQueriesService.remove(id);
  }
}
