export type UserProps = {
  ip?: string;
  userId: string;
};

export type DefaultProps = Partial<Omit<UserProps, "ip">>;
