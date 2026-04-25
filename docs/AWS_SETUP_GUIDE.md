# AWS 리소스 셋업 가이드

## 📋 필수 AWS 리소스

1. ECR (Elastic Container Registry)
2. ECS (Elastic Container Service)
3. CloudWatch (Logs)
4. IAM (Roles & Policies)
5. VPC & Security Groups

---

## 1️⃣ ECR 저장소 생성

### AWS Console을 통한 생성

```bash
# 또는 AWS CLI 사용
aws ecr create-repository \
  --repository-name feel-log-front \
  --region us-east-1 \
  --image-tag-mutability IMMUTABLE \
  --encryption-configuration encryptionType=AES
```

### 리포지토리 정책 설정

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::{AWS_ACCOUNT_ID}:role/github-actions-role"
      },
      "Action": [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:BatchCheckLayerAvailability"
      ]
    }
  ]
}
```

### 이미지 스캔 설정 (선택사항)

```bash
aws ecr put-image-scanning-configuration \
  --repository-name feel-log-front \
  --image-scanning-configuration scanOnPush=true \
  --region us-east-1
```

---

## 2️⃣ CloudWatch Logs 생성

### 로그 그룹 생성

```bash
# Dev
aws logs create-log-group \
  --log-group-name /ecs/feel-log-front-dev \
  --region us-east-1

# Prod
aws logs create-log-group \
  --log-group-name /ecs/feel-log-front-prod \
  --region us-east-1

# 보관 기간 설정 (30일)
aws logs put-retention-policy \
  --log-group-name /ecs/feel-log-front-dev \
  --retention-in-days 30 \
  --region us-east-1

aws logs put-retention-policy \
  --log-group-name /ecs/feel-log-front-prod \
  --retention-in-days 30 \
  --region us-east-1
```

---

## 3️⃣ VPC & Security Groups 설정

### VPC 확인

```bash
# 기본 VPC 사용 또는 새로운 VPC 생성
aws ec2 describe-vpcs --region us-east-1
```

### Security Group 생성

```bash
# Dev용
aws ec2 create-security-group \
  --group-name feel-log-front-dev-sg \
  --description "Security group for feel-log-front DEV" \
  --vpc-id vpc-xxxxx \
  --region us-east-1

# Prod용
aws ec2 create-security-group \
  --group-name feel-log-front-prod-sg \
  --description "Security group for feel-log-front PROD" \
  --vpc-id vpc-xxxxx \
  --region us-east-1
```

### 인바운드 규칙 추가

```bash
# Dev (포트 3000)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0 \
  --region us-east-1

# Prod (로드 밸런서에서만)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 3000 \
  --source-group sg-alb-xxxxx \
  --region us-east-1
```

---

## 4️⃣ IAM 역할 및 정책 생성

### ECS Task Execution Role

```bash
# Trust Policy와 함께 역할 생성
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://trust-policy.json
```

**trust-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### 정책 연결

```bash
# AWS 관리 정책
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# 커스텀 정책 생성
aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name ecsTaskExecutionRolePolicy \
  --policy-document file://execution-policy.json
```

**execution-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:us-east-1:{AWS_ACCOUNT_ID}:log-group:/ecs/feel-log-front-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters",
        "ssm:GetParameter"
      ],
      "Resource": "arn:aws:ssm:us-east-1:{AWS_ACCOUNT_ID}:parameter/feel-log/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:{AWS_ACCOUNT_ID}:secret:feel-log/*"
    }
  ]
}
```

### ECS Task Role

```bash
aws iam create-role \
  --role-name ecsTaskRole \
  --assume-role-policy-document file://task-trust-policy.json
```

**task-trust-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### GitHub Actions OIDC Role

```bash
aws iam create-role \
  --role-name github-actions-role \
  --assume-role-policy-document file://github-trust-policy.json
```

**github-trust-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::{AWS_ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
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

### GitHub Actions 정책

```bash
aws iam put-role-policy \
  --role-name github-actions-role \
  --policy-name github-actions-policy \
  --policy-document file://github-policy.json
```

**github-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "arn:aws:ecr:us-east-1:{AWS_ACCOUNT_ID}:repository/feel-log-front"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:UpdateService"
      ],
      "Resource": [
        "arn:aws:ecs:us-east-1:{AWS_ACCOUNT_ID}:service/feel-log-dev-cluster/feel-log-front-dev",
        "arn:aws:ecs:us-east-1:{AWS_ACCOUNT_ID}:service/feel-log-prod-cluster/feel-log-front-prod",
        "arn:aws:ecs:us-east-1:{AWS_ACCOUNT_ID}:task-definition/feel-log-front-dev:*",
        "arn:aws:ecs:us-east-1:{AWS_ACCOUNT_ID}:task-definition/feel-log-front-prod:*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:aws:iam::{AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
        "arn:aws:iam::{AWS_ACCOUNT_ID}:role/ecsTaskRole"
      ]
    }
  ]
}
```

---

## 5️⃣ ECS 클러스터 생성

### Dev 클러스터

```bash
aws ecs create-cluster \
  --cluster-name feel-log-dev-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1,base=1 \
  --region us-east-1 \
  --tags key=Environment,value=development key=Project,value=feel-log
```

### Prod 클러스터

```bash
aws ecs create-cluster \
  --cluster-name feel-log-prod-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1,base=1 \
  --region us-east-1 \
  --tags key=Environment,value=production key=Project,value=feel-log
```

---

## 6️⃣ ECS 작업 정의 등록

### Dev Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition-dev.json \
  --region us-east-1
```

### Prod Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition-prod.json \
  --region us-east-1
```

---

## 7️⃣ ECS 서비스 생성

### Dev 서비스

```bash
aws ecs create-service \
  --cluster feel-log-dev-cluster \
  --service-name feel-log-front-dev \
  --task-definition feel-log-front-dev:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --region us-east-1 \
  --tags key=Environment,value=development key=Service,value=feel-log-front
```

### Prod 서비스

```bash
aws ecs create-service \
  --cluster feel-log-prod-cluster \
  --service-name feel-log-front-prod \
  --task-definition feel-log-front-prod:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxx],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:{AWS_ACCOUNT_ID}:targetgroup/feel-log-front-tg/xxxxx,containerName=feel-log-front,containerPort=3000 \
  --region us-east-1 \
  --tags key=Environment,value=production key=Service,value=feel-log-front
```

---

## 8️⃣ Parameter Store에 환경 변수 저장

```bash
# Dev API URL
aws ssm put-parameter \
  --name /feel-log/dev/api-url \
  --value "https://api-dev.example.com" \
  --type String \
  --region us-east-1

# Prod API URL
aws ssm put-parameter \
  --name /feel-log/prod/api-url \
  --value "https://api.example.com" \
  --type String \
  --region us-east-1
```

---

## 9️⃣ Application Load Balancer 설정 (Prod)

### Target Group 생성

```bash
aws elbv2 create-target-group \
  --name feel-log-front-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-enabled \
  --health-check-path / \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 3 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region us-east-1
```

### ALB 생성 및 Listener 구성

```bash
# ALB 생성
aws elbv2 create-load-balancer \
  --name feel-log-front-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --region us-east-1

# Listener 추가
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:{AWS_ACCOUNT_ID}:loadbalancer/app/feel-log-front-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:{AWS_ACCOUNT_ID}:targetgroup/feel-log-front-tg/xxxxx \
  --region us-east-1
```

---

## 🔟 Auto Scaling 설정 (선택사항)

```bash
# Auto Scaling 대상 생성
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/feel-log-prod-cluster/feel-log-front-prod \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region us-east-1

# 스케일링 정책 생성 (CPU 기반)
aws application-autoscaling put-scaling-policy \
  --policy-name feel-log-front-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/feel-log-prod-cluster/feel-log-front-prod \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json \
  --region us-east-1
```

**scaling-policy.json:**
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 300,
  "ScaleInCooldown": 300
}
```

---

## ✅ 검증 체크리스트

배포 전 다음을 확인하세요:

```bash
# ECR 저장소 확인
aws ecr describe-repositories \
  --repository-names feel-log-front \
  --region us-east-1

# CloudWatch 로그 그룹 확인
aws logs describe-log-groups \
  --log-group-name-prefix /ecs/feel-log-front \
  --region us-east-1

# ECS 클러스터 확인
aws ecs describe-clusters \
  --clusters feel-log-dev-cluster feel-log-prod-cluster \
  --region us-east-1

# ECS 서비스 확인
aws ecs describe-services \
  --cluster feel-log-dev-cluster \
  --services feel-log-front-dev \
  --region us-east-1

aws ecs describe-services \
  --cluster feel-log-prod-cluster \
  --services feel-log-front-prod \
  --region us-east-1

# IAM 역할 확인
aws iam get-role --role-name ecsTaskExecutionRole
aws iam get-role --role-name ecsTaskRole
aws iam get-role --role-name github-actions-role
```

---

**마지막 업데이트**: 2026-04-25
