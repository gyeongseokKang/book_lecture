// conditional type (조건부 타입)
// if-else 타입.

type IsString<T> = T extends string ? "Yes" : "No";

type A = IsString<string>;
type B = IsString<number>;
type C = IsString<string | number>;

// Pick , CustomPick

type User = { id: string; age: number };
type D = Pick<User, "id">;
type Age = Pick<User, "age">;

// CustomPick 구현해보자.
type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type CustomAge = CustomPick<User, "age">;

// ReadonlyPick 구현해보자.
type ReadonlyPick<T, K extends keyof T> = {
  readonly [P in K]: T[P];
};

type CustomReadonlyAge = ReadonlyPick<User, "age">;

// 접두사 기반 Pick
type PrefixPick<T, K extends string> = {
  [P in keyof T as P extends `${K}${string}` ? P : never]: T[P];
};

type Handles = {
  onClick: () => void;
  onSubmit: () => void;
  add: () => void;
  addon: () => void;
  age: number;
};

type OnlyOnHandles = PrefixPick<Handles, "on">;

// PickByValue 구현
type PickByValue<T, V> = {
  [P in keyof T as T[P] extends V ? P : never]: T[P];
};

type FnOnly = PickByValue<Handles, Function>;

// 실무예시
type ApiResponse2<T> = { ok: true; data: T } | { ok: false; error: string };

// 서버 응답 타입
type User2DTO = { id: string; name: string };

type ExtractData<T> = T extends { ok: true; data: infer U } ? U : never;

type User2Data = ExtractData<ApiResponse2<User2DTO>>;
