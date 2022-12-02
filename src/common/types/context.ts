export interface IUser {
  user?: {
    userId: string;
    email: string;
    id: string;
  };
  id: string;
  email: string;
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
