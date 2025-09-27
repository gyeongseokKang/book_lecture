// Type Guard

// 조건문으로 타입을 좁혀주는 문법이다. typeof, instanceof, in

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
  console.log(id);
}

// class User {
//   constructor(public name: string) {}
// }

// function printName(user: User) {
//   if(user instanceof User) {
//     console.log(user.name); // User
//   } else {
//     console.log(user) // never
//   }
// }

type Success = { ok: true; data: string };
type Failure = { ok: false; error: string };
type ApiResponse = Success | Failure;

// 사용자 정의 타입
function isSuccess(response: ApiResponse): response is Success {
  return response.ok;
}

function handleResponse(response: ApiResponse) {
  if (isSuccess(response)) {
    console.log(response.ok); // true
    console.log(response.data);
  } else {
    console.log(response.ok); // false
    console.log(response.error);
  }
}

// 다른 예시
function getImageSize(image: string | HTMLImageElement) {
  if (image instanceof HTMLImageElement) {
    return { width: image.width, height: image.height };
  } else {
    return { width: 0, height: 0 };
  }
}

// Type Branding

// type UserId = string;
// type OrderId = string;

type UserId = string & {
  __brand: "userId";
};
type OrderId = string & {
  __brand: "orderId";
};

function getUser(id: UserId) {
  return { id, name: "John" };
}

// 잘못된 요청이다.
// const orderId = "123" as OrderId;
// const userId = "456" as UserId;
// getUser(orderId);
// getUser(userId);

// 실무에는 TypeGuard & Type Branding을 함께 사용한다.

// 서버 응답(DTO)
type UserDTO = { id: string; name: string };
// 도메인 모델
// type User = { id: UserId; name: string };

// 타입 가드: 서버 응답이 UserDTO인지 확인
function isUserDTO(x: any): x is UserDTO {
  return typeof x.id === "string" && typeof x.name === "string";
}

// 변환 함수: DTO -> 도메인 모델
function toUser(dto: UserDTO): User {
  return { id: dto.id as UserId, name: dto.name };
}

const raw = { id: "123", name: "John" };

if (isUserDTO(raw)) {
  const user = toUser(raw);
  console.log(user);
} else {
  console.log("not user dto");
}
