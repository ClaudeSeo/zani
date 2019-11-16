# Project: Zani

Zani 프로젝트 IaC

## 명령어 모음

- 컴파일
```shell script
$ npm run build
```

- 변경 사항 감지 및 컴파일
```shell script
$ npm run watch
``` 

### 테스트 환경

- 변경 사항 확인
```shell script
$ npm run diff:test
```

- CloudFormation 템플릿 생성
```shell script
$ npm run synth:test
```

- 배포
```shell script
$ npm run deploy:test
```

### 운영 환경

- 변경 사항 확인
```shell script
$ npm run diff:prod
```

- CloudFormation 템플릿 생성
```shell script
$ npm run synth:prod
```

- 배포
```shell script
$ npm run deploy:prod
```
