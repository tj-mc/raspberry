#!/usr/bin/env node
// Usage
// node raspberryToJSX path/to/input.raspberry.json path/to/output.jsx

const hrStart = process.hrtime()
const fs = require('fs')

/**
 * Detect an arrow function from a string
 *
 * Valid inputs:
 * () =>
 * argument =>
 * (arg1, arg2) =>
 * (arg1) =>
 * @type {RegExp}
 */
const arrowFunctionRegex = /^\(?.*\)?.*=>/g

/**
 * Detect a classic function
 */
const classicFunctionRegex = /function/g

/**
 * Create an import statement from an import object
 * @param {string} name
 * @param {string} from
 */
const createImportStatement = (name, from) => `import ${name} from '${from}'; `


const removeCurlyBraces = string => {
    const noLeft = string.replace('{', '')
    return noLeft.replace('}', '')
}

const createPropString = props => {
    return Object.keys(props).map(propKey => {
        const propValue = props[propKey]

        const computedValue = Object?.keys(propValue)?.length > 0 ? JSON.stringify(propValue) : propValue

        const finalValue = (arrowFunctionRegex.test(computedValue) || classicFunctionRegex.test(computedValue) ? eval(computedValue) : computedValue)

        return `${propKey}={${finalValue}}`
    })?.join(' ') || ''
}

const createElement = (element) => {
    // All imports for this component
    const imports = [createImportStatement(element.import.name, element.import.from)]

    // Every nested element (recursive)
    const childElements = element?.children?.map((child) => createElement(child))
    const childElementImports = childElements?.map(child => child.import)

    const childString = element?.stringChild

    const elementName = removeCurlyBraces(element.import.name)
    const propString = createPropString(element.props)

    return {
        import: childElementImports ? [...imports, ...childElementImports] : imports,
        markup: `<${elementName} ${propString}>${childElements?.map(child => child.markup)?.join('') || childString}</${elementName}>`
    }
}


const path = {
    input: process.argv[2],
    output: process.argv[3]
}

// Read the file to a string
const rFile = JSON.parse(String(fs.readFileSync(path.input)))

// Create empty string for JSX
const jsxFile = {
    imports: [],
    body: ''
}

// Create body imports
rFile.bodyImports.forEach(bodyImport => {
    jsxFile.imports.push(createImportStatement(bodyImport.name, bodyImport.from))
})

// Name of component
jsxFile.body += 'export const Test = () => {'

// Add body (logic and expressions)
jsxFile.body += rFile.body;

// Start of JSX return
jsxFile.body += 'return('

const rootElement = createElement(rFile.markup)
jsxFile.body += rootElement.markup
jsxFile.imports.push(...rootElement.import)

// End of JSX return
jsxFile.body += ')}'

// Assemble final string to write out
// No duplicate imports
const finalJsxImports = Array.from(new Set(jsxFile.imports.flat(Infinity))).join('')

const finalJsxString = finalJsxImports + jsxFile.body

fs.writeFileSync(path.output, finalJsxString)

const hrEnd = process.hrtime(hrStart)

console.log(`Wrote ${path.output} in ${hrEnd[1] / 10_000_000}ms ✨`)

