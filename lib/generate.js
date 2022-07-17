const
    path = require("path"),
    inquirer = require("inquirer"),
    Metalsmith = require('metalsmith'),
    Handlebars = require('handlebars'),
    rimraf = require("rimraf"),
    chalk = require("chalk"),
    ora = require("ora"),
    spinner = ora("generate project..."),
    spawn = require('child_process').spawn
;

module.exports = function(tmp, dest) {
    const
        js = path.join(tmp, "meta.js"),
        meta = require(path.resolve(js))
    ;

    let prompts = meta.prompts, asks = [];

    prompts.name.default = dest;

    for (let name in prompts) {
        asks.push(Object.assign({name: name}, prompts[name]));
    }

    inquirer.prompt(asks)
        .then(answers => {
        // console.log(answers);
        return generator(answers, path.join(tmp, "template"), path.join(process.cwd(), dest))
    }).then((answers) => {
        rimraf.sync(tmp);
        console.log(chalk.yellow("generator complete"));
        if(answers.autoInstall) {
            const cwd = path.join(process.cwd(), dest);
            runCommand("npm", ["install"], {
                cwd
            })
        }
    }, error => {
        console.log("reject error = " + error);
    });
};

function runCommand(cmd, args, options) {
    return new Promise((resolve, reject) => {
        const spwan = spawn(
            cmd,
            args,
            Object.assign(
                {
                    cwd: process.cwd(),
                    stdio: 'inherit',
                    shell: true,
                },
                options
            )
        );

        spwan.on('exit', () => {
            resolve()
        })
    })
}

function generator(metadata, src, dest) {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }

    return new Promise((resolve, reject) => {
        spinner.start();
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata();
                Object.keys(files).forEach(fileName => {
                    let reg = /^(node_modules)|(\.idea)|(\.DS_Store)|(.jpg$)|(.png$)/;
                    if(!reg.test(fileName)) {
                        const t = files[fileName].contents.toString();
                        files[fileName].contents = new Buffer(Handlebars.compile(t)(meta));
                    }
                });
                done()
            }).build(err => {
            err ? reject(err) : resolve(metadata);
            spinner.stop();
        })
    })
}