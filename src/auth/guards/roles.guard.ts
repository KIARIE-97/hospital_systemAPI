import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ROLES_KEY } from "../decorators/role.decorator";
import { J } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { JWTPayload } from "../strategies";

interface UserRequest extends Request{
    user?: JWTPayload; // Define the user property to hold JWT payload;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector, // Import Reflector to access metadata
        @InjectRepository(User) // Inject the User repository to access user data
        private userRepository: Repository<User>,
    ) {}
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const reqRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (!reqRoles) {
            return true; // If no roles are specified, allow access
        }
        const request = context.switchToHttp().getRequest<UserRequest>();
        const user = request.user; // user is attached to the request object
        if (!user) {
            return false; // If user is not authenticated or role is not present, deny access
        }
        // const userEntity = await this.userRepository.findOne({
        //     where: {id: user.sub},
        //     select: ['id', 'role'], // Select only the necessary fields
        // })
        // user.role
       
        // if (!userEntity) {
        //     return false; // If user does not exist, deny access
        // }
        // Check if the user's role matches any of the required roles
        const hasRole = reqRoles.some((role) => user.role === role);
        return hasRole; // Return true if the user has one of the required roles, otherwise false
    }
}