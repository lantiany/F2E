
## 抽象语法树

> 抽象语法树（Abstract Syntax Tree）是一种用于表示语言的结构的树结构，它是一个树结构，其中每个节点都是一个语法单元，每个语法单元都有一个类型，每个类型都有一个名称。

在 [AST explorer](https://astexplorer.net/) 中，可以快速简单的探索 AST 。

随便写点什么：

```javascript
const sum = (a, b) => a + b;
```

这行代码转换成 AST 后，就是类似这样的格式，看起来像一棵树：

    Program
    ├── FunctionDeclaration
    │   ├── Identifier
    │   ├── Identifier
    │   ├── BlockStatement
    │   │   ├── ExpressionStatement
    │   │   │   ├── BinaryExpression
    │   │   │   │   ├── Identifier
    │   │   │   │   ├── Identifier
    │   │   │   │   ├── +
    │   │   │   │   └── Identifier
    │   │   │   └── ReturnStatement
    │   │   │       ├── Identifier
    │   │   │       └── Identifier
    │   │   └── Identifier
    │   └── Identifier
    └── Identifier


还可以转换成 JSON：

```json
{
    "type": "Program",
    "start": 0,
    "end": 27,
    "body": [
      {
        "type": "VariableDeclaration",
        "start": 0,
        "end": 27,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 6,
            "end": 26,
            "id": {
              "type": "Identifier",
              "start": 6,
              "end": 9,
              "name": "sum"
            },
            "init": {
              "type": "ArrowFunctionExpression",
              "start": 12,
              "end": 26,
              "id": null,
              "expression": true,
              "generator": false,
              "params": [
                {
                  "type": "Identifier",
                  "start": 13,
                  "end": 14,
                  "name": "a"
                },
                {
                  "type": "Identifier",
                  "start": 16,
                  "end": 17,
                  "name": "b"
                }
              ],
              "body": {
                "type": "BinaryExpression",
                "start": 22,
                "end": 26,
                "left": {
                  "type": "Identifier",
                  "start": 22,
                  "end": 23,
                  "name": "a"
                },
                "operator": "+",
                "right": {
                  "type": "Identifier",
                  "start": 25,
                  "end": 26,
                  "name": "b"
                }
              }
            }
          }
        ],
        "kind": "const"
      }
    ],
    "sourceType": "module"
}
```

这个 JSON 描述了这段代码的 AST。很容易看懂，就不多赘述。
