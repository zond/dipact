export abstract class Adapter<A, T> {
  constructor(protected readonly adaptee: A) {}
  abstract adapt(): T;
  protected asDate(date: string) {
    return new Date(Date.parse(date)).toLocaleDateString();
  }
}
