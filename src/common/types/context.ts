export interface IUser {
  user?: {
    email: string;
    id: string;
    role: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
