export abstract class Adapter<A> {
  constructor(protected readonly adaptee: A) {}
}

type NonUndefined<T> = T extends undefined ? never : T;

type Endpoint = {
  select: (...args: any) => (...args: any) => { data?: any | undefined };
};

type EndpointData<T extends Endpoint> = ReturnType<
  ReturnType<T["select"]>
>["data"];

export type NonUndefinedEndpointData<T extends Endpoint> = NonUndefined<
  EndpointData<T>
>;
