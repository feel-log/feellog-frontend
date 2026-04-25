# CI/CD Pipeline 구축 가이드

## 📋 개요

이 문서는 feel-log-front 프로젝트의 CI/CD 파이프라인 구축에 대한 상세 가이드입니다.

**기술 스택:**
- **CI/CD 도구**: GitHub Actions
- **컨테이너화**: Docker
- **배포 환경**: AWS (ECS/Fargate)
- **저장소**: ECR (Elastic Container Registry)
- **브랜치 전략**: feature → develop → main

---

## 🏗️ 아키텍처 개요

```
┌─────────────┐
│   Feature   │
│   Branches  │
└──────┬──────┘
       │ (PR to develop)
       ↓
┌──────────────────────────────┐
│  GitHub Actions (CI Check)   │
│  - Lint                      │
│  - Build                     │
│  - Security Scan             │
└──────────┬───────────────────┘
           │ ✅ Pass
           ↓
┌──────────────────┐
│  develop Branch  │
│  - Auto Deploy   │
│  - Dev ECS       │
└──────────┬───────┘
           │ (PR to main)
           ↓
┌──────────────────────────────┐
│  GitHub Actions (CI Check)   │
│  - Lint                      │
│  - Build                     │
│  - Security Scan             │
└──────────┬───────────────────┘
           │ ✅ Pass
           ↓
┌──────────────────┐
│   main Branch    │
│  - Auto Deploy   │
│  - Prod ECS      │
└──────────────────┘
```

---

## 📁 파일 구조

```
feel-log-front/
├── docker/
│   ├── Dockerfile              # Docker 이미지 정의
│   ├── docker-compose.yml      # 로컬 개발 환경
│   └── .dockerignore          # Docker 빌드 제외 파일
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD 파이프라인 정의
├── docs/
│   ├── CI_CD_GUIDE.md         # 이 파일
│   ├── AWS_SETUP_GUIDE.md     # AWS 셋업 가이드
│   └── CI_CD_IMPLEMENTATION_SUMMARY.md # 최종 보고서
├── aws/
│   ├── ecs-task-definition-dev.json    # Dev 환경 설정
│   └── ecs-task-definition-prod.json   # Prod 환경 설정
└── ...
```

---

## 🔄 파이프라인 흐름

### 1️⃣ 코드 푸시 (모든 브랜치)

```yaml
trigger: push / pull_request
branches: main, develop, feature/**
```

파이프라인이 자동으로 시작됩니다.

### 2️⃣ Build & Test 단계

**실행 환경**: Ubuntu Latest

**작업:**
- ✅ 코드 체크아웃
- ✅ Node.js 20 설치
- ✅ 의존성 설치 (`npm ci`)
- ✅ ESLint 실행
- ✅ Next.js 빌드
- ✅ 빌드 아티팩트 업로드

**조건**: 모든 브랜치에서 실행

### 3️⃣ 보안 검사 단계

**실행 환경**: Ubuntu Latest

**작업:**
- ✅ npm audit 실행 (취약점 검사)
- ✅ OWASP Dependency Check 실행

**조건**: PR 또는 main 브랜치에서만 실행

### 4️⃣ Docker 빌드 단계

**실행 환경**: Ubuntu Latest

**작업:**
- ✅ AWS 자격증명 설정 (OIDC)
- ✅ ECR 로그인
- ✅ Docker 이미지 빌드
- ✅ ECR에 이미지 푸시

**조건**: main 또는 develop 브랜치로 푸시될 때만 실행

**이미지 태그:**
- `{ECR_REGISTRY}/feel-log-front:{commit_sha}`
- `{ECR_REGISTRY}/feel-log-front:latest`

### 5️⃣ Dev 배포 단계

**실행 환경**: Ubuntu Latest

**조건**: develop 브랜치로 푸시될 때만 실행

**작업:**
1. AWS 자격증명 설정
2. ECS 작업 정의 다운로드
3. 작업 정의 업데이트 (새 이미지 사용)
4. ECS 서비스 업데이트
5. 배포 완료 대기
6. Slack 알림 전송

**배포 대상:**
- **Cluster**: `feel-log-dev-cluster`
- **Service**: `feel-log-front-dev`

### 6️⃣ Prod 배포 단계

**실행 환경**: Ubuntu Latest

**조건**: main 브랜치로 푸시될 때만 실행

**작업:**
1. AWS 자격증명 설정
2. ECS 작업 정의 다운로드
3. 작업 정의 업데이트 (새 이미지 사용)
4. ECS 서비스 업데이트
5. 배포 완료 대기
6. Slack 알림 전송

**배포 대상:**
- **Cluster**: `feel-log-prod-cluster`
- **Service**: `feel-log-front-prod`

---

## 🔐 GitHub Secrets 설정

GitHub Repository Settings에서 다음 Secrets을 설정해야 합니다:

| Secret Name | 설명 | 예시 |
|---|---|---|
| `AWS_ACCOUNT_ID` | AWS 계정 ID | `123456789012` |
| `AWS_ROLE_ARN` | OIDC Role ARN | `arn:aws:iam::123456789012:role/github-actions-role` |
| `NEXT_PUBLIC_API_URL` | API 엔드포인트 URL | `https://api.example.com` |
| `SLACK_WEBHOOK_DEV` | Dev 배포 Slack 웹훅 | `https://hooks.slack.com/services/...` |
| `SLACK_WEBHOOK_PROD` | Prod 배포 Slack 웹훅 | `https://hooks.slack.com/services/...` |

### AWS OIDC 역할 생성 (IAM)

1. AWS IAM Console로 이동
2. Identity Providers 탭에서 새 제공자 생성
3. OpenID Connect 선택
4. Provider URL: `https://token.actions.githubusercontent.com`
5. Audience: `sts.amazonaws.com`
6. 생성 후 신뢰 정책 편집:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/feel-log-front:*"
        }
      }
    }
  ]
}
```

필요한 권한:
- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:PutImage`
- `ecr:InitiateLayerUpload`
- `ecr:UploadLayerPart`
- `ecr:CompleteLayerUpload`
- `ecs:DescribeTaskDefinition`
- `ecs:DescribeServices`
- `ecs:DescribeTaskDefinition`
- `ecs:UpdateService`
- `iam:PassRole`

---

## 🐳 Docker 컨테이너

### Dockerfile 설명

**Multi-stage 빌드:**
1. **Builder Stage**: 의존성 설치, 애플리케이션 빌드
2. **Production Stage**: 프로덕션 의존성만 포함, 빌드 결과물 복사

**장점:**
- ✅ 최종 이미지 크기 감소
- ✅ 보안 개선 (빌드 도구 제외)
- ✅ 더 빠른 배포

### 로컬 개발

#### Docker로 로컬 실행

```bash
# 이미지 빌드
docker build -f docker/Dockerfile -t feel-log-front:local .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  feel-log-front:local
```

#### Docker Compose 사용

```bash
# 서비스 시작
docker-compose -f docker/docker-compose.yml up -d

# 로그 확인
docker-compose -f docker/docker-compose.yml logs -f feel-log-front

# 서비스 중지
docker-compose -f docker/docker-compose.yml down
```

---

## 📊 AWS ECS 설정

### ECS Task Definition 예시 (Dev)

```json
{
  "family": "feel-log-front-dev",
  "containerDefinitions": [
    {
      "name": "feel-log-front",
      "image": "{AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/feel-log-front:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXT_PUBLIC_API_URL",
          "value": "https://api-dev.example.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/feel-log-front-dev",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "node -e \"require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})\""
        ],
        "interval": 30,
        "timeout": 3,
        "retries": 3,
        "startPeriod": 40
      }
    }
  ],
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "256",
  "memory": "512"
}
```

---

## 🔍 모니터링 및 로깅

### CloudWatch Logs

모든 컨테이너 로그는 CloudWatch에 저장됩니다:
- Log Group: `/ecs/feel-log-front-{env}`
- Log Stream: `ecs/feel-log-front/{task_id}`

### 헬스 체크

ECS 작업 정의에 헬스 체크가 포함되어 있습니다:
- **간격**: 30초
- **타임아웃**: 3초
- **재시도**: 3회
- **시작 기간**: 40초

---

## 🚀 배포 프로세스

### Feature 브랜치에서 Develop으로

```bash
# 1. Feature 브랜치 생성 및 작업
git checkout -b feature/your-feature develop

# 2. 커밋 및 푸시
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature

# 3. GitHub에서 PR 생성 (develop을 대상으로)
# - CI 파이프라인 자동 실행
# - 린트, 빌드, 보안 검사 수행

# 4. PR 승인 후 머지
# develop 브랜치로 자동 배포 시작
```

### Develop에서 Main으로

```bash
# 1. PR 생성 (main을 대상으로)
# 2. CI 파이프라인 재실행
# 3. 승인 후 머지
# 4. 프로덕션 자동 배포 시작
```

---

## ⚡ 문제 해결

### 빌드 실패

**원인**: 의존성 문제, 구문 오류, 타입 오류

**해결:**
```bash
npm ci
npm run lint
npm run build
```

### Docker 이미지 빌드 실패

**원인**: Dockerfile 문제, 메모리 부족

**해결:**
```bash
# 로컬에서 빌드 테스트
docker build -t feel-log-front:test .

# 상세 로그 확인
docker build --progress=plain -t feel-log-front:test .
```

### ECR 로그인 실패

**원인**: AWS 자격증명 오류, 권한 부족

**해결:**
1. GitHub Secrets 확인
2. AWS IAM 역할 권한 확인
3. OIDC Provider 설정 확인

### ECS 배포 실패

**원인**: 작업 정의 오류, 리소스 부족, 헬스 체크 실패

**해결:**
1. CloudWatch Logs 확인
2. ECS 작업 로그 확인
3. 작업 정의 유효성 검사

```bash
# AWS CLI로 작업 정의 확인
aws ecs describe-task-definition \
  --task-definition feel-log-front-dev \
  --region us-east-1
```

---

## 📈 성능 최적화

### 빌드 캐싱

GitHub Actions 캐시 사용:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: npm
```

### Docker 레이어 캐싱

- 기본 레이어부터 변경 가능성 높은 레이어 순서로 정렬
- 불필요한 파일 제외 (.dockerignore)

### 병렬 처리

대부분의 단계가 병렬로 실행됩니다:
- build-and-test (모든 빌드 전 필수)
- security-scan (독립 실행)
- docker-build (빌드 후 실행)

---

## 🔄 CI/CD 파이프라인 업데이트

### 워크플로우 수정

1. `.github/workflows/ci-cd.yml` 수정
2. 테스트 브랜치에서 PR 생성하여 검증
3. 메인 브랜치로 머지

### 환경 변수 추가

1. GitHub Secrets에서 새 Secret 추가
2. 워크플로우에서 `${{ secrets.SECRET_NAME }}` 사용

---

## 📚 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [AWS ECS 문서](https://docs.aws.amazon.com/ecs/)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Docker 모범 사례](https://docs.docker.com/develop/dev-best-practices/)

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub Secrets 설정 완료
- [ ] AWS IAM 역할 생성 완료
- [ ] AWS ECR 저장소 생성 완료
- [ ] AWS ECS 클러스터 생성 완료
- [ ] AWS ECS 서비스 생성 완료
- [ ] 로컬에서 Docker 이미지 빌드 테스트
- [ ] GitHub Actions 워크플로우 테스트 (feature 브랜치)
- [ ] Slack 웹훅 설정 (선택사항)
- [ ] CloudWatch Logs 확인

---

**마지막 업데이트**: 2026-04-25  
**작성자**: Claude Code
