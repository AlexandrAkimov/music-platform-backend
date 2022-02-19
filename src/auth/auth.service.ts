import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (user && user.password === pass) {
      const { username, _id } = user;
      return { username, id: _id }
    }

    return null;
  }

  async login(user: CreateUserDto) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string) {
    try {
      await this.jwtService.verify(token.split(' ')[1])
      return {
        access_token: token,
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async registerUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOne(username);

      if (user) {
        throw new UnauthorizedException();
      }

      await this.userService.createUser(username, password)

      return {
        access_token: this.jwtService.sign({ username }),
      };
    } catch (error) {
      throw new UnauthorizedException()
    }

  }
}
