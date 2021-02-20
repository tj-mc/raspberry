#!/usr/bin/env node
// Usage
// node raspberryToJSX path/to/input.raspberry.json path/to/output.jsx

const hrStart = process.hrtime()
const fs = require('fs')

//Input and output paths
const path = {
    input: process.argv[2],
    output: process.argv[3]
}

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
 * @returns {string}
 */
const createImportStatement = (name, from) => `import ${name} from '${from}'; `

/**
 * Remove curly braces from a string
 * @param {string} string
 * @returns {string}
 */
const removeCurlyBraces = (string) => {
    const noLeft = string.replace('{', '')
    return noLeft.replace('}', '')
}

/**
 * Create a single prop from the prop object
 * @param {object} props
 * @returns {string}
 */
const createPropString = props => {
    return Object.keys(props).map(propKey => {
        const propValue = props[propKey]

        const computedValue = Object?.keys(propValue)?.length > 0 ? JSON.stringify(propValue) : propValue

        const finalValue = (arrowFunctionRegex.test(computedValue) || classicFunctionRegex.test(computedValue) ? eval(computedValue) : computedValue)

        return `${propKey}={${finalValue}}`
    })?.join(' ') || ''
}

/**
 * Return a 2 part conditional rendering statements
 * Example output:
 * [
 *      '{x === true &&',
 *      '}'
 * ]
 *
 * For simplicity sake, this does not support a ternary expression,
 * only the short circuit style. You can achieve equivalent behaviour
 * using 2 short-circuit expressions.
 *
 * @param {string} booleanReturnExpression
 * @returns {[string, string]}
 */
const createConditionalRenderingMarkup = (booleanReturnExpression) => {
    if (booleanReturnExpression) {
        return [
            `{${booleanReturnExpression} &&`,
            `}`
        ]
    } else {
        return [
            '',
            ''
        ]
    }
}

/**
 * Create an element from the raspberry tree
 * @param element
 * @returns {{import: (*[]|[string]), markup: string}}
 */
const createElement = (element) => {
    // All imports for this component
    const imports = [createImportStatement(element.import.name, element.import.from)]

    // Every nested element (recursive)
    const childElements = element?.children?.map((child) => createElement(child))
    const childElementImports = childElements?.map(child => child.import)

    const childString = element?.stringChild

    const elementName = removeCurlyBraces(element.import.name)
    const propString = createPropString(element.props)

    const conditionalRenderingMarkupArray = createConditionalRenderingMarkup(element?.logic?.renderIf)

    const childMarkupString = childElements?.map(child => child.markup)?.join('') || childString
    const nonConditionalMarkup = `<${elementName} ${propString}>${childMarkupString}</${elementName}>`
    const conditionalMarkup = `${conditionalRenderingMarkupArray[0]}${nonConditionalMarkup}${conditionalRenderingMarkupArray[1]}`

    return {
        import: childElementImports ? [...imports, ...childElementImports] : imports,
        markup: conditionalMarkup
    }
}

/**
 * Main Function
 */
const main = () => {

    // Read the file to a string
    const rFile = JSON.parse(String(fs.readFileSync(path.input)))

    // Create empty string for JSX
    const jsxFile = {
        imports: [],
        body: ''
    }

    // Create body imports
    rFile?.bodyImports.forEach(bodyImport => {
        jsxFile.imports.push(createImportStatement(bodyImport.name, bodyImport.from))
    })

    // Name of component
    jsxFile.body += `export const Test = () => {`

    // Add body (logic and expressions)
    jsxFile.body += rFile.body;

    // Start of JSX return
    jsxFile.body += 'return('

    const recursiveFromRootElement = createElement(rFile.markup)
    jsxFile.body += recursiveFromRootElement.markup
    jsxFile.imports = [...jsxFile.imports, ...recursiveFromRootElement.import]

    // End of JSX return & component
    jsxFile.body += ')}'

    // Assemble final string to write out
    const finalJsxImports = Array.from(
        // Creating a set will remove duplicates
        new Set(
            // Totally flatten nested arrays
            jsxFile.imports.flat(Infinity)
        )
    ).join('') // Create one long string

    // Join import string and body contents
    const finalJsxString = finalJsxImports + jsxFile.body

    // Write JSX File
    fs.writeFileSync(path.output, finalJsxString)

}

main()
const hrEnd = process.hrtime(hrStart)
console.log(`Wrote ${path.output} in ${hrEnd[1] / 10_000_000}ms ✨`)

