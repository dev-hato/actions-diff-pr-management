const fs = require('fs')
const yaml = require('js-yaml')

module.exports = () => {
    const yml_file = yaml.load(fs.readFileSync('action.yml', 'utf8'))
    const inputs = yml_file.inputs
    const rows = ['| 引数名 | 説明 | 必須 |', '|:---:|:---:|:---:|']

    for (const input_name of Object.keys(inputs)) {
        let row = `| ${input_name} | ${inputs[input_name].description} | `

        if (inputs[input_name].default === undefined && inputs[input_name].required) {
            row += 'O'
        }

        row += ' |'
        rows.push(row)
    }

    return rows.join("\n")
}
