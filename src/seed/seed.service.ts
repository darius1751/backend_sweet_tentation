import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { PermissionService } from 'src/permission/permission.service';
import { categories } from './db/categories';
import { permissions } from './db/permissions';


@Injectable()
export class SeedService {

  constructor(
    private categoryService: CategoryService,
    private permssionService: PermissionService
  ) { }

  async seed() {
    await this.categoryService.createMany(categories);
    await this.permssionService.createMany(permissions);
    return 'Seed implement';
  }
}