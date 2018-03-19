# randomized

[![latest version published to npm](https://badge.fury.io/js/randomized.svg)](https://www.npmjs.com/package/randomized)

Randomize string input, e.g., for documentation examples.

    npm install -g randomized

Use command line arguments:

    randomized 205.52.5.53
    > 14.141.14.129

    randomized 181df46d-b7b8-6dca-b750-d93304c99413
    > a5120c5a-2a5c-7f1f-ba21-9302f9599027

Or `/dev/stdin`:

    echo 3F5MSXGS5C74TCRNGI8I78WJPL78O6 | randomized
    > 8SOWM4XECCO66FO5P5EVZYWJAPWPXM

Or as a module:

    var randomized = require('randomized');
    var output = randomized.convert('wTUaxO87fR1a');
    console.log(output);


## License

Copyright 2015-2018 Christopher Brown.
[MIT Licensed](https://chbrown.github.io/licenses/MIT/#2015-2018).
