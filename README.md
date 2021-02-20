<p align="center">
  <img width="300" src="logo.png" />
</p>

# raspberry
Raspberry is a format for expressing JSX files as plain JSON. This makes it easier to programmatically generate and modify React & React Native code.

## How it looks
```
example.raspberry.json

{
  "meta": {
    "fileName": "example",
    "export": {
      "name": "{Example}"
    }
  },
  "bodyImports": [
    {
      "name": "React",
      "from": "react"
    },
    {
      "name": "{useState}",
      "from": "react"
    }
  ],
  "body": "const x = true; const [textState, setTextState] = useState('Welcome to React Native');",
  "markup": {
    "import": {
      "name": "{View}",
      "from": "react-native"
    },
    "props": {
      "style": {
        "flexDirection": "row",
        "display": "flex",
        "alignItems": "center"
      }
    },
    "children": [
      {
        "import": {
          "name": "{TouchableOpacity}",
          "from": "react-native"
        },
        "logic": {
          "renderIf": "x === true"
        },
        "props": {
          "onPress": "() => setTextState('Rendered with Raspberry')"
        },
        "children": [
          {
            "import": {
              "name": "{Text}",
              "from": "react-native"
            },
            "props": {
              "style": {
                "textAlign": "right",
                "color": "red"
              },
              "numberOfLines": 1
            },
            "stringChild": "{textState}"
          }
        ]
      }
    ]
  }
}
```

## What that makes
```
example.tsx

import React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';

export const Test = () => {
    const x = true;
    const [textState, setTextState] = useState('Welcome to React Native');
    return (
        <View style={{"flexDirection": "row", "display": "flex", "alignItems": "center"}}>
            <TouchableOpacity
                onPress={() => setTextState('Rendered with Raspberry')}>
                <Text
                    style={{"textAlign": "right", "color": "red"}}
                    numberOfLines={1}>
                    {textState}
                </Text>
            </TouchableOpacity></View>
    )
}
```