export type AuthUser = {
  id?: string;
  username: string;
  accountType: "user" | "admin";
};

export type RegisterPayload = {
  username: string;
  password: string;
  email: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
