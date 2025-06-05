import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Public } from './decorators/public.decorator';
import { AtGuard } from './guards';
import { RtGuard } from './guards/rf.guard';
export interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //auth/signin
  @Public()
  @Post('signin')
  signIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  //auth/signout
  
  @Post('signout/:id')
  signOut(@Param('id', ParseIntPipe) id: number) {
    console.log('Signout hit');
    return this.authService.signOut(id);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(@Query('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    console.log('Refresh hit');
    const user = req.user;
    console.log('User from request:', typeof (user.sub));
    console.log('User ID from query:', typeof (id));
    console.log(' request:', user.sub !== id);
    if (user.sub !== id) {
      throw new UnauthorizedException('Invalid user');
    }
    return this.authService.refreshTokens(id, user.refreshToken);
  }
}
