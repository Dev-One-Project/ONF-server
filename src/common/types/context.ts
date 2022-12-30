export interface IUser {
  user?: {
    email: string;
    id: string;
    role: string;
    company: string;
    member: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
