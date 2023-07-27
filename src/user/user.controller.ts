import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginCredentialDto } from 'src/credential/dto/login-credential.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { RequirePermission } from 'src/common/decorators/requirePermission.decorator';
import { Permission } from 'src/common/permission.enum';
import { PermissionGuard } from 'src/common/guards/permission/permission.guard';

@UseGuards(PermissionGuard)
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @RequirePermission(Permission.CREATE_USER)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginCredentialDto: LoginCredentialDto) {
    return this.userService.login(loginCredentialDto);
  }

  @RequirePermission(Permission.FIND_ALL_USERS)
  @Get()
  findAll(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number
  ) {
    return this.userService.findAll(skip, take);
  }

  @RequirePermission(Permission.FIND_ONE_USER_BY_ID)
  @Get(':id')
  findOneById(@Param('id', MongoIdPipe) id: string) {
    return this.userService.findOneById(id);
  }

  @RequirePermission(Permission.UPDATE_USER)
  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  
  @RequirePermission(Permission.DELETE_USER)
  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
