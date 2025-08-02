export type AuthUser = {
  id?: string;
  username: string;
  email: string;
  accountType: "user" | "admin";
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
