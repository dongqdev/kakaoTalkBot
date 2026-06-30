# kakaoTalkBot

메신저봇 스크립트(JavaScript)와 Python UDP 서버 샘플을 함께 포함한 카카오톡 봇 실험 프로젝트입니다. 루트와 kakao_bot-main 하위에 유사한 구조의 봇/서버 샘플이 존재합니다.

## 주요 기능

- 메시지 수신 후 명령어 기반 응답 처리
- 코인 시세 조회 등 외부 API 연동 예제
- UDP 기반 외부 Python 서버 연동 샘플
- 카카오봇 스크립트 환경에서 동작하는 response 함수 제공

## 프로젝트 구성

- index.js: 카카오봇 스크립트(명령 처리)
- main.py: Python UDP 서버 샘플
- bot.js: 비어 있는 파일
- kakao_bot-main/: 별도 봇 서버/응답 코드 샘플

## 실행 방법

### Python UDP 서버 실행

1. 의존성 설치

```bash
pip install -r requirement.txt
```

2. 서버 실행

```bash
python main.py
```

### 카카오봇 스크립트

- 메신저봇 환경에 맞춰 index.js 또는 kakao_bot-main/bot_server.js를 등록해 사용합니다.

## 참고 사항

- requirement.txt가 비어 있어 Python 실행 시 추가 패키지 설치가 필요할 수 있습니다.
- package.json은 최소 형태이며 npm 의존성이 정의되어 있지 않습니다.

## 보안 점검 메모

- 이번 스캔 범위에서 루트/kakao_bot-main 코드에 하드코딩 API 키 패턴은 확인되지 않았습니다.
- 다만 배포 전에는 토큰/비밀번호 문자열이 없는지 재점검을 권장합니다.
