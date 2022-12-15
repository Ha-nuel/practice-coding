const queryClient = useQueryClient();

queryClient.invalidateQueries('키 이름');
// => 특정 쿼리가 만료되었다는 신호를 보내 다시 fetch하게 하는 메서드, refetch를 가져와서 일일이 할 필요가 없다.

queryClient.setQueryData;
// => 말 그대로 쿼리 데이터를 설정하고 다시 화면을 리렌더링한다. 쿼리의 캐시된 데이터를 즉시 업데이트하는 데 사용할 수 있는 동기 함수다.

isSuccess: (res) => {
  setSomething(res.data);
};

// => 이런 거 하지 말자

const { data: someData } = useSomethingMutation('생략', {
  // 생략
});

const something = someData?.data;

// => 이런 식으로 하자. 똑같지만 전의 것은 state를 설정하기 때문에 다시 렌더링이 일어난다.

// select를 사용하는 법도 있다.

// state에 담는 경우가 있다면 받아온 데이터가 수정되는 것을 클라이언트에서 그려줘야할 때?
// isSuccess 안에서 setState를 쓰는 건 위의 무언가의 내용을 백엔드에서 받고 state에 담아주고 유저가 수정하는 것을 setState로 그려 주어야하는 수정하기 같은 로직에는 필요할 것 같다.

// useEffect안에서 사용되는 비동기 함수는 따로 재활용할 일이 있지않다면 useEffect안에서 선언해주고 바로 호출시키는게 더 나은 패턴!
// 첫 렌더링에만 실행되면 되는 함수인데 useEffect밖에 존재하면 리렌더링이될 때 마다 함수가 새로 할당되어서 자원이 낭비된다!

UseQueryOptions<AxiosResponse<Diary[]>, AxiosError, Diary[], (string | number)[]

// useQuery 옵션은 이런 식으로 쓰자.

// 서버에서 받아오는 것들은 react-query로, 클라이언트에서 사용하는 state는 recoil로 사용하자
// server state, client state의 분리

const { data: someData } = useSomethingMutation('생략', {
  enabled: user ? true : false
  // 생략
});

// 유저가 있을 때만 요청을 허용한다. 근데 솔직히 써도 되긴 하지만...

enabled: !!user

// 이렇게 쓰는 게 더 낫다. !를 통해 truthy, falsy를 진짜 true, false로 만들 수 있다. (타입스크립트를 쓸 때 유용)