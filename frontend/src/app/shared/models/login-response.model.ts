export class LoginResponse {
  constructor(
    public userId: number = 0,
    public name: string = '',
    public profile: string = '',
  ) {

  }
}