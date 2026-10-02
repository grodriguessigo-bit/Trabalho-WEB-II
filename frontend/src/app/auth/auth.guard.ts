import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {

  const loginService = inject(LoginService);
  const router = inject(Router);

  const userType = loginService.getLoggedUserType();

  const url = state.url;

  if (userType) {

    if (
      route.data?.['role'] &&
      route.data?.['role'].indexOf(userType) === -1
    ) {

      router.navigate(
        ['/login'],
        {
          queryParams: {
            error: 'Proibido o acesso a ' + url
          }
        }
      );

      return false;
    }

    return true;
  }

  router.navigate(
    ['/login'],
    {
      queryParams: {
        error: 'Deve fazer o login antes de acessar ' + url
      }
    }
  );

  return false;
};