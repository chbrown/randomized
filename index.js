var DIGITS = '0123456789';
var HEXA_UPPER = '0123456789ABCDEF';
var HEXA_LOWER = '0123456789abcdef';
var ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
var ALPHA_MIXED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var ALPHANUMERIC_UPPER = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var ALPHANUMERIC_LOWER = '0123456789abcdefghijklmnopqrstuvwxyz';
var ALPHANUMERIC_MIXED = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function sample(population, length) {
    var choices = [];
    for (var i = 0; i < length; i++) {
        choices.push(population[(Math.random() * population.length) | 0]);
    }
    return choices.join('');
}
function randomInteger(min, max) {
    return ((Math.random() * (max - min)) + min) | 0;
}
function uuid(pop) {
    return sample(pop, 8) + "-" + sample(pop, 4) + "-" + sample(pop, 4) + "-" + sample(pop, 4) + "-" + sample(pop, 12);
}
function mac(pop, separator) {
    return [sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2), sample(pop, 2)].join(separator);
}
var predefined_formats = [
    {
        // uppercase uuid
        regExp: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/,
        generate: function (input) { return uuid(HEXA_UPPER); }
    },
    {
        // lowercase uuid
        regExp: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        generate: function (input) { return uuid(HEXA_LOWER); }
    },
    {
        // uppercase MAC address (6 hexadecimal pairs separated by -, :, or .)
        regExp: /^[0-9A-F]{2}([-:.])[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}\1[0-9A-F]{2}$/,
        generate: function (input) { return mac(HEXA_UPPER, input[2]); }
    },
    {
        // lowercase MAC address (6 hexadecimal pairs separated by -, :, or .)
        regExp: /^[0-9a-f]{2}([-:.])[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}\1[0-9a-f]{2}$/,
        generate: function (input) { return mac(HEXA_LOWER, input[2]); }
    },
    {
        // IPv4
        regExp: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
        generate: function (input) {
            return randomInteger(0, 256) + "." + randomInteger(0, 256) + "." + randomInteger(0, 256) + "." + randomInteger(0, 256);
        }
    },
    {
        // general digits-only
        regExp: /^[0-9]+$/,
        generate: function (input) { return sample(DIGITS, input.length); }
    },
    {
        // general uppercase hexadecimal
        regExp: /^[0-9A-F]+$/,
        generate: function (input) { return sample(HEXA_UPPER, input.length); }
    },
    {
        // general lowercase hexadecimal
        regExp: /^[0-9a-f]+$/,
        generate: function (input) { return sample(HEXA_LOWER, input.length); }
    },
    {
        // general uppercase alphabetic
        regExp: /^[A-Z]+$/,
        generate: function (input) { return sample(ALPHA_UPPER, input.length); }
    },
    {
        // general lowercase alphabetic
        regExp: /^[a-z]+$/,
        generate: function (input) { return sample(ALPHA_LOWER, input.length); }
    },
    {
        // general mixedcase alphabetic
        regExp: /^[A-Za-z]+$/,
        generate: function (input) { return sample(ALPHA_MIXED, input.length); }
    },
    {
        // general uppercase alphanumeric
        regExp: /^[0-9A-Z]+$/,
        generate: function (input) { return sample(ALPHANUMERIC_UPPER, input.length); }
    },
    {
        // general lowercase alphanumeric
        regExp: /^[0-9a-z]+$/,
        generate: function (input) { return sample(ALPHANUMERIC_LOWER, input.length); }
    },
    {
        // general mixedcase alphanumeric
        regExp: /^[0-9A-Za-z]+$/,
        generate: function (input) { return sample(ALPHANUMERIC_MIXED, input.length); }
    },
];
function convert(input) {
    for (var i = 0, format; (format = predefined_formats[i]); i++) {
        if (format.regExp.test(input)) {
            return format.generate(input);
        }
    }
    throw new Error("Unable to recognize format of input: " + input);
}
exports.convert = convert;
function readToEnd(stream, callback) {
    var chunks = [];
    stream
        .on('error', function (error) { return callback(error); })
        .on('data', function (chunk) { return chunks.push(chunk); })
        .on('end', function () { return callback(null, chunks.join('')); });
}
exports.readToEnd = readToEnd;
