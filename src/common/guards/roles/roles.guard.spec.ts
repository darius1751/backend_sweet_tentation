
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RoleGuardGuard', () => {
  it('should be defined', () => {
    expect(new RolesGuard(new Reflector())).toBeDefined();
  });
});
