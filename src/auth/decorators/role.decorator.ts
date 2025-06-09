//adding someconstrains to route

import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/entities/user.entity";

//
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// This decorator can be used to specify which roles are allowed to access a particular route.