export interface IAlert {
  content: string;
  interval: number;
  timeoutId: any;
  isSuccess: boolean | undefined;
}
