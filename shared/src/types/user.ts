export type RegisterPayload = {
  username: string;
  password: string;
  email: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  accountType: "user" | "admin";
};
