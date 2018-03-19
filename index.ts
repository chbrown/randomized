interface Format {
  regExp: RegExp
  generate(input: string): string
}

const DIGITS = '0123456789'
const HEXA_UPPER = '0123456789ABCDEF'
const HEXA_LOWER = '0123456789abcdef'
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA_MIXED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ALPHANUMERIC_UPPER = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHANUMERIC_LOWER = '0123456789abcdefghijklmnopqrstuvwxyz'
const ALPHANUMERIC_MIXED = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function sample(population: string, length: number): string {
  const choices: string[] = []
  for (let i = 0; i < length; i++) {
    choices.push(population[(Math.random() * population.length) | 0])
  }
  return choices.join('')
}

function randomInteger(min: number, max: number): number {
  return ((Math.random() * (max - min)) + min) | 0
}

function uuid(pop: string) {
  return `${sample(pop, 8)}-${sample(pop, 4)}-${sample(pop, 4)}-${sample(pop, 4)}-${sample(pop, 12)}`
}

function mac(pop: string, separator: string) {
  return [sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2)].join(separator)
}

const predefined_formats: Format[] = [
  {
    // uppercase uuid
    regExp: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
    generate: (input) => uuid(HEXA_UPPER),
  },
  {
    // lowercase uuid
    regExp: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    generate: (input) => uuid(HEXA_LOWER),
  },
  {
    // uppercase MAC address (6 hexadecimal pairs separated by -, :, or .)
    regExp: /^[0-9A-F]{2}([-:.])[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}$/,
    generate: (input) => mac(HEXA_UPPER, input[2]),
  },
  {
    // lowercase MAC address (6 hexadecimal pairs separated by -, :, or .)
    regExp: /^[0-9a-f]{2}([-:.])[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}$/,
    generate: (input) => mac(HEXA_LOWER, input[2]),
  },
  {
    // IPv4
    regExp: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
    generate: (input) => {
      return `${randomInteger(0, 256)}.${randomInteger(0, 256)}.${randomInteger(0, 256)}.${randomInteger(0, 256)}`
    },
  },
  {
    // general digits-only
    regExp: /^[0-9]+$/,
    generate: (input) => sample(DIGITS, input.length),
  },
  {
    // general uppercase hexadecimal
    regExp: /^[0-9A-F]+$/,
    generate: (input) => sample(HEXA_UPPER, input.length),
  },
  {
    // general lowercase hexadecimal
    regExp: /^[0-9a-f]+$/,
    generate: (input) => sample(HEXA_LOWER, input.length),
  },
  {
    // general uppercase alphabetic
    regExp: /^[A-Z]+$/,
    generate: (input) => sample(ALPHA_UPPER, input.length),
  },
  {
    // general lowercase alphabetic
    regExp: /^[a-z]+$/,
    generate: (input) => sample(ALPHA_LOWER, input.length),
  },
  {
    // general mixedcase alphabetic
    regExp: /^[A-Za-z]+$/,
    generate: (input) => sample(ALPHA_MIXED, input.length),
  },
  {
    // general uppercase alphanumeric
    regExp: /^[0-9A-Z]+$/,
    generate: (input) => sample(ALPHANUMERIC_UPPER, input.length),
  },
  {
    // general lowercase alphanumeric
    regExp: /^[0-9a-z]+$/,
    generate: (input) => sample(ALPHANUMERIC_LOWER, input.length),
  },
  {
    // general mixedcase alphanumeric
    regExp: /^[0-9A-Za-z]+$/,
    generate: (input) => sample(ALPHANUMERIC_MIXED, input.length),
  },
]

export function convert(input: string): string {
  for (let i = 0, l = predefined_formats.length; i < l; i++) {
    const format = predefined_formats[i]
    if (format.regExp.test(input)) {
      return format.generate(input)
    }
  }
  throw new Error(`Unable to recognize format of input: ${input}`)
}

function readToEnd(stream: NodeJS.ReadableStream,
                   callback: (error: Error, data?: string) => void) {
  const chunks: Buffer[] = []
  stream
  .on('error', callback)
  .on('data', (chunk: Buffer | string) => {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  })
  .on('end', () => {
    callback(null, Buffer.concat(chunks).toString())
  })
}

function readWrite(input: string) {
  const [trailing_whitespace = ''] = input.match(/\s*$/)
  try {
    const output = convert(input.trim())
    process.stdout.write(output + trailing_whitespace)
  }
  catch (exception) {
    console.error(exception)
    process.exit(1)
  }
}

const usage = `randomized: Randomize strings while adhering to patterns

Usage: Input can be piped in on STDIN or provided as command line arguments.
       When run in a TTY context, it will join all command line arguments with
       a space and use that as the input. Otherwise, all command line arguments
       will be ignored and it will read STDIN until the end as the input.

Examples: pbpaste | randomized
          randomized 78.2.17.68`

export function main(argv: string[] = process.argv) {
  if (argv.indexOf('--help') > -1) {
    console.log(usage)
    process.exit()
  }

  if (process.stdin.isTTY) {
    const data = argv.slice(2).join(' ')
    readWrite(data)
  }
  else {
    readToEnd(process.stdin, (error, data) => {
      if (error) {
        console.error(`Error reading STDIN: ${error.toString()}`)
        process.exit(66) // EX_NOINPUT: cannot open input
      }
      readWrite(data)
    })
  }
}

if (require.main === module) {
  main()
}
