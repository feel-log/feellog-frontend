export interface GreetingMessage {
  title: string;
  secondary: string;
  image: string;
}

export const greetingMessages: GreetingMessage[] = [
  {
    title: '사고 싶은 건 한번 더 생각!',
    secondary: '작은 절약이 큰 변화를 만들어요',
    image: '/svg/gm/pig.png'
  },
  {
    title: '오늘은 지출을 줄여봐요!',
    secondary: '저녁은 배달 대신 집밥은 어때요?',
    image: '/svg/gm/rice.png'
  },
  {
    title: '지갑 대신 마음을 채워봐요',
    secondary: '공원을 산책하며 여유를 가져볼까요?',
    image: '/svg/gm/clover.png'
  },
  {
    title: '오늘은 무지출 Day!',
    secondary: '집에 느끼는 홈카페 타임!',
    image: '/svg/gm/coffee.png'
  }
]