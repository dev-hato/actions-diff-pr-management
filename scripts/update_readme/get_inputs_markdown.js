const fs = require('fs')
const yaml = require('js-yaml')

module.exports = () => {
  const ymlFile = yaml.load(fs.readFileSync('action.yml', 'utf8'))
  const inputs = ymlFile.inputs
  const rows = ['| 引数名 | 説明 | 必須 |', '|:---:|:---:|:---:|']

  for (const inputName of Object.keys(inputs)) {
    let row = `| ${inputName} | ${inputs[inputName].description} | `

    if (inputs[inputName].default === undefined && inputs[inputName].required) {
      row += 'O'
    }

    row += ' |'
    rows.push(row)
  }

  return rows.join('\n')
}
