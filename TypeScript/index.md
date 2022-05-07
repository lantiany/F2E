
# 基本类型

## unknown

unknown 类型是 JavaScript 中未知类型的定义。

unknown 主要用于在很多场景下代替 any，但是保留静态类型检查。

```typescript
function test(input: unknown){
  if (typeof input === 'string') {
    console.log(input.length);
  }
  return input.length; // 报错，unknown 不能调用方法，访问属性
}
```

## void

any 表示所有类型，void 表示没有类型，即没有任何类型。

undefined 表示没有值，是 void 的一个子集。

一般用来描述函数的返回值，当我们不关心函数的返回值的时候，我们可以这样定义函数:

```typescript
function test(): void {
  console.log('test');
}
```

## never

never 类型表示的是那些永不存在的值的类型。

例如， never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never类型，当它们被永不为真的类型保护所约束时。


## null 和 undefined

TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。

默认情况下null和undefined是所有类型的子类型。 就是说你可以把 null和undefined赋值给number类型的变量。



# TypeScript 内置类型

## Partial
Partial 可以将类型的属性修改为可选属性。用来解决在一个接口中，属性是必须的，另外一个接口中，属性可选的问题。

```typescript
interface IUser {
    name: string;
    age: number;
}

type IOptionUser = Partial<IUser>;
```

## Required

Required 可以将类型的属性修改为必须属性。用来解决在一个接口中，属性是可选的，另外一个接口中，属性必须的问题。

```typescript
interface IUser {
    name?: string;
    age?: number;
}

type IRequiredUser = Required<IUser>;
```


## Readonly

Readonly 将属性修改为只读属性。

```typescript
interface IUser {
    name: string;
    age: number;
}

type IReadonlyUser = Readonly<IUser>;
```

## Pick

Pick 可以选择接口中的属性。

```typescript
interface IUser {
    name: string;
    age: number;
}

type IPickUser = Pick<IUser, 'name' | 'age'>;
```

## Omit

Omit 可以忽略接口中的属性。

```typescript
interface IUser {
    name: string;
    age: number;
    sex: number;
}

type IOmitUser = Omit<IUser, 'sex'>
```

## Exclude

Exclude 可以排除接口中的属性。

```typescript

type ExcludeA = Exclude<'a' | 'b', 'a'>

```


## Extract

与 Exclude 相反，可以从多个属性中提取属性。

```typescript
type ExtractA = Extract<'a' | 'b', 'a'>
```



# 类型断言

## as & <>


```typescript
// 尖括号 语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法
let someValue1: any = "this is a string";
let strLength1: number = (someValue as string).length;
```

## 非空断言

断言操作对象不是 null 或 undefined。

```typescript
let a: string | null | undefined;

a!.toString();
```

## 确定赋值断言

断言变量已被明确赋值。

```typescript
let a!: number;

console.log(a * 2); // 不会报错
```
