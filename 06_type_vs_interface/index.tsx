// type은 별칭, interface는 계약

type UserT = {
  id: string;
  name: string;
};

interface UserI {
  id: string;
  name: string;
}

const user1: UserT = {
  id: "1",
  name: "John",
};

const user2: UserI = {
  id: "1",
  name: "Kim",
};

// interface = extends, type = &
interface AdminUserI extends UserI {
  role: string;
}

type AdminUserT = UserT & {
  role: string;
};

// 함수는 어떤 타입을 쓰냐?

type toStringT = (value: string) => string;

interface toStringI {
  (value: string): string;
}

// 클래스는 Interface를 사용하는 것이 좋다.

class User implements UserI {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
// type을 클래스에 쓰면 불편한 이유
class User2 implements UserT {
  id: string;
  name: string;
}

// 실무 : api 응답? -> type
type ApiResponse = {
  data: {
    id: string;
    name: string;
  };
};

type ApiOk<T> = { ok: true; data: T };
type ApiFail = { ok: false; message: string };

type UserDTO = {
  id: string;
  name: string;
  role: "user" | "admin";
};

type GetUserResponse = ApiOk<UserDTO> | ApiFail;

async function getUser(id: string): Promise<GetUserResponse> {
  const ok = Math.random() > 0.2;
  return ok
    ? { ok: true, data: { id, name: "Lee", role: "user" } }
    : { ok: false, message: "not found" };
}

const r = await getUser("1");
if (r.ok) console.log(r.data.role); // 타입 안전
else console.warn(r.message);

// 템플릿과 매핑은 Type
type BaseEvent = "click" | "focus";
type HandlerKey = `on${Capitalize<BaseEvent>}`;
type Handlers = { [K in HandlerKey]?: () => void };

const h1: Handlers = {
  onClick: () => {},
};

// 디자인시스템 Props, interface
export interface ButtonProps {
  onClick: () => void;
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ onClick, variant }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {children}
    </button>
  );
}

// interface trackingId

interface ButtonProps {
  trackingId?: string;
}

// 예시
type Channel = "email" | "slack" | "sms";
type PayloadMap = {
  email: { to: string; subject: string; html: string };
  slack: { channel: string; text: string };
  sms: { to: string; text: string };
};
type Message<C extends Channel> = { channel: C; payload: PayloadMap[C] };

// 계약: 구현 교체
export interface Notifier {
  send<C extends Channel>(msg: Message<C>): Promise<boolean>;
}

export class SlackNotifier implements Notifier {
  async send(msg: Message<"slack">) {
    console.log("SLACK", msg.payload.text);
    return true;
  }
}

// 분기/ 문자열 조합/ 매핑 파생타입 => Type
// 공개, 계약 => interface
// 클래스는 => interface
// 내부 유틸, 변환, 조합 => Type
