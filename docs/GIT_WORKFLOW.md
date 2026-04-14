# Git Workflow & Branching Strategy

Feel-Log 프로젝트의 Git 워크플로우와 브랜칭 전략을 설명합니다.

## 목차

1. [브랜칭 모델](#브랜칭-모델)
2. [브랜치 종류](#브랜치-종류)
3. [워크플로우](#워크플로우)
4. [커밋 메시지 규칙](#커밋-메시지-규칙)
5. [병합 (Merge) 전략](#병합-merge-전략)
6. [실전 예제](#실전-예제)

---

## 브랜칭 모델

Feel-Log는 **Git Flow** 모델을 기반으로 한 브랜칭 전략을 사용합니다.

```
main (프로덕션)
  ↑
  └─ develop (개발)
       ├─ feature/* (기능)
       ├─ bugfix/* (버그 수정)
       └─ release/* (릴리스 준비)
```

### 핵심 원칙

- **main**: 항상 배포 가능한 상태
- **develop**: 다음 버전을 위한 통합 브랜치
- **feature/\***: 새로운 기능 개발
- **bugfix/\***: 버그 수정
- **release/\***: 배포 준비

---

## 브랜치 종류

### 1. main 브랜치

**목적**: 프로덕션 배포 가능한 상태 유지

```bash
# main은 직접 커밋하지 않음
# develop에서 PR을 통해 머지만 수행

# main에서 직접 체크아웃하면 안 됨
git checkout main  # ❌ 금지

# develop에서 작업한 후 PR
git checkout develop
# ... 작업 ...
# PR → 리뷰 → 머지
```

**특징**:
- 모든 커밋은 버전 태그를 가짐
- 배포 자동화 가능
- 항상 안정적인 상태

### 2. develop 브랜치

**목적**: 다음 버전 개발을 위한 통합 브랜치

```bash
# develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop

# feature 브랜치 생성
git checkout -b feature/emotion-tracking
```

**특징**:
- 가장 자주 변경되는 브랜치
- feature, bugfix 브랜치의 기반
- 릴리스 준비 시 release 브랜치 생성

### 3. feature/\* 브랜치

**목적**: 새로운 기능 개발

**네이밍 규칙**:
```
feature/감정-기록      (감정 기록 기능)
feature/소비-분석      (소비 분석 기능)
feature/사용자-인증    (사용자 인증)
feature/API-연동      (API 통합)
```

**생명주기**:
```bash
# 1. develop에서 최신 업데이트
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성
git checkout -b feature/emotion-tracking

# 3. 기능 개발 (여러 커밋)
git add .
git commit -m "feat: 감정 선택 UI 구현"
git commit -m "feat: 감정 저장 API 연동"

# 4. develop에 PR 생성 및 머지
git push origin feature/emotion-tracking
# → GitHub에서 PR 생성
# → 코드 리뷰
# → 승인 후 머지

# 5. 로컬에서 브랜치 삭제
git checkout develop
git branch -d feature/emotion-tracking
git fetch -p  # 원격 브랜치 삭제된 참조 정리
```

### 4. bugfix/\* 브랜치

**목적**: 버그 수정

**네이밍 규칙**:
```
bugfix/hydration-오류-수정
bugfix/날짜-포맷-버그
bugfix/로컬스토리지-초기화
```

**워크플로우**: feature와 동일하지만, develop에서 생성

```bash
git checkout develop
git checkout -b bugfix/hydration-error
# ... 수정 ...
git push origin bugfix/hydration-error
# → PR 생성 → 머지
```

### 5. release/\* 브랜치

**목적**: 배포 준비 (버전 태그, 최종 테스트)

**네이밍 규칙**:
```
release/v1.0.0
release/v1.0.1
```

**워크플로우**:
```bash
# 1. develop에서 release 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. 버전 정보 업데이트
# - package.json version 업데이트
# - CHANGELOG.md 작성
git commit -m "bump: v1.0.0"

# 3. main에 PR 생성
# → 최종 리뷰 및 테스트
# → 승인 시 머지

# 4. main에서 태그 생성
git checkout main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 5. develop으로 다시 머지 (변경사항 동기화)
git checkout develop
git merge release/v1.0.0

# 6. release 브랜치 삭제
git branch -d release/v1.0.0
```

---

## 워크플로우

### 신규 기능 추가 워크플로우

```
1. develop 최신화
   └─ git checkout develop && git pull origin develop

2. feature 브랜치 생성
   └─ git checkout -b feature/new-feature

3. 기능 개발 (반복)
   ├─ 코드 작성
   ├─ 테스트
   └─ 커밋
       └─ git commit -m "feat: 기능 설명"

4. 원격 push
   └─ git push origin feature/new-feature

5. PR 생성
   ├─ GitHub에서 PR 생성
   ├─ 설명 작성
   └─ 리뷰 요청

6. 코드 리뷰 및 수정
   ├─ 피드백 받음
   ├─ 수정 커밋
   └─ Push (자동으로 PR 업데이트)

7. 승인 및 머지
   └─ 유지보수자가 PR 머지

8. 로컬 정리
   └─ git checkout develop
   └─ git pull origin develop
   └─ git branch -d feature/new-feature
```

### 버그 수정 워크플로우

```
1. develop에서 bugfix 브랜치 생성
   └─ git checkout -b bugfix/bug-name

2. 버그 수정
   └─ 문제 재현 → 원인 파악 → 수정 → 테스트

3. 커밋 및 PR
   └─ feature와 동일한 프로세스

4. 병합
   └─ develop에 병합됨
```

### 배포 워크플로우

```
1. develop에서 release 브랜치 생성
   └─ git checkout -b release/vX.Y.Z

2. 최종 준비
   ├─ 버전 정보 업데이트
   ├─ CHANGELOG 작성
   └─ 최종 테스트

3. main으로 PR 생성
   └─ 최종 리뷰

4. main에 병합
   └─ 자동 배포 트리거

5. 태그 생성
   └─ git tag -a vX.Y.Z

6. develop으로 다시 병합
   └─ 변경사항 동기화
```

---

## 커밋 메시지 규칙

### 형식

```
<타입>: <제목>

<본문>

<푸터>
```

### 타입

| 타입 | 설명 | 예 |
|------|------|-----|
| `feat` | 새로운 기능 | `feat: 감정 선택 UI` |
| `fix` | 버그 수정 | `fix: hydration 오류` |
| `docs` | 문서 변경 | `docs: README 업데이트` |
| `style` | 코드 스타일 (기능 변화 없음) | `style: 들여쓰기 정렬` |
| `refactor` | 코드 리팩토링 | `refactor: 감정 로직 개선` |
| `perf` | 성능 개선 | `perf: 번들 크기 최적화` |
| `test` | 테스트 추가/수정 | `test: 날짜 포맷 테스트` |
| `chore` | 빌드/도구 변경 | `chore: 의존성 업데이트` |
| `ci` | CI/CD 설정 변경 | `ci: GitHub Actions 추가` |

### 예제

#### 좋은 예

```
feat: 감정 기록 기능 구현

- 감정 선택 인터페이스 추가
- 감정 데이터 로컬스토리지 저장
- useFormattedDate 훅 사용으로 타임존 안전성 확보

Closes #123

🤖 Generated with Claude Code
```

```
fix: hydration 오류 수정

ClientOnly 컴포넌트로 클라이언트 전용 영역 감싸기

이전: 서버와 클라이언트 렌더링 불일치 오류
이후: Hydration 안전성 확보

Fixes #456
```

#### 나쁜 예

```
❌ 수정함
❌ 업데이트
❌ 이거 해줘
❌ WIP
```

---

## 병합 (Merge) 전략

### Squash and Merge (권장)

여러 개의 커밋을 하나로 정리하여 main 히스토리 깔끔 유지

```
feature 브랜치의 여러 커밋
├─ commit 1: 파일 추가
├─ commit 2: 수정
├─ commit 3: 재수정
└─ commit 4: 최종

↓ Squash and Merge ↓

main 브랜치
└─ commit 1: feat: 기능 설명 (모든 변경사항 포함)
```

**사용 시기**: 기능 개발, 버그 수정

**명령어**:
```bash
git merge --squash feature/branch-name
git commit -m "feat: 기능 설명"
```

### Conventional Merge

커밋 히스토리 그대로 유지 (변경사항 추적 용이)

```
feature의 커밋들이 모두 main에 추가됨
```

**사용 시기**: 중요한 피쳐, 감사 추적 필요

**명령어**:
```bash
git merge feature/branch-name
```

### Rebase and Merge

선형 히스토리 유지

```
feature 커밋들을 main의 최신 커밋 위에 재배치
```

**사용 시기**: 선형 히스토리 선호

**명령어**:
```bash
git rebase main
git merge --ff-only feature/branch-name
```

---

## 실전 예제

### 예제 1: 새로운 기능 추가

```bash
# 1단계: develop 최신화
git checkout develop
git pull origin develop

# 2단계: feature 브랜치 생성
git checkout -b feature/spending-analysis

# 3단계: 기능 개발
echo "// 소비 분석 로직" > src/features/analysis.ts
git add .
git commit -m "feat: 소비 분석 로직 구현"

echo "// UI 컴포넌트" > src/components/AnalysisChart.tsx
git add .
git commit -m "feat: 분석 차트 컴포넌트"

# 4단계: 원격에 push
git push origin feature/spending-analysis

# 5단계: GitHub에서 PR 생성
# → 기술 검토자: @reviewer
# → 설명: 소비 분석 기능 추가
# → 관련 이슈: Closes #789

# 6단계: 리뷰 피드백 반영
# (필요 시) 추가 커밋
git commit -m "review: 성능 최적화 피드백 반영"
git push origin feature/spending-analysis

# 7단계: 머지 (GitHub UI에서 'Squash and merge' 클릭)

# 8단계: 로컬 정리
git checkout develop
git pull origin develop
git branch -d feature/spending-analysis
```

### 예제 2: 버그 수정 및 배포

```bash
# 1단계: bugfix 브랜치 생성
git checkout develop
git checkout -b bugfix/date-formatting-bug

# 2단계: 버그 수정
# ... 수정 코드 ...
git commit -m "fix: 날짜 포맷 버그 수정

formatToKorean 함수에서 서버 환경에서 오류 발생
useFormattedDate 훅 사용으로 해결"

# 3단계: PR 생성 및 머지
git push origin bugfix/date-formatting-bug
# → GitHub PR 생성 → 리뷰 → 머지

# 4단계: develop 정리
git checkout develop
git pull origin develop
git branch -d bugfix/date-formatting-bug

# 5단계: 배포 준비
git checkout -b release/v1.1.0

# package.json 버전 업데이트
npm version minor  # 1.0.0 → 1.1.0

# CHANGELOG 작성
cat > CHANGELOG.md << 'EOF'
# v1.1.0 (2024-01-15)

## Bug Fixes
- 날짜 포맷팅 오류 수정 (#890)

## Features
- 소비 분석 기능 추가 (#789)
EOF

git add package.json CHANGELOG.md
git commit -m "bump: v1.1.0"

# 6단계: main으로 PR 생성
git push origin release/v1.1.0
# → GitHub에서 PR to main → 리뷰 → 머지

# 7단계: 태그 생성 (main에서)
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# 8단계: develop으로 다시 머지
git checkout develop
git merge release/v1.1.0

# 9단계: 정리
git branch -d release/v1.1.0
```

---

## 주요 규칙

### ✅ DO (해야 할 것)

- 적절한 브랜치 이름 사용
- 명확한 커밋 메시지 작성
- PR에 상세한 설명 추가
- 코드 리뷰 요청 전 자신의 코드 검토
- 머지 전에 최신 develop/main pull
- feature 완료 후 브랜치 삭제

### ❌ DON'T (하면 안 될 것)

- main에 직접 push
- 명확하지 않은 메시지로 커밋
- 병합하지 않은 브랜치 보존
- 오래된 커밋으로 작업 시작
- 남의 브랜치에서 일방적으로 push
- 대량의 파일 한 커밋에 모으기

---

## FAQ

**Q: feature 브랜치에서 얼마나 많은 커밋을 해도 되나요?**
A: 상관없습니다. Squash merge를 사용하면 PR 시 하나로 정리됩니다.

**Q: develop이 main으로 머지되는 순서는?**
A: develop → release → main → develop (변경사항 동기화)

**Q: 실수로 main에 push했어요.**
A: `git revert` 커밋을 만들거나 유지보수자에게 보고하세요.

**Q: feature 브랜치가 너무 오래됐어요.**
A: develop을 rebase하세요: `git rebase develop`

**Q: 다른 feature와 충돌합니다.**
A: PR에서 충돌 해결 → GitHub의 "Resolve conflicts" 사용

---

## 참고 자료

- [Atlassian: Git Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
