// Optional

// ? 키워드를 사용하는 여러 선택적(Optional) 개념에 대해서 살펴봅시다.
// 매개 변수(Parameters)

// 우선, 타입을 선언할 때 선택적 매개 변수(Optional Parameter)를 지정할 수 있습니다.
// 다음 예제를 보면 ? 키워드를 사용해 y를 선택적 매개 변수로 지정했습니다.
// 따라서 y가 받을 인수가 없어도 에러가 발생하지 않습니다.

function add(x: number, y?: number): number {
  return x + (y || 0);
}
const sum = add(2);
console.log(sum);

// 위 예제는 정확히 다음 예제와 같습니다.
// 즉, ? 키워드 사용은 | undefined를 추가하는 것과 같습니다.

function add(x: number, y: number | undefined): number {
  return x + (y || 0);
}
const sum = add(2, undefined);
console.log(sum);

// 속성과 매소드(Properties and Methods)

// ? 키워드를 속성(Properties)과 메소드(Methods) 타입 선언에도 사용할 수 있습니다.
// 다음은 인터페이스 파트에서 살펴봤던 예제입니다.
// isAdult를 선택적 속성으로 선언하면서 더 이상 에러가 발생하지 않습니다.

interface IUser {
  name: string,
  age: number,
  isAdult?: boolean
}

let user1: IUser = {
  name: 'Neo',
  age: 123,
  isAdult: true
};

let user2: IUser = {
  name: 'Evan',
  age: 456
};

Type이나 Class에서도 사용할 수 있습니다.

interface IUser {
  name: string,
  age: number,
  isAdult?: boolean,
  validate?(): boolean
}
type TUser = {
  name: string,
  age: number,
  isAdult?: boolean,
  validate?(): boolean
}
abstract class CUser {
  abstract name: string;
  abstract age: number;
  abstract isAdult?: boolean;
  abstract validate?(): boolean;
}

// 체이닝(Chaining)

// 다음 예제는 str 속성이 undefined일 경우 toString 메소드를 사용할 수 없기 때문에 에러가 발생합니다.
// str 속성이 문자열이라는 것을 단언하면 문제를 해결할 수 있지만, 더 간단하게 선택적 체이닝(Optional Chaining) 연산자 ?.를 사용할 수 있습니다.

// 자세한 사용법은 MDN 문서를 참고하세요.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining

obj?.prop;
obj?.[expr];
arr?.[index];
func?.(args);

// Error - TS2532: Object is possibly 'undefined'.
function toString(str: string | undefined) {
  return str.toString();
}

// Type Assertion
function toString(str: string | undefined) {
  return (str as string).toString();
}

// Optional Chaining
function toString(str: string | undefined) {
  return str?.toString();
}

// 특히 && 연산자를 사용해 각 속성을 Nullish 체크(null이나 undefined를 확인)하는 부분에서 유용합니다.

// Before
if (foo && foo.bar && foo.bar.baz) {}

// After-ish
if (foo?.bar?.baz) {}

// Nullish 병합 연산자

// 일반적으로 논리 연산자 ||를 사용해 Falsy 체크(0, "", NaN, null, undefined를 확인)하는 경우가 많습니다.
// 여기서 0이나 "" 값을 유효 값으로 사용하는 경우 원치 않는 결과가 발생할 수 있는데, 이럴 때 유용한 Nullish 병합(Nullish Coalescing) 연산자 ??를 타입스크립트에서 사용할 수 있습니다.


const foo = null ?? 'Hello nullish.';
console.log(foo); // Hello nullish.

const bar = false ?? true;
console.log(bar); // false

const baz = 0 ?? 12;
console.log(baz); // 0

