export type LoginPlatform = "web";

export type LoginRequest = {
  email: string;
  password: string;
  platform: LoginPlatform;
};

export type AuthUser = {
  id: number;
  email: string;
  username: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};
