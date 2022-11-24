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


// 조건부 타입(Conditional Types)

// 제약 조건과 다르게 ‘타입 구현’ 영역에서 사용하는 extends는 삼항 연산자(Conditional ternary operator)를 사용할 수 있습니다.
// 이를 조건부 타입(Conditional Types)이라고 하며 다음과 같은 문법을 가집니다.

T extends U ? X : Y

type U = string | number | boolean;

// type 식별자 = 타입 구현
type MyType<T> = T extends U ? string : never;

// interface 식별자 { 타입 구현 }
interface IUser<T> {
  name: string,
  age: T extends U ? number : never
}

// `T`는 `boolean` 타입으로 제한.
interface IUser<T extends boolean> {
  name: string,
  age: T extends true ? string : number, // `T`의 타입이 `true`인 경우 `string` 반환, 아닌 경우 `number` 반환.
  isString: T
}

const str: IUser<true> = {
  name: 'Neo',
  age: '12', // String
  isString: true
}
const num: IUser<false> = {
  name: 'Lewis',
  age: 12, // Number
  isString: false
}

// 다음과 같이 삼항 연산자를 연속해서 사용할 수도 있습니다.

type MyType<T> =
  T extends string ? 'Str' :
  T extends number ? 'Num' :
  T extends boolean ? 'Boo' :
  T extends undefined ? 'Und' :
  T extends null ? 'Nul' :
  'Obj';

//   infer

// infer 키워드를 사용해 타입 변수의 타입 추론(Inference) 여부를 확인할 수 있습니다.
// 기본 문법은 다음과 같습니다.

//     U가 추론 가능한 타입이면 참, 아니면 거짓

// T extends infer U ? X : Y

// 유용하진 않지만, 이해를 위한 아주 간단한 예제를 살펴봅시다.
// 기본 구조는 위에서 살펴본 조건부 타입과 같습니다.

type MyType<T> = T extends infer R ? R : null;

const a: MyType<number> = 123;

// 여기서 타입 변수 R은 MyType<number>에서 받은 타입 number가 되고 infer 키워드를 통해 타입 추론이 가능한지 확인합니다.
// number 타입은 당연히 타입 추론이 가능하니 R을 반환하게 됩니다.(만약 R을 타입 추론할 수 없다면 null이 반환됩니다)
// 결과적으로 MyType<number>는 number를 반환하고 변수 a는 123을 할당할 수 있습니다.

// 이번에는 조금 더 복잡하지만 유용한 예제를 하나 살펴봅시다.
// ReturnType는 함수의 반환 값이 어떤 타입인지 반환합니다.

//     ‘TS 유틸리티 타입 > ReturnType’ 파트를 참고하세요.

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

function fn(num: number) {
  return num.toString();
}

// const a: ReturnType<typeof fn> = 'Hello';

// 위 예제에서 typeof fn은 (num: number) => string으로 반환 타입은 string입니다.
// 따라서 R은 string이고 역시 infer 키워드를 통해서 타입 추론이 가능하기 때문에 R을 반환합니다.
// 즉, string을 반환합니다.

// infer 키워드에 대한 더 자세한 내용은 공식 문서의 Type inference in conditional types 파트를 참고하세요.
// 문서 내용은 다음과 같이 간단히 정리했습니다.

//     infer 키워드는 제약 조건 extends가 아닌 조건부 타입 extends 절에서만 사용 가능
//     infer 키워드는 같은 타입 변수를 여러 위치에서 사용 가능
//         일반적인 공변성(co-variant) 위치에선 유니언 타입으로 추론
//         함수 인수인 반공변성(contra-variant) 위치에선 인터섹션 타입으로 추론
//     여러 호출 시그니처(함수 오버로드)의 경우 마지막 시그니처에서 추론