<p align="center">
  <img width="300" src="logo.png" />
</p>

# Raspberry - JSX as JSON
Raspberry is a format for expressing JSX files as plain JSON. This makes it easier to programmatically generate and modify React & React Native code.

## Why?
The point of Raspberry to use some other system (GUI or command line) to generate actual React / RN code. 
This is useful for creating 'App Builder' type systems, managing your app from a CMS or programmatically generating whitelabel versions of an app. 

Raspberry differs from other JSON/XML formats as it is designed specifically for JSX. This includes state logic, hooks and conditional rendering.

Because of this, Raspberry is provided as a Node script, and is not designed to be run in the front end.

## How it looks
```json
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

As you can see, everything we would expect to find in JSX is modelled in JSON.

## What that makes
After prettifying, this is the output:
```jsx
import React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';

export const Example = () => {
    const x = true;
    const [textState, setTextState] = useState('Welcome to React Native');
    return (
        <View style={{"flexDirection": "row", "display": "flex", "alignItems": "center"}}>
            <TouchableOpacity
                onPress={() => setTextState('Rendered with Raspberry')}>
                <Text
                    style={{"textAlign": "right", "color": "red"}}
                    numberOfLines={1}
                >
                    {textState}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
```

## Converting
It's up to you to generate the Raspberry file. To convert it to JSX, simply run.
```bash
node ./raspberry-core.js path/to/input/file.raspberry.json path/to/output.jsx
```
Your file will be created, or overwritten if it already exists.

## Specification v1.0
```ts
type RsImport = {
    name: string, // {Component} for named import, or Component
    from: string  // my-package
}

type RsComponent = {
    import: RsImport,
    props: object, // Any normal props you would have in React / RN
    children?: [RsComponent]
    stringChild?: string, // Components like <Text/> take a string child.
    logic?: {
        renderIf: string // This string should return true of false when passed to eval()
    }

}

type RsFile = {
    meta: {
        fileName: string,
        export: {
            name: string // Currently only supports named export
        },
    },
    bodyImports: [RsImport], // Any imports required by the body string
    body: string, // All code that is not part of the return()
    markup: RsComponent 
}
```

## Caveats
- No support for class-based components
- Currently only supports named export

## Future Improvements
- Optimise imports automatically
- Support HOC like React.memo()
- Better system for managing 'body' logic. Currently it's just a big string, but there is surely a better way to do this.
