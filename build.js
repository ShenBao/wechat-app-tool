/*
 * @Author: ShenBao
 * @Date: 2018-07-010 16:35:57
 * @Last Modified by: ShenBao
 * @Last Modified time: 2018-07-16 16:41:52
*/

const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const minimist = require('minimist');

const options = minimist(process.argv.slice(2))._;

const configPath = options[0];
const version = options[1];

/**
 * build weapp to dist/project-name
 */

class buildHandler {

    constructor() {

        console.log(`-------------- please wait --------------`);

        this.fsConfig();
    }

    /**
     * 生成config的json串
     *
     * @param {Object} config
     */
    createConfigFile(config) {

        const _config = {
            // 小程序appid
            appid: config.appid,
            // 版本号
            version: config.version,
            // fundebug
            fundebugApiKey: config.fundebugApiKey,
            // aldstat
            aldstatAppKey: config.aldstatAppKey,
            // 翻页时，数量
            pageSize: config.pageSize
        };

        const _configString = JSON.stringify(_config, null, 4)

        const fileString = `const config = ${_configString};
        module.exports = config;`;

        console.log(`-------------- config start`);
        console.log(fileString);
        console.log(`-------------- config end`);

        return fileString;
    }

    /**
     * 读取配置文件
     */

    fsConfig() {

        if (!configPath) {
            console.log(`-------------- configPath err start`);
            console.error(`缺少配置文件路径`);
            console.log(`-------------- configPath err end`);
            return;
        }

        if (!version) {
            console.log(`-------------- version err start`);
            console.error(`缺少version`);
            console.log(`-------------- version err end`);
            return;
        }

        fs.readFile(path.join(__dirname, configPath), 'utf8', (err, data) => {

            if (err) {
                console.log(`-------------- fsConfig err start`);
                console.log(err);
                console.log(`-------------- fsConfig err end`);
                return;
            }
            const configJson = JSON.parse(data);

            const plist = [
                'dist',
                'appid',
                'version',
                'description',
                'projectname',
                'navigationBarTitleText',
                'pageSize',
                'aldstatAppKey',
                'fundebugApiKey'
            ];

            for (let i = 0; i < plist.length; i++) {
                if (!(configJson.hasOwnProperty(plist[i]))) {
                    console.log('-------------------------------缺少 ' + plist[i] + ' 参数-------------------------------');
                    return;
                }
            }

            configJson.version = version;
            this.config = configJson;

            console.log(`-------------- config info`);
            console.log(this.config);
            console.log(`-------------- config end`);

            setTimeout(() => {
                this.fsCopy();
            }, 100);

        });
    }

    /**
     * 拷贝文件
     */

    fsCopy() {

        const dist = `\\dist\\` + this.config.dist;
        fsExtra.copy(path.join(__dirname, `\\weapp`), path.join(__dirname, dist)).then(() => {

            console.log(`-------------- fsCopy success`);
            setTimeout(() => {
                this.appJson();
                this.projectConfig();
                this.configJs();
                this.updateConfig();
            }, 300);

        }).catch(err => {
            console.log(`-------------- fsCopy err start`);
            console.error(err);
            console.log(`-------------- fsCopy err end`);
        });
    }

    /**
     * 修改app.json配置
     */

    appJson() {

        fs.readFile(`./dist/${this.config.dist}/app.json`, 'utf8', (err, data) => {

            if (err) {
                console.log(`-------------- appJson err start`);
                console.error(err);
                console.log(`-------------- appJson err end`);
                return;
            }
            const appJson = JSON.parse(data);
            appJson.window.navigationBarTitleText = this.config.navigationBarTitleText;
            const appJsonString = JSON.stringify(appJson, null, 4);
            fs.writeFileSync(`./dist/${this.config.dist}/app.json`, appJsonString);

            console.log(`-------------- appJson success`);
        });
    }

    /**
     * 修改 projectConfig 配置
     */

    projectConfig() {

        fs.readFile(`./dist/${this.config.dist}/project.config.json`, 'utf8', (err, data) => {
            if (err) {
                console.log(`-------------- projectConfig err start`);
                console.log(err);
                console.log(`-------------- projectConfig err end`);
                return;
            }

            const projectConfig = JSON.parse(data);
            projectConfig.description = this.config.description;
            projectConfig.appid = this.config.appid;
            projectConfig.projectname = this.config.projectname;
            const projectConfigString = JSON.stringify(projectConfig, null, 4);

            fs.writeFileSync(`./dist/${this.config.dist}/project.config.json`, projectConfigString);

            console.log(`-------------- projectConfig success`);
        });
    }

    /**
     * 更新 config/config.js文件， 生成新的配置
     */

    configJs() {

        const configString = this.createConfigFile(this.config);

        fs.writeFileSync(`./dist/${this.config.dist}/config/config.js`, configString);

        console.log(`-------------- configJs success`);

    }

    updateConfig() {

        const configJson = this.config;

        configJson.setVersionUrl = `http://host.cn/setting/mini-version.json?appid=${this.config.appid}&version=${this.config.version}`;
        configJson.delVersionUrl = `http://host.cn/setting/mini-version.json?appid=${this.config.appid}&version=0`;

        const configString = JSON.stringify(configJson, null, 4);

        fs.writeFileSync(configPath, configString);

        console.log(`-------------- updateConfig success`);

        setTimeout(() => {

            console.log(``);
            console.log(`-------------- "${this.config.projectname}" 生成完成`);
            console.log(`----生成的位置在：${path.join(__dirname, '.\\dist\\')}${this.config.dist}`);
            console.log(``);

        }, 500);

    }

};

const build = new buildHandler();
