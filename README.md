## 🃏 CS 플래시카드 웹사이트

CS 면접 대비 플래시카드 앱 (Next.js + SQLite + Prisma)

<img width="979" height="672" alt="image" src="https://github.com/user-attachments/assets/a879813f-c714-4fd1-927b-32fa30632a98" />

### 왜 플래시카드인가?

CS 면접 준비 시 영상 시청이나 노트만으로는 시간이 지나면 쉽게 잊어버립니다. [John Washam의 글](https://startupnextdoor.com/retaining-computer-science-knowledge/)에 따르면, **간격 반복(Spaced Repetition)** — 학습한 내용을 여러 시점에 나눠 복습하는 것이 지식 유지에 효과적입니다. 플래시카드는 이런 복습을 체계적으로 할 수 있게 해주는 도구입니다.

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
