const
    path = require("path"),
    home = require("user-home"),
    generate = require("./generate"),
    fetch = require("./fetch"),
    tmp = path.join(home, "template")
;

module.exports = function(localTemPath, dest) {
    fetch(localTemPath, tmp).then(function() {
        generate(tmp, dest);
    });
};
