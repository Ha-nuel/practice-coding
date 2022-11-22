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


// 제약 조건(Constraints)

// 인터페이스나 타입 별칭을 사용하는 제네릭을 작성할 수도 있습니다.
// 다음 예제는 별도의 제약 조건(Constraints)이 없어서 모든 타입이 허용됩니다.

interface MyType<T> {
  name: string,
  value: T
}

const dataA: MyType<string> = {
  name: 'Data A',
  value: 'Hello world'
};
const dataB: MyType<number> = {
  name: 'Data B',
  value: 1234
};
const dataC: MyType<boolean> = {
  name: 'Data C',
  value: true
};
const dataD: MyType<number[]> = {
  name: 'Data D',
  value: [1, 2, 3, 4]
};

// 만약 타입 변수 T가 string과 number인 경우만 허용하려면 아래 예제와 같이 extends 키워드를 사용하는 제약 조건을 추가할 수 있습니다.
// 기본 문법은 다음과 같습니다.

T extends U

interface MyType<T extends string | number> {
  name: string,
  value: T
}

const dataA: MyType<string> = {
  name: 'Data A',
  value: 'Hello world'
};
const dataB: MyType<number> = {
  name: 'Data B',
  value: 1234
};
const dataC: MyType<boolean> = { // TS2344: Type 'boolean' does not satisfy the constraint 'string | number'.
  name: 'Data C',
  value: true
};
const dataD: MyType<number[]> = { // TS2344: Type 'number[]' does not satisfy the constraint 'string | number'.
  name: 'Data D',
  value: [1, 2, 3, 4]
};

// 대표적으로 type과 interface 키워드를 사용하는 타입 선언은 다음 예제와 같이 = 기호를 기준으로 ‘식별자’와 ‘타입 구현’으로 구분할 수 있습니다.
// 제약 조건은 ‘식별자’ 영역에서 사용하는 extends에 한합니다.

type U = string | number | boolean;

// type 식별자 = 타입 구현
type MyType<T extends U> = string | T;

// interface 식별자 { 타입 구현 }
interface IUser<T extends U> {
  name: string,
  age: T
}
