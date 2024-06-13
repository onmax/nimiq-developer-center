import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import json2md from 'json2md'
import { consola } from 'consola'

export async function generateRpcDocs() {
  let content: Response
  let specUrl: string = ''
  let specVersion: string = ''

  try {
    // Request the latest release information
    const latestRelease = await fetch('https://github.com/nimiq/core-rs-albatross/releases/latest', { redirect: 'follow' })
    if (latestRelease.status !== 200) {
      const e = new Error(`HTTP code for fetching release ${latestRelease.status}`)
      consola.error(e)
      throw e
    }
    // Request OpenRPC document from the latest Albatross release on Github
    const releaseVersion = latestRelease.url.split('/').pop()
    specUrl = `https://github.com/nimiq/core-rs-albatross/releases/download/${releaseVersion}/openrpc-document.json`
    consola.info(`Fetching OpenRPC specification from ${specUrl}`)
    content = await fetch(specUrl)
    if (content.status !== 200) {
      const e = new Error(`HTTP code for fetching content ${content.status}`)
      consola.error(e)
      throw e
    }
  }
  catch (error) {
    consola.error(new Error(`Failed to fetch OpenRPC specification from GitHub: ${error}`))
    return { specUrl, specVersion }
  }

  // Read request body and parse the body text as JSON
  const spec = await content.json()
  specVersion = spec.info.version

  // Build folder
  const buildFolder = join(__dirname, '../../build/set-up-your-own-node/rpc-docs')
  // Read package version of generated docs, if already built
  const versionFile = join(buildFolder, '/.version')
  const methodsFile = join(buildFolder, '/methods.md')

  if (existsSync(versionFile)) {
    const generatedVersion = readFileSync(versionFile, 'utf-8')
    if (specVersion === generatedVersion) {
      if (existsSync(methodsFile)) {
        consola.info(`RPC docs ${specVersion} already generated`)
        return { specUrl, specVersion }
      }
      else { consola.warn(`RPC docs ${specVersion} already generated, but methods.md is missing. Rebuilding...`) }
    }
  }

  consola.info(`Generating RPC specification docs ${specVersion} ...`)

  const groupMethods: { tags: string[], methods: any[] }[] = spec.methods.reduce((acc, method) => {
    const tags = method.tags.map(tag => tag.name)
    const group = acc.find(g => g.tags.includes(tags[0]))
    if (group)
      group.methods.push(method)
    else
      acc.push({ tags, methods: [method] })

    return acc as { tags: string[], methods: any[] }[]
  }, [])

  const tocTemplate = `

### List of methods

<ul flex="~ gap-32" of-x-auto relative w-full class="raw" pb-16>
 {{ columns }}
</ul>\n\n`

  const columnTemplate = `
<li flex="~ col shrink-0">
  <h4 label text-12>{{ tag }}</h4>
  <nav flex="~ col" of-y-auto max-h-320 curtain-y text="13 blue">
    {{ links }}
  </nav>
</li>`

  const tocColumns = []
  for (const { tags, methods } of groupMethods) {
    const links = methods.map(method => `<a href="#${method.name.toLowerCase()}">${method.name}</a>`).join('\n\t\t')
    const tmp = columnTemplate
      .replaceAll('{{ tag }}', uppercase(tags.join(' ').replaceAll('_', ' ')))
      .replaceAll('{{ links }}', links)
    tocColumns.push(tmp)
  }

  const toc = tocTemplate.replaceAll('{{ columns }}', tocColumns.join('\n'))

  // Methods section
  const methodsMd = []

  const template = `#### \`{{ methodName }}\`

{{ description }}

<section>
  <div class="io">
  
<h4 label>Parameters</h4>

{{ parameters }}

<h4 label>Returns</h4>

{{ returns }}

</div>

::: code-group

\`\`\`JavaScript
const res = await fetch('http://127.0.0.1:8648', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: {
    "jsonrpc": "2.0",
    "method": "{{ methodName }}",
    "params": [{{ parametersValues }}],
    "id": 1
  }
});
const data = await res.json();
\`\`\`

\`\`\`Shell
curl --request POST --url http://127.0.0.1:8648
  --header 'Content-Type: application/json'
  --data '{
    "jsonrpc": "2.0",
    "method": "{{ methodName }}",
    "params": [{{ parametersValues }}],
    "id": 1
  }'
\`\`\`
:::

</section>\n\n`

  function paramToValue(param: any) {
    switch (param.schema.type) {
      case 'string': return `"${param.name}"`
      case 'number': return '0'
      case 'boolean': return 'false'
      default: return '""'
    }
  }

  for (const { methods, tags } of groupMethods) {
    methodsMd.push(addHeader('h3', uppercase(tags.join(' ').replaceAll('_', ' '))))
    for (const method of methods) {
      const parameters = method.params.map(param => `- <span font-mono>${param.name}</span>${param.required ? '*' : ''}: \`${param.schema.type}\``).join('\n')

      const parametersValues = method.params.map(paramToValue).join(', ')

      let resultProperties = ''
      const returnsObject = '$ref' in method.result.schema
      if (returnsObject) {
        const { /* title, description, */ required, properties } = spec.components.schemas[method.result.schema.$ref.split('/').at(-1)] as { title: string, description: string, required: string[], properties: { [key: string]: { title: string, type: string } } }
        resultProperties = Object.values(properties).map(({ title, type }) => `- <span font-mono>${title}</span>${required.includes(title) ? '*' : ''}: \`${type}\``).join('\n')
      }
      else {
        resultProperties = `- \`${method.result.schema.type}\``
      }
      const tmp = template
        .replaceAll('{{ methodName }}', method.name)
        .replaceAll('{{ description }}', method.description)
        .replaceAll('{{ parameters }}', parameters)
        .replaceAll('{{ parametersValues }}', parametersValues)
        .replaceAll('{{ returns }}', resultProperties)

      methodsMd.push(tmp)
    }
  }

  // Verify that destination folder exists
  if (!existsSync(buildFolder))
    mkdirSync(buildFolder)

  writeFileSync(join(buildFolder, 'methods.md'), json2md([toc, ...methodsMd]))
  writeFileSync(versionFile, specVersion)

  return { specUrl, specVersion }
}

function addHeader(size: string, text: string) {
  return { [size]: text }
}

function uppercase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
