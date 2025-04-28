export class CustomResponse<T> {
  constructor(
    public readonly data: T,
    public readonly message: string = 'Operation successful',
  ) {}
}
