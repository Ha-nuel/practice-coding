const queryClient = useQueryClient();

queryClient.invalidateQueries('키 이름')
=> 특정 쿼리가 만료되었다는 신호를 보내 다시 fetch하게 하는 메서드, refetch를 가져와서 일일이 할 필요가 없다.