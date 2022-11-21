// 제네릭(Generic)

// Generic은 재사용을 목적으로 함수나 클래스의 선언 시점이 아닌, 사용 시점에 타입을 선언할 수 있는 방법을 제공합니다.

//     타입을 인수로 받아서 사용한다고 이해하면 쉽습니다.

// 다음 예제는 toArray 함수가 인수로 받은 값을 배열로 반환하도록 작성되었습니다.
// 매개 변수가 Number 타입만 허용하기 때문에 String 타입을 인수로 하는 함수 호출에서 에러가 발생합니다.

function toArray(a: number, b: number): number[] {
    return [a, b];
}
toArray(1, 2);
toArray("1", "2"); // Error - TS2345: Argument of type '"1"' is not assignable to parameter of type 'number'.

// 조금 더 범용적으로 만들기 위해 유니언 방식을 사용했습니다.
// 이제 String 타입을 인수로 받을 수 있지만, 가독성이 떨어지고 새로운 문제도 발생했습니다.
// 세 번째 호출을 보면 의도치 않게 Number와 String 타입을 동시에 받을 수 있게 되었습니다.

function toArray(a: number | string, b: number | string): (number | string)[] {
    return [a, b];
}
toArray(1, 2); // Only Number
toArray("1", "2"); // Only String
toArray(1, "2"); // Number & String

// 이번에는 Generic을 사용합니다.
// 함수 이름 우측에 <T>를 작성해 시작합니다.
// T는 타입 변수(Type variable)로 사용자가 제공한 타입으로 변환될 식별자입니다.
// 이제 세 번째 호출은 의도적으로 Number와 String 타입을 동시에 받을 수 있습니다.(혹은 유니언을 사용하지 않으면 에러가 발생합니다)

//     타입 변수는 매개 변수처럼 원하는 이름으로 지정할 수 있습니다.

function toArray<T>(a: T, b: T): T[] {
    return [a, b];
}

toArray<number>(1, 2);
toArray<string>("1", "2");
toArray<string | number>(1, "2");
toArray<number>(1, "2"); // Error

// 타입 추론을 활용해, 사용 시점에 타입을 제공하지 않을 수 있습니다.

function toArray<T>(a: T, b: T): T[] {
    return [a, b];
}

toArray(1, 2);
toArray("1", "2");
toArray(1, "2"); // Error
