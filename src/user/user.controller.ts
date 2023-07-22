import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginCredentialDto } from 'src/credential/dto/login-credential.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginCredentialDto: LoginCredentialDto) {
    return this.userService.login(loginCredentialDto);
  }

  @Get()
  findAll(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number
  ) {
    return this.userService.findAll(skip, take);
  }

  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
