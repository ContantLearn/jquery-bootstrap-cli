const
    fs = require("fs"),
    path = require("path"),
    chalk = require("chalk"),
    rimraf = require("rimraf"),
    download = require("download-git-repo"),
    ora = require("ora"),
    spinner = ora("fetch template...")
;

module.exports = function(localTemPath, tmp) {
    return new Promise((resolve) => {
        // 模板文件在本地
        if(localTemPath) {

            localTemPath = path.resolve(localTemPath);

            if(!fs.existsSync(localTemPath)) {
                console.log(chalk.red(" file not found: " + localTemPath));
                process.exit();
            }

            const stat = fs.statSync(localTemPath);

            if(stat.isFile()) {
                console.log(chalk.red(" Template must be a directory "));
                process.exit();
            }

            if(stat.isDirectory()) {
                if(fs.existsSync(tmp)) {
                    rimraf.sync(tmp);
                }
                fs.mkdirSync(tmp);

                copyDir(localTemPath, tmp);
            }
            resolve();

        }
        // 模板文件在github上
        else {
            spinner.start();
            download("ContantLearn/bootstrap-template", tmp, function(err) {
                spinner.stop();
                if(err) {
                    console.log(chalk.red(err));
                }
                else {
                    resolve();
                }
            });
        }
    });
};

/*
    复制目录到临时文件夹
 */
function copyDir(src, dest) {
    let subFiles = fs.readdirSync(src);

    for (let key in subFiles) {
        let subFile = subFiles[key],
            fromPath = path.join(src, subFile),
            toPath = path.join(dest, subFile),
            stat = fs.statSync(fromPath);

        if(stat.isDirectory()) {
            fs.mkdirSync(toPath);
            copyDir(fromPath, toPath);
        }
        else if(stat.isFile()) {
            fs.copyFileSync(fromPath, toPath);
        }
    }
}