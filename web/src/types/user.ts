export type SignUpValidationState = {
  username: boolean | undefined;
  email: boolean | undefined;
  password: boolean | undefined;
  passwordConfirm: boolean | undefined;
};

export type LoginValidationState = {
  username: boolean | undefined;
  password: boolean | undefined;
};
