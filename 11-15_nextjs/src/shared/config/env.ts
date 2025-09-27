import { z } from "zod";

/**
 * 환경변수 스키마 정의
 * 모든 환경변수는 여기서 타입과 검증 규칙을 정의합니다.
 */
const envSchema = z.object({
  // Node.js 환경 설정
  NODE_ENV: z.enum(["development", "production", "test"]),

  HANDY: z.string(),
  NEXT_PUBLIC_DB_HOST: z.string(),
});

/**
 * 환경변수 타입 정의
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * 환경변수 검증 및 파싱 함수
 */
function validateEnv(): EnvConfig {
  try {
    // process.env를 스키마로 검증
    const parsed = envSchema.parse(process.env);

    // 개발 환경에서 환경변수 로딩 확인
    if (process.env.NODE_ENV === "development") {
      console.log("✅ 환경변수 검증 완료");
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ 환경변수 검증 실패:");
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });

      // 필수 환경변수 누락 시 상세 안내
      const missingRequired = error.issues
        .filter(
          (err: z.ZodIssue) =>
            err.code === "invalid_type" && (err as any).received === "undefined"
        )
        .map((err: z.ZodIssue) => err.path.join("."));

      if (missingRequired.length > 0) {
        console.error("\n필수 환경변수가 누락되었습니다:");
        missingRequired.forEach((key: string) => {
          console.error(`  - ${key}`);
        });
        console.error("\n.env 파일을 확인하거나 .env.example을 참고하세요.");
      }
    }

    throw new Error("환경변수 설정이 올바르지 않습니다.");
  }
}

/**
 * 검증된 환경변수 객체
 * 애플리케이션 전체에서 이 객체를 통해 환경변수에 접근합니다.
 */
export const env = validateEnv();

/**
 * 클라이언트 사이드에서 안전하게 사용할 수 있는 환경변수만 추출
 */
export const clientEnv = {
  NEXT_PUBLIC_DB_HOST: env.NEXT_PUBLIC_DB_HOST,
} as const;

/**
 * 환경별 설정 유틸리티
 */
export const envUtils = {
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
};
