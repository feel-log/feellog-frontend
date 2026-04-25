# CI/CD 파이프라인 구축 완료 보고서

**프로젝트**: feel-log-front  
**완료일**: 2026-04-25  
**상태**: ✅ 구축 완료

---

## 📌 개요

feel-log-front 프로젝트의 자동 CI/CD 파이프라인 구축이 완료되었습니다. 이 문서는 구축된 파이프라인의 구성, 특징, 그리고 배포 절차를 설명합니다.

---

## 🎯 프로젝트 목표

✅ GitHub Actions를 이용한 자동화된 CI/CD 파이프라인 구축  
✅ Docker를 이용한 컨테이너화  
✅ AWS ECS를 이용한 자동 배포  
✅ 개발(Dev), 프로덕션(Prod) 환경 분리  
✅ 보안 검사 및 모니터링 포함

---

## 📦 구축된 파일 목록

| 파일 경로 | 설명 | 용도 |
|---|---|---|
| `docker/Dockerfile` | Multi-stage Docker 빌드 | 컨테이너 이미지 생성 |
| `docker/.dockerignore` | Docker 빌드 제외 파일 | 이미지 크기 최적화 |
| `docker/docker-compose.yml` | 로컬 개발 환경 | 로컬 테스트 |
| `.github/workflows/ci-cd.yml` | GitHub Actions 워크플로우 | 자동 빌드 및 배포 |
| `aws/ecs-task-definition-dev.json` | Dev 환경 ECS 작업 정의 | AWS ECS 배포 설정 |
| `aws/ecs-task-definition-prod.json` | Prod 환경 ECS 작업 정의 | AWS ECS 배포 설정 |
| `docs/CI_CD_GUIDE.md` | CI/CD 상세 가이드 | 파이프라인 이해 및 운영 |
| `docs/AWS_SETUP_GUIDE.md` | AWS 리소스 셋업 가이드 | AWS 인프라 구축 |

---

## 🔄 파이프라인 구조

```
┌──────────────────────────────────────────────────────┐
│                  GitHub Actions                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. Build & Test (모든 브랜치)                       │
│     ├─ 코드 체크아웃                                  │
│     ├─ Node.js 설치 & 캐싱                           │
│     ├─ npm 의존성 설치                               │
│     ├─ ESLint 실행                                   │
│     └─ Next.js 빌드                                  │
│                                                      │
│  2. Security Scan (PR / main)                        │
│     ├─ npm audit 실행                                │
│     └─ OWASP Dependency Check                        │
│                                                      │
│  3. Docker Build (main / develop 푸시)               │
│     ├─ AWS 자격증명 설정                             │
│     ├─ ECR 로그인                                    │
│     ├─ Docker 이미지 빌드                            │
│     └─ ECR에 푸시                                    │
│                                                      │
│  4. Deploy to Dev (develop 브랜치)                   │
│     ├─ ECS 작업 정의 다운로드                         │
│     ├─ 작업 정의 업데이트                             │
│     ├─ ECS 서비스 배포                               │
│     └─ Slack 알림                                    │
│                                                      │
│  5. Deploy to Prod (main 브랜치)                     │
│     ├─ ECS 작업 정의 다운로드                         │
│     ├─ 작업 정의 업데이트                             │
│     ├─ ECS 서비스 배포                               │
│     └─ Slack 알림                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔐 보안 기능

### 1. 코드 품질 검사
- **ESLint**: JavaScript/TypeScript 코드 스타일 및 오류 검사
- **Next.js 빌드**: 타입스크립트 및 Next.js 특정 오류 감지

### 2. 취약점 스캔
- **npm audit**: npm 패키지 취약점 검사 (moderate 이상 경고)
- **OWASP Dependency Check**: 알려진 보안 취약점 자동 스캔

### 3. AWS 보안
- **OIDC 기반 인증**: GitHub에서 AWS 자격증명 없이 안전한 인증
- **최소 권한 원칙**: 필요한 최소 권한만 부여
- **비밀 관리**: AWS Secrets Manager 및 Parameter Store 활용
- **ECR 이미지 스캔**: 푸시된 이미지의 취약점 자동 스캔

### 4. 컨테이너 보안
- **Multi-stage 빌드**: 최종 이미지에서 불필요한 파일 제거
- **Alpine 기반 이미지**: 최소한의 공격 표면
- **헬스 체크**: 컨테이너 상태 모니터링
- **dumb-init 사용**: 신호 처리 개선

---

## 🚀 배포 전략

### Branch 전략

```
feature/* → develop → main
     ↓           ↓         ↓
   (CI)    (CI + Dev)  (CI + Prod)
           배포         배포
```

### 배포 환경

#### Development 환경
- **대상**: develop 브랜치
- **리소스**: CPU 256, Memory 512MB
- **인스턴스**: 1개
- **용도**: 개발 및 테스트
- **헬스 체크**: 활성화

#### Production 환경
- **대상**: main 브랜치
- **리소스**: CPU 512, Memory 1GB
- **인스턴스**: 2개 (고가용성)
- **용도**: 실제 사용자 서비스
- **로드 밸런싱**: Application Load Balancer
- **헬스 체크**: 활성화
- **자동 스케일링**: 지원 (선택사항)

---

## 📋 필수 설정 사항

### 1. GitHub Secrets 설정

Repository Settings → Secrets에서 다음 항목 추가:

```
AWS_ACCOUNT_ID          # AWS 계정 ID
AWS_ROLE_ARN           # OIDC Role ARN
NEXT_PUBLIC_API_URL    # API 엔드포인트 URL
SLACK_WEBHOOK_DEV      # Dev 배포 Slack 웹훅 (선택)
SLACK_WEBHOOK_PROD     # Prod 배포 Slack 웹훅 (선택)
```

### 2. AWS 리소스 생성

**필수 리소스:**
- ✅ ECR 저장소 (feel-log-front)
- ✅ CloudWatch 로그 그룹
- ✅ ECS 클러스터 (dev, prod)
- ✅ ECS 서비스 (dev, prod)
- ✅ ECS 작업 정의 (dev, prod)
- ✅ IAM 역할 및 정책
- ✅ VPC 및 Security Group

**선택 리소스:**
- ⭕ Application Load Balancer (Prod)
- ⭕ Auto Scaling (Prod)
- ⭕ Slack 웹훅 통합

### 3. AWS OIDC 설정

GitHub Actions가 AWS에 안전하게 인증하기 위해:

1. IAM에서 OIDC Provider 추가
   - Provider: `token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`

2. Trust Policy 설정
   - Repository: `YOUR_ORG/feel-log-front`
   - 역할: `github-actions-role`

---

## 🔍 Docker 이미지 빌드

### Multi-stage 빌드의 장점

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
# 의존성 설치, 빌드

# Stage 2: Production
FROM node:20-alpine
# 프로덕션 파일만 복사
```

**결과:**
- 최종 이미지 크기: ~300-400MB (빌드 도구 제외)
- 보안 개선: 빌드 환경 격리
- 배포 속도: 더 빠른 이미지 다운로드

### 로컬 테스트

```bash
# Docker Compose로 로컬 실행
docker-compose -f docker/docker-compose.yml up -d

# 또는 수동 빌드
docker build -f docker/Dockerfile -t feel-log-front:local .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  feel-log-front:local
```

---

## 📊 파이프라인 세부 단계

### Step 1: Build & Test Job
```yaml
- Checkout code
- Setup Node.js v20 (캐싱 활성화)
- npm ci (의존성 설치)
- npm run lint (ESLint)
- npm run build (Next.js 빌드)
- Upload artifact (.next)
```

**실행 시간**: ~5-10분  
**실패 조건**: 린트 오류, 빌드 오류

### Step 2: Security Scan Job
```yaml
- npm audit (취약점 검사)
- OWASP Dependency Check (정적 분석)
```

**실행 시간**: ~3-5분  
**실패 조건**: moderate 이상 취약점

### Step 3: Docker Build Job
```yaml
- AWS 자격증명 설정 (OIDC)
- ECR 로그인
- Docker 이미지 빌드
- ECR에 이미지 푸시
```

**실행 시간**: ~10-15분  
**태그 규칙**:
- `{account_id}.dkr.ecr.us-east-1.amazonaws.com/feel-log-front:{commit_sha}`
- `{account_id}.dkr.ecr.us-east-1.amazonaws.com/feel-log-front:latest`

### Step 4: Deploy to Dev
```yaml
- 조건: develop 브랜치 푸시
- ECS 작업 정의 다운로드
- 새 이미지로 작업 정의 업데이트
- ECS 서비스 배포
- Slack 알림 (성공/실패)
```

**실행 시간**: ~5-10분  
**배포 대상**: feel-log-dev-cluster / feel-log-front-dev

### Step 5: Deploy to Prod
```yaml
- 조건: main 브랜치 푸시
- ECS 작업 정의 다운로드
- 새 이미지로 작업 정의 업데이트
- ECS 서비스 배포 (2개 인스턴스)
- Slack 알림 (성공/실패)
```

**실행 시간**: ~5-10분  
**배포 대상**: feel-log-prod-cluster / feel-log-front-prod

---

## 📈 파이프라인 실행 통계

### 예상 실행 시간

| 시나리오 | 실행 시간 | 병렬 처리 |
|---|---|---|
| Feature 브랜치 (PR) | 15-20분 | Build, Lint, Test |
| develop 브랜치 푸시 | 30-40분 | Build + Docker Build + Dev Deploy |
| main 브랜치 푸시 | 35-45분 | Build + Docker Build + Prod Deploy |

### 리소스 사용

| 항목 | 사용량 |
|---|---|
| GitHub Actions Runner | Ubuntu Latest |
| Docker 이미지 크기 | ~300-400MB |
| ECR 저장소 | 무제한 (정책 적용 가능) |
| CloudWatch Logs | 30일 보관 |

---

## ⚠️ 주의사항

### 1. 환경 변수 관리
```bash
# Parameter Store에 저장
aws ssm put-parameter \
  --name /feel-log/dev/api-url \
  --value "https://api-dev.example.com" \
  --type String
```

### 2. 시크릿 관리
```bash
# Secrets Manager에 저장
aws secretsmanager create-secret \
  --name feel-log/db-password \
  --secret-string "your-password"
```

### 3. 이미지 보관 정책
```bash
# 오래된 이미지 자동 삭제 (선택사항)
aws ecr put-lifecycle-policy \
  --repository-name feel-log-front \
  --lifecycle-policy-text file://lifecycle-policy.json
```

---

## 🔄 운영 가이드

### 배포 프로세스

#### 1. Feature 브랜치에서 개발

```bash
git checkout -b feature/my-feature develop
# 개발 작업...
git push origin feature/my-feature
```

#### 2. PR 생성 및 리뷰

- GitHub에서 develop을 대상으로 PR 생성
- CI 파이프라인 자동 실행 (Lint, Build, Security)
- 리뷰 및 승인

#### 3. develop 브랜치 병합

```bash
# PR 승인 후 Merge
# → 자동으로 Dev 환경에 배포됨
```

#### 4. Main 브랜치로 승격

```bash
git checkout -b release/v1.0 develop
# develop → main으로 PR 생성
# → 자동으로 Prod 환경에 배포됨
```

### 배포 중 문제 해결

#### 빌드 실패
```bash
# 로컬에서 재현
npm ci
npm run lint
npm run build
```

#### Docker 빌드 실패
```bash
# 로컬에서 테스트
docker build -t feel-log-front:test .
```

#### ECS 배포 실패
```bash
# CloudWatch Logs 확인
aws logs tail /ecs/feel-log-front-dev --follow

# ECS 작업 상태 확인
aws ecs describe-tasks \
  --cluster feel-log-dev-cluster \
  --tasks <task-arn>
```

---

## 📚 참고 문서

이 보고서와 함께 제공되는 문서:

1. **CI_CD_GUIDE.md**
   - 파이프라인의 상세 설명
   - 각 단계별 구성
   - GitHub Secrets 설정
   - 로컬 개발 환경 구성

2. **AWS_SETUP_GUIDE.md**
   - AWS 리소스 생성 가이드
   - CloudFormation 템플릿
   - IAM 정책 설정
   - 자동 스케일링 구성

3. **Dockerfile**
   - Next.js 애플리케이션용 최적화된 Dockerfile
   - Multi-stage 빌드
   - 헬스 체크 포함

4. **docker-compose.yml**
   - 로컬 개발 환경
   - 볼륨 마운팅
   - 네트워크 설정

---

## ✅ 최종 체크리스트

배포 전 다음을 확인하세요:

### GitHub 설정
- [ ] Repository Secrets 추가
  - [ ] AWS_ACCOUNT_ID
  - [ ] AWS_ROLE_ARN
  - [ ] NEXT_PUBLIC_API_URL
  - [ ] SLACK_WEBHOOK_DEV (선택)
  - [ ] SLACK_WEBHOOK_PROD (선택)
- [ ] 브랜치 보호 규칙 설정
- [ ] CI 검사 필수 통과 설정

### AWS 설정
- [ ] ECR 저장소 생성
- [ ] CloudWatch 로그 그룹 생성
- [ ] ECS 클러스터 생성 (dev, prod)
- [ ] ECS 작업 정의 등록 (dev, prod)
- [ ] ECS 서비스 생성 (dev, prod)
- [ ] IAM 역할 생성 (ecsTaskExecutionRole, ecsTaskRole, github-actions-role)
- [ ] OIDC Provider 설정
- [ ] Parameter Store에 환경 변수 저장

### 로컬 테스트
- [ ] Docker 이미지 빌드 성공
- [ ] docker-compose up 정상 실행
- [ ] 로컬 주소에서 애플리케이션 접근 가능

### 파이프라인 검증
- [ ] Feature 브랜치에서 PR 생성 및 CI 통과
- [ ] develop 브랜치 병합 및 Dev 배포 확인
- [ ] main 브랜치 병합 및 Prod 배포 확인

---

## 🎉 결론

feel-log-front 프로젝트의 CI/CD 파이프라인 구축이 완료되었습니다.

**주요 성과:**
✅ 완전 자동화된 배포 프로세스  
✅ 개발/프로덕션 환경 분리  
✅ 보안 검사 통합  
✅ 모니터링 및 로깅  
✅ 확장 가능한 아키텍처

**다음 단계:**
1. AWS 리소스 생성 (AWS_SETUP_GUIDE.md 참고)
2. GitHub Secrets 설정
3. 파이프라인 테스트
4. 운영 시작

---

**작성일**: 2026-04-25  
**담당자**: Claude Code  
**버전**: 1.0
