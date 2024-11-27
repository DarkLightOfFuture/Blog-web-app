export class User {
  constructor(
    public username: string | null,
    public avatar: string | null,
    public email: string | null,
    public phoneNumber: string | null,
    public hasAdmin: boolean | null,
    public date: string | null
  ) { }
}
