// 모듈

// 타입스크립트의 모듈을 이해하기 위해선 자바스크립트 모듈에 대한 이해가 선행되어야 합니다.
// 타입스크립트 공식 문서의 많은 부분이 이 자바스크립트 모듈에 대한 설명을 포함하고 있는데, 여기서는 타입스크립트가 가지는 모듈 개념의 차이점에 대해서만 살펴보려고 합니다.
// 내보내기(export)와 가져오기(import)

// 자바스크립트 모듈의 내보내기(export)와 가져오기(import)에 대해 이해가 부족하다면 다음 MDN 문서를 우선 참고하시길 바랍니다.
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import

// 타입스크립트는 일반적인 변수나 함수, 클래스뿐만 아니라 다음과 같이 인터페이스나 타입 별칭도 모듈로 내보낼 수 있습니다.

// myTypes.ts

// 인터페이스 내보내기
export interface IUser {
  name: string;
  age: number;
}

// 타입 별칭 내보내기
export type MyType = string | number;

// 선언한 모듈(myTypes.ts) 가져오기
import { IUser, MyType } from './myTypes';

const user: IUser = {
  name: 'HEROPY',
  age: 85,
};

const something: MyType = true; // Error - TS2322: Type 'true' is not assignable to type 'MyType'.

// 타입스크립트는 CommonJS/AMD/UMD 모듈을 위해 export = ABC;, import ABC = require('abc');와 같은 내보내기와 가져오기 문법을 제공합니다.
// 이는 ES6 모듈의 export default 같이 하나의 모듈에서 하나의 객체만 내보내는 Default Export 기능을 제공합니다.

// 결국 타입스크립트에서 CommonJS/AMD/UMD 모듈은 다음과 같이 가져올 수 있습니다.
// 추가로, 컴파일 옵션에 "esModuleInterop": true를 제공하면, ES6 모듈의 Default Import 방식도 같이 사용할 수 있습니다.

// CommonJS/AMD/UMD
import ABC = require('abc');
// or
import * as ABC from 'abc';
// or `"esModuleInterop": true`
import ABC from 'abc';

// 모듈의 타입 선언(Ambient module declaration)

// 타입스크립트의 외부 자바스크립트 모듈 사용에 대해서 알아봅시다.
// 간단한 프로젝트를 생성하고 외부 모듈로 Lodash를 설치해 사용해 보겠습니다.

//     ‘모듈’ 파트의 타입스크립트 프로젝트 생성은 ‘개발환경 / TS Node’ 파트를 참고하세요.

// $ npm install lodash

// main.ts에서 Lodash 모듈의 camelCase API를 사용해 콘솔 출력하는 아주 단순한 코드를 작성합니다.
// 하지만 다음과 같이 ‘가져오기(import)’ 단계에서 에러가 발생합니다.
// 이는 타입스크립트 컴파일러가 확인할 수 있는 모듈의 타입 선언(Ambient module declaration)이 없기 때문입니다.

// main.ts

import * as _ from 'lodash'; // Error - TS2307: Cannot find module 'lodash'.

console.log(_.camelCase('import lodash module'));

// 모듈 구현(implement)과 타입 선언(declaration)이 동시에 이뤄지는 타입스크립트와 달리, 구현만 존재하는 자바스크립트 모듈(E.g. Lodash)을 사용하는 경우, 컴파일러가 이해할 수 있는 모듈의 타입 선언이 필요하며, 이를 대부분 .d.ts파일로 만들어 제공하게 됩니다.

// 그럼 이제 Lodash에 대한 타입 선언을 해봅시다.
// 다음과 같이 루트 경로에 lodash.d.ts 파일을 생성합니다.

// Ambient modules

// 기본 구조는 단순합니다.
// 모듈 가져오기(Import)가 가능하도록 module 키워드를 사용해 모듈 이름을 명시합니다.
// 그리고 그 범위 안에서, 타입(interface)을 가진 변수(_)를 선언하고 내보내기(Export)만 하면 됩니다.

//     타입스크립트 컴파일러가 이해할 수 있도록 declare 키워드를 통해 선언해야 합니다!

// lodash.d.ts

// 모듈의 타입 선언(Ambient module declaration)
declare module 'lodash' {
  // 1. 타입(인터페이스) 선언
  interface ILodash {
    camelCase(str?: string): string;
  }

  // 2. 타입(인터페이스)을 가지는 변수 선언
  const _: ILodash;

  // 3. 내보내기(CommonJS)
  export = _;
}

// 그리고 이 타입 선언이 컴파일 과정에 포함될 수 있도록 다음과 같이 ///(삼중 슬래시 지시자, Triple-slash directive)를 사용하는 참조 태그(<reference />)와 path 속성을 사용합니다.
// 넘어가기 전, 참조 태그의 특징에 대해서 몇 가지 살펴보면,

//     참조 태그로 가져오는 것은 모듈 구현이 아니라 타입 선언이기 때문에, import 키워드로 가져오지 않아야 합니다.
//     삼중 슬래시 지시자는 자바스크립트로 컴파일되면 단순 주석입니다.
//     path 속성은 가져올 타입 선언의 상대 경로를 지정하며, 확장자를 꼭 입력해야 합니다.
//     types 속성은 /// <reference types="lodash" />와 같이 모듈 이름을 지정하며, 이는 컴파일 옵션 typeRoots 와 Definitely Typed(@types)를 기준으로 합니다.

//     컴파일 옵션 typeRoots와 Definitely Typed(@types)는 뒤에서 살펴봅니다.

// 참조 태그(Triple-slash directive)
/// <reference path="./lodash.d.ts" />

import * as _ from 'lodash';

console.log(_.camelCase('import lodash module'));

// 정상적으로 콘솔 출력되는지 확인합니다.

// $ npx ts-node main.ts
// # importLodashModule

Definitely Typed(@types)

// 이전 파트에서 Lodash의 camelCase 메소드를 사용했고, 이번엔 추가로 snakeCase도 사용하려고 합니다.
// 하지만 우리는 lodash.d.ts에 snakeCase에 대한 타입 선언을 하지 않았기 때문에 다음과 같이 에러가 발생합니다.

// main.ts

/// <reference path="./lodash.d.ts" />

import * as _ from 'lodash';

console.log(_.camelCase('import lodash module'));
console.log(_.snakeCase('import lodash module')); // Error - TS2339: Property 'snakeCase' does not exist on type 'ILodash'.

// 이는 lodash.d.ts에 snakeCase에 대한 타입 선언을 하면 간단히 해결할 수 있습니다.

// lodash.d.ts

declare module 'lodash' {
  interface ILodash {
    camelCase(str?: string): string,
    snakeCase(str?: string): string // 타입 선언 추가
  }

  const _: ILodash;
  export = _;
}

// 하지만, 프로젝트에서 사용하는 모든 모듈에 대해 매번 직접 타입 선언을 작성하는 것(타이핑, Typing)은 매우 비효율적입니다.
// 그래서 우리는 여러 사용자들의 기여로 만들어진 Definitely Typed을 사용할 수 있습니다.
// 수 많은 모듈의 타입이 정의되어 있으며, 지속적으로 추가되고 있습니다.

// npm install -D @types/모듈이름으로 설치해 사용합니다.
// npm info @types/모듈이름으로 검색하면 원하는 모듈의 타입 선언이 존재하는지 확인할 수 있습니다.

// 다음과 같이 Lodash 타입 선언을 설치합니다.

// $ npm i -D @types/lodash

// 이제, 더 이상 필요치 않으니 lodash.d.ts를 삭제합니다!
// main.ts의 참조 태그(Triple-slash directive)도 같이 삭제합니다!
// 별도 설정이 없어도, 다양한 Lodash API를 사용할 수 있습니다.

// main.ts

import * as _ from 'lodash';

console.log(_.camelCase('import lodash module'));
console.log(_.snakeCase('import lodash module'));
console.log(_.kebabCase('import lodash module'));

$ npx ts-node main.ts
# importLodashModule
# import_lodash_module
# import-lodash-module

// 동작 원리는 간단합니다.
// 타입 선언 모듈(@types/lodash)은 node_modules/@types경로에 설치되며,
// 이 경로의 모든 타입 선언은 모듈 가져오기(Import)를 통해 컴파일에 자동으로 포함됩니다.


// typeRoots와 types 옵션

// 위에서 살펴본 것과 같이, 자바스크립트 모듈을 사용할 때 다음과 같이 타입 선언을 고민하지 않아도 되는 상황들이 있습니다.

//     처음부터 타입스크립트로 작성된 모듈
//     타입 선언(.d.ts 파일 등)을 같이 제공하는 자바스크립트 모듈
//     Definitely Typed(@types/모듈)에 타입 선언이 기여된 자바스크립트 모듈

// 하지만 어쩔 수 없이 직접 타입 선언을 작성(타이핑, Typing)해야 하는 다음과 같은 상황들도 고려해야 합니다.

//     타입 선언을 찾을 수 없는 자바스크립트 모듈
//     가지고 있는 타입 선언을 수정해야 하는 경우

// 위에서 작성했던 lodash.d.ts와 같이 직접 타입 선언을 작성해서 제공할 수 있으며, 이를 좀 더 쉽게 관리할 방법으로 컴파일 옵션 typeRoots를 사용할 수 있습니다.

// typeRoots 옵션을 테스트하기 위해, 새로운 프로젝트를 만들어 아래와 같이 Lodash를 설치하고 main.ts 파일을 생성합니다.

//     ‘모듈’ 파트의 타입스크립트 프로젝트 생성은 ‘개발환경 / TS Node’ 파트를 참고하세요.

// $ npm install lodash

// 역시 ‘가져오기(Import)’ 단계에서 에러가 발생하네요.

// main.ts

import * as _ from 'lodash'; // Error - TS2307: Cannot find module 'lodash'.

console.log(_.camelCase('import lodash module'));

// 이를 해결하기 위해,
// 아래와 같이 index.d.ts 파일을 types/lodash 경로에 생성하고,
// tsconfig.json 파일 컴파일 옵션으로 "typeRoots": ["./types"]를 제공합니다.
// 넘어가기 전, typeRoots 옵션의 특징에 대해서 몇 가지 살펴보면,

//     기본값은 "typeRoots": ["./node_modules/@types"]입니다.
//     typeRoots 옵션은 지정된 경로에서 index.d.ts 파일을 우선 탐색합니다.
//     index.d.ts 파일이 없다면 package.json의 types 혹은 typings 속성에 작성된 경로와 파일 이름을 탐색합니다.
//     타입 선언을 찾을 수 없으면 컴파일 오류가 발생합니다.

// types/lodash/index.d.ts

declare module 'lodash' {
  interface ILodash {
    camelCase(str?: string): string
  }
  const _: ILodash;
  export = _;
}

// TS 유틸리티 타입

// 타입스크립트에서 제공하는 여러 전역 유틸리티 타입이 있습니다.
// 이해를 돕기 위한 간단한 예제를 포함했습니다.
// 더 자세한 내용은 Utility Types를 참고하세요.

//     타입 변수 T는 타입(Type), U는 또 다른 타입, K는 속성(key)을 의미하는 약어입니다.
//     이해를 돕기 위해 타입 변수를 T는 TYPE 또는 TYPE1, U는 TYPE2, K는 KEY로 명시했습니다.

// 유틸리티 이름	설명 (대표 타입)	타입 변수
// Partial	TYPE의 모든 속성을 선택적으로 변경한 새로운 타입 반환 (인터페이스)	<TYPE>
// Required	TYPE의 모든 속성을 필수로 변경한 새로운 타입 반환 (인터페이스)	<TYPE>
// Readonly	TYPE의 모든 속성을 읽기 전용으로 변경한 새로운 타입 반환 (인터페이스)	<TYPE>
// Record	KEY를 속성으로, TYPE를 그 속성값의 타입으로 지정하는 새로운 타입 반환 (인터페이스)	<KEY, TYPE>
// Pick	TYPE에서 KEY로 속성을 선택한 새로운 타입 반환 (인터페이스)	<TYPE, KEY>
// Omit	TYPE에서 KEY로 속성을 생략하고 나머지를 선택한 새로운 타입 반환 (인터페이스)	<TYPE, KEY>
// Exclude	TYPE1에서 TYPE2를 제외한 새로운 타입 반환 (유니언)	<TYPE1, TYPE2>
// Extract	TYPE1에서 TYPE2를 추출한 새로운 타입 반환 (유니언)	<TYPE1, TYPE2>
// NonNullable	TYPE에서 null과 undefined를 제외한 새로운 타입 반환 (유니언)	<TYPE>
// Parameters	TYPE의 매개변수 타입을 새로운 튜플 타입으로 반환 (함수, 튜플)	<TYPE>
// ConstructorParameters	TYPE의 매개변수 타입을 새로운 튜플 타입으로 반환 (클래스, 튜플)	<TYPE>
// ReturnType	TYPE의 반환 타입을 새로운 타입으로 반환 (함수)	<TYPE>
// InstanceType	TYPE의 인스턴스 타입을 반환 (클래스)	<TYPE>
// ThisParameterType	TYPE의 명시적 this 매개변수 타입을 새로운 타입으로 반환 (함수)	<TYPE>
// OmitThisParameter	TYPE의 명시적 this 매개변수를 제거한 새로운 타입을 반환 (함수)	<TYPE>
// ThisType	TYPE의 this 컨텍스트(Context)를 명시, 별도 반환 없음! (인터페이스)	<TYPE>

// Partial

// TYPE의 모든 속성을 선택적(?)으로 변경한 새로운 타입을 반환합니다.

//     ‘Optional > 속성과 메소드’ 파트를 참고하세요.

// Partial<TYPE>

// interface IUser {
//   name: string,
//   age: number
// }

// const userA: IUser = { // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'IUser'.
//   name: 'A'
// };
// const userB: Partial<IUser> = {
//   name: 'B'
// };

// 위 예제의 Partial<IUser>은 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   name?: string,
//   age?: number
// }

// Required

// TYPE의 모든 속성을 필수로 변경한 새로운 타입을 반환합니다.

// Required<TYPE>

// interface IUser {
//   name?: string,
//   age?: number
// }

// const userA: IUser = {
//   name: 'A'
// };
// const userB: Required<IUser> = { // TS2741: Property 'age' is missing in type '{ name: string; }' but required in type 'Required<IUser>'.
//   name: 'B'
// };

// 위 예제의 Required<IUser>은 다음과 같이 이해할 수 있습니다.

// interface IUser {
//   name: string,
//   age: number
// }

// Readonly

// TYPE의 모든 속성을 읽기 전용(readonly)으로 변경한 새로운 타입을 반환합니다.

//     ‘인터페이스 > 읽기 전용 속성’ 파트를 참고하세요.

// Readonly<TYPE>

// interface IUser {
//   name: string,
//   age: number
// }

// const userA: IUser = {
//   name: 'A',
//   age: 12
// };
// userA.name = 'AA';

// const userB: Readonly<IUser> = {
//   name: 'B',
//   age: 13
// };
// userB.name = 'BB'; // TS2540: Cannot assign to 'name' because it is a read-only property.

// 위 예제의 Readonly<IUser>는 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   readonly name: string,
//   readonly age: number
// }

// Record

// KEY를 속성(Key)으로, TYPE를 그 속성값의 타입(Type)으로 지정하는 새로운 타입을 반환합니다.

// Record<KEY, TYPE>

// type TName = 'neo' | 'lewis';

// const developers: Record<TName, number> = {
//   neo: 12,
//   lewis: 13
// };

// 위 예제의 Record<TName, number>는 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   neo: number,
//   lewis: number
// }

// Pick

// TYPE에서 KEY로 속성을 선택한 새로운 타입을 반환합니다.
// TYPE은 속성을 가지는 인터페이스나 객체 타입이어야 합니다.

// Pick<TYPE, KEY>

// interface IUser {
//   name: string,
//   age: number,
//   email: string,
//   isValid: boolean
// }
// type TKey = 'name' | 'email';

// const user: Pick<IUser, TKey> = {
//   name: 'Neo',
//   email: 'thesecon@gmail.com',
//   age: 22 // TS2322: Type '{ name: string; email: string; age: number; }' is not assignable to type 'Pick<IUser, TKey>'.
// };

// 위 예제의 Pick<IUser, TKey>은 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   name: string,
//   email: string
// }

// Omit

// 위에서 살펴본 Pick과 반대로,
// TYPE에서 KEY로 속성을 생략하고 나머지를 선택한 새로운 타입을 반환합니다.
// TYPE은 속성을 가지는 인터페이스나 객체 타입이어야 합니다.

// Omit<TYPE, KEY>

// interface IUser {
//   name: string,
//   age: number,
//   email: string,
//   isValid: boolean
// }
// type TKey = 'name' | 'email';

// const user: Omit<IUser, TKey> = {
//   age: 22,
//   isValid: true,
//   name: 'Neo' // TS2322: Type '{ age: number; isValid: true; name: string; }' is not assignable to type 'Pick<IUser, "age" | "isValid">'.
// };

// 위 예제의 Omit<IUser, TKey>은 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   // name: string,
//   age: number,
//   // email: string,
//   isValid: boolean

// Omit

// 위에서 살펴본 Pick과 반대로,
// TYPE에서 KEY로 속성을 생략하고 나머지를 선택한 새로운 타입을 반환합니다.
// TYPE은 속성을 가지는 인터페이스나 객체 타입이어야 합니다.

// Omit<TYPE, KEY>

// interface IUser {
//   name: string,
//   age: number,
//   email: string,
//   isValid: boolean
// }
// type TKey = 'name' | 'email';

// const user: Omit<IUser, TKey> = {
//   age: 22,
//   isValid: true,
//   name: 'Neo' // TS2322: Type '{ age: number; isValid: true; name: string; }' is not assignable to type 'Pick<IUser, "age" | "isValid">'.
// };

// 위 예제의 Omit<IUser, TKey>은 다음과 같이 이해할 수 있습니다.

// interface INewType {
//   // name: string,
//   age: number,
//   // email: string,
//   isValid: boolean
// }

// Exclude

// 유니언 TYPE1에서 유니언 TYPE2를 제외한 새로운 타입을 반환합니다.

// Exclude<TYPE1, TYPE2>

// type T = string | number;

// const a: Exclude<T, number> = 'Only string';
// const b: Exclude<T, number> = 1234; // TS2322: Type '123' is not assignable to type 'string'.
// const c: T = 'String';
// const d: T = 1234;

// Extract

// 유니언 TYPE1에서 유니언 TYPE2를 추출한 새로운 타입을 반환합니다.

// Extract<TYPE1, TYPE2>

// type T = string | number;
// type U = number | boolean;

// const a: Extract<T, U> = 123;
// const b: Extract<T, U> = 'Only number'; // TS2322: Type '"Only number"' is not assignable to type 'number'.

// NonNullable

// 유니언 TYPE에서 null과 undefined를 제외한 새로운 타입을 반환합니다.

// NonNullable<TYPE>

// type T = string | number | undefined;

// const a: T = undefined;
// const b: NonNullable<T> = null; // TS2322: Type 'null' is not assignable to type 'string | number'.

// Parameters

// 함수 TYPE의 매개변수 타입을 새로운 튜플(Tuple) 타입으로 반환합니다.

// Parameters<TYPE>

// function fn(a: string | number, b: boolean) {
//   return `[${a}, ${b}]`;
// }

// const a: Parameters<typeof fn> = ['Hello', 123]; // Type 'number' is not assignable to type 'boolean'.

// 위 예제의 Parameters<typeof fn>은 다음과 같이 이해할 수 있습니다.

// [string | number, boolean]

// ConstructorParameters

// 클래스 TYPE의 매개변수 타입을 새로운 튜플 타입으로 반환합니다.

// ConstructorParameters<TYPE>

// class User {
//   constructor (public name: string, private age: number) {}
// }

// const neo = new User('Neo', 12);
// const a: ConstructorParameters<typeof User> = ['Neo', 12];
// const b: ConstructorParameters<typeof User> = ['Lewis']; // TS2741: Property '1' is missing in type '[string]' but required in type '[string, number]'.

// 위 예제의 ConstructorParameters<typeof User>은 다음과 같이 이해할 수 있습니다.

// [string, number]

// ReturnType

// 함수 TYPE의 반환(Return) 타입을 새로운 타입으로 반환합니다.

// ReturnType<TYPE>

// function fn(str: string) {
//   return str;
// }

// const a: ReturnType<typeof fn> = 'Only string';
// const b: ReturnType<typeof fn> = 1234; // TS2322: Type '123' is not assignable to type 'string'.

// InstanceType

// 클래스 TYPE의 인스턴스 타입을 반환합니다.

// InstanceType<TYPE>

// class User {
//   constructor(public name: string) {}
// }

// const neo: InstanceType<typeof User> = new User('Neo');

// ThisParameterType

// 함수 TYPE의 명시적 this 매개변수 타입을 새로운 타입으로 반환합니다.
// 함수 TYPE에 명시적 this 매개변수가 없는 경우 알 수 없는 타입(Unknown)을 반환합니다.

//     ‘함수 > this > 명시적 this’ 파트를 참고하세요.

// ThisParameterType<TYPE>

// // https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertype

// function toHex(this: Number) {
//     return this.toString(16);
// }

// function numberToString(n: ThisParameterType<typeof toHex>) {
//     return toHex.apply(n);
// }

// 위 예제에서 함수 toHex의 명시적 this 타입은 Number이고,
// 그 타입을 참고해서 함수 numberToString의 매개변수 n의 타입을 선언합니다.
// 따라서 toHex에 다른 타입의 this가 바인딩 되는 것을 방지할 수 있습니다.
// OmitThisParameter

// 함수 TYPE의 명시적 this 매개변수를 제거한 새로운 타입을 반환합니다.

// OmitThisParameter<TYPE>

// function getAge(this: typeof cat) {
//   return this.age;
// }

// // 기존 데이터
// const cat = {
//   age: 12 // Number
// };
// getAge.call(cat); // 12

// // 새로운 데이터
// const dog = {
//   age: '13' // String
// };
// getAge.call(dog); // TS2345: Argument of type '{ age: string; }' is not assignable to parameter of type '{ age: number; }'.

// 위 예제에서 데이터 cat을 기준으로 설계한 함수 getAge는 일부 다른 타입을 가지는 새로운 데이터 dog를 this로 사용할 수 없습니다.
// 하지만 OmitThisParameter를 통해 명시적 this를 제거한 새로운 타입의 함수를 만들 수 있기 때문에,
// getAge를 직접 수정하지 않고 데이터 dog를 사용할 수 있습니다.

// const getAgeForDog: OmitThisParameter<typeof getAge> = getAge;
// getAgeForDog.call(dog); // '13'

//     this.age에는 이제 어떤 값도 들어갈 수 있음을 주의합니다.

// ThisType

// TYPE의 this 컨텍스트(Context)를 명시하고 별도의 타입을 반환하지 않습니다.

// ThisType<TYPE>

// interface IUser {
//   name: string,
//   getName: () => string
// }

// function makeNeo(methods: ThisType<IUser>) {
//   return { name: 'Neo', ...methods } as IUser;
// }
// const neo = makeNeo({
//   getName() {
//     return this.name;
//   }
// });

// neo.getName(); // Neo

// 함수 makeNeo의 인수로 사용되는 메소드 getName은 내부에서 this.name을 사용하고 있기 때문에 ThisType을 통해 명시적으로 this 컨텍스트를 설정해 줍니다.
// 단, ThisType은 별도의 타입을 반환하지 않기 때문에 makeNeo 반환 값({ name: 'Neo', ...methods })에 대한 타입이 정상적으로 추론(Inference)되지 않습니다.
// 따라서 as IUser와 같이 따로 타입을 단언(Assertions)해야 neo.getName을 정상적으로 호출할 수 있습니다.