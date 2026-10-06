import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      user &&
      (user.isAdmin ||
        ['admin', 'super_admin', 'student_admin', 'assessment_admin'].includes(
          user.role,
        ))
    ) {
      return true;
    }

    throw new ForbiddenException('Not authorized as an admin');
  }
}
