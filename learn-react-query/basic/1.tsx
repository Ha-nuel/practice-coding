const queryClient = useQueryClient();

queryClient.invalidateQueries('키 이름')
=> 특정 쿼리가 만료되었다는 신호를 보내 다시 fetch하게 하는 메서드, refetch를 가져와서 일일이 할 필요가 없다.

queryClient.setQueryData => 말 그대로 쿼리 데이터를 설정하고 다시 화면을 리렌더링한다. 쿼리의 캐시된 데이터를 즉시 업데이트하는 데 사용할 수 있는 동기 함수다.