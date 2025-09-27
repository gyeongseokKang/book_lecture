import { z } from "zod";

// 기본 스키마 (strict가 기본값)
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(20),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  // 추가 필드를 허용X
});

// loose 스키마 - 정의되지 않은 추가 필드를 허용
export const UserSchemaLoose = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(20),
    email: z.string().email(),
    role: z.enum(["admin", "user"]),
    // 추가 필드를 허용O
  })
  .loose();

// strict 스키마 - 추가 필드가 있으면 에러
export const UserSchemaStrict = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).max(20),
    email: z.string().email(),
    role: z.enum(["admin", "user"]),
  })
  .strict();

// 부분적으로 유효한 데이터를 위한 스키마들
export const UserSchemaPartial = UserSchema.partial(); // 모든 필드가 optional
export const UserSchemaOmitId = UserSchema.omit({ id: true }); // id 제외
export const UserSchemaPickWithoutId = UserSchema.pick({
  name: true,
  email: true,
  role: true,
}); // id 없이 선택

export type User = z.infer<typeof UserSchema>;
export type UserPartial = z.infer<typeof UserSchemaPartial>;
export type UserWithoutId = z.infer<typeof UserSchemaOmitId>;

// 실무 외부 응답값을 런타임에서 검증할때,
// 유저의 입력 (form)을 검증할때,
