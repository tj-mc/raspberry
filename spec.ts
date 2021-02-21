type RsImport = {
    name: string,
    from: string
}

type RsComponent = {
    import: RsImport,
    props: object,
    children?: [RsComponent]
    stringChild?: string,
    logic?: {
        renderIf: string
    }

}

type RsFile = {
    meta: {
        fileName: string,
        export: {
            name: string
        },
    },
    bodyImports: [RsImport],
    body: string,
    markup: RsComponent
}