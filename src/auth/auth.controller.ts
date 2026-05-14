import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";

@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post("login")
  async login(@Body() data: { email: string; password: string }) {
    const email = data.email?.trim();
    const password = data.password;

    if (!email || !password) {
      throw new HttpException("Email and password are required", HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const storedPassword = user.password;

    let isValid = false;

    if (!storedPassword) {
      // Demo fallback kalau password di database masih NULL
      isValid = password === "123" || password === "password123";
    } else if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
      // Password sudah bcrypt hash
      isValid = await bcrypt.compare(password, storedPassword);
    } else {
      // Password masih plain text
      isValid = password === storedPassword;
    }

    if (!isValid) {
      throw new HttpException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }

    const { password: _password, ...safeUser } = user as any;

    return {
      user: safeUser,
      token: "demo-token-" + user.id,
    };
  }
}
