const arrowFunction = {
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
