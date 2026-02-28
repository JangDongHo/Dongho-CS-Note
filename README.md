## 🃏 CS 플래시카드 웹사이트

CS 면접 대비 플래시카드 앱 (Next.js + SQLite + Prisma)

### 실행 방법

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경 변수 설정 (.env 파일 생성)
echo 'DATABASE_URL="file:./dev.db"' > .env

# 3. DB 마이그레이션
npx prisma migrate deploy

# 4. 시드 데이터 적재 (cs-interview-questions.md 기반)
npm run db:seed

# 5. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속
