# CLAUDE.md

## 명령 원칙
- 초기 셋팅은 ```docs/PROJECT_DESIGN.md```을 읽고 셋팅한다.
- Next.js에서 hydration 문제는 ```docs/HYDRATION_GUIDE.md```을 읽고 구현한다.
- 디자인 구현 목록은 ```## 디자인 구현 목록```을 참고한다.

## 디자인 구현 목록

### 1. HouseHoldWrapper.tsx의 h2 요소의 날짜 부분

- 현재 날짜 기준으로, ```mm월 dd일 (w)``` 유지시킬 것.
- 날짜 데이터를 이용하므로, Hydration 오류 나지 않게 방지할 것

### 2. 네비게이션 푸터 구현
- 다음 이미지를 참고하여, 구현할 것.

![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오전 1.56.27.png)

### 3. 오늘의 지출 비용 부분 UI 구현하기

- 다음 이미지를 참고하여 구현

![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오후 3.16.43.png)

- 날짜 부분 스와이핑은 실제 날짜를 반영하는 것으로 하고, < >를 누를 때마다 날짜가 이동하게끔 하기
  

- 현재 날짜에 도달할 경우 >로는 이동 못하게끔 방지하기  
     

-  밑에 있는 ex) 카페 생필품 식비 부분도 날짜가 변하면 같이 변화할 수 있음 (constant 변수로 만들어서 해도 됨)  
  
  
- 날짜 부분은 Hydration 방지 전략 통해서 처리하기  
  
  
- 오늘의 지출 비용이 0원일 경우 ```아직 지출이 없어요``` 메시지를 추가하고, ```오늘의 지출 기록하러가기``` 버튼 생성하기 

### 4. 오늘의 지출 비용 상세 페이지 구현

- 기본적으로, 메인 페이지의 오늘의 지출 비용 UI에서 > 아이콘을 누르면 라우팅이 되는 형태이다.  
   
  
- 오늘의 지출 비용 constant 데이터와 UI의 싱크가 맞아야 한다.  
  
  
- 지출이 0원일 경우, 아래와 같이 표기

![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오후 4.04.59.png)

- 지출이 0원이 아닐 경우, 아래와 같이 표기

![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오후 4.06.35.png)


- 원할 경우, constant 부분 수정을 해도 좋음.  
  
  
- 전체 셀렉터를 클릭하면, 최신순, 금액 높은 순, 금액 낮은 순으로 셀렉터 버튼이 나타나기.  
  
  
- 각 버튼을 누르면, 그 상태에 맞게 정렬하도록 처리

### 5. 가계부 기록 수입 페이지 구현

- 헤더 디자인은 위의 오늘의 지출 비용 상세 페이지의 헤더 디자인과 똑같이 하자.  
  
  
- 메인 페이지의 + 버튼이나, 오늘의 지출 비용이 0원인 UI에서 ```오늘의 지출 기록하러가기``` 버튼을 누를 시 위 페이지로 이동하게끔 한다.  
  
  
- 전체적인 레이아웃은 다음 이미지를 참고하여 구현하라. (빨간색 그리드는 레이아웃을 시각화 하는 UI이므로 실제 UI에는 적용되면 안된다.)
  
 ![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오후 7.21.30.png)

### 6. 가계부 기록 수입 페이지 바텀시트 구현하기

- 바텀 시트는 카테고리 혹은 메모 버튼을 눌렀을 때 나타나도록 한다.  
  
  
- 바텀 시트는 반드시 공통 컴포넌트로 관리하여 공유하여 사용하도록 한다.   
  
  
- 다음 첨부된 이미지와 같은 UI로 구현하자.

![](/Users/sejoongkim/Desktop/private-project/Team_Projects/feel-log-front/public/implements/스크린샷 2026-04-21 오후 7.51.06.png)