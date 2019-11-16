# Zani

1일 1커밋을 하기 위한 목적으로 개발되었으며, 하루에 한번 이상 커밋을 하지 않을 경우 알림을 주는 프로젝트이다.

## 설치 방법

1. 프로젝트를 내려 받는다.

```shell script
$ git clone https://github.com/ClaudeSeo/zani.git
```

2. 모듈들을 설치한다. 

```shell script
$ npm install
```

## 실행 방법

- Webhook 받는 함수 실행

```shell script
$ npm run offline:dev
```

- 알림 보내는 함수 실행 

```shell script
$ npm run invoke:notifier
```

## 배포 방법

- Github Actions 를 사용하여 마스터 브랜치에 푸시될 경우 자동 배포된다.

### 수동 배포 방법

```shell script
$ npm run deploy:prod
```
