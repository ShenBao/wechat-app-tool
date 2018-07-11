/*
 * @Author: ShenBao 
 * @Date: 2018-07-010 16:35:57 
 * @Last Modified by: ShenBao
 * @Last Modified time: 2018-07-11 23:34:45
*/

const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const minimist = require('minimist');

const options = minimist(process.argv.slice(2))._;

const configPath = options[0];

/**
 *  delete build dist/project-name
 */

class deleteDistHandler {

    constructor() {
        console.log('-------------- please wait delete dist');

        this.fsConfig();
    }

    /**
     * 读取配置文件
     */

    fsConfig() {

        if (!configPath) {
            console.log('-------------- err start');
            console.error('缺少配置文件');
            console.log('-------------- err end');

            return;
        }

        fs.readFile(path.join(__dirname, configPath), 'utf8', (err, data) => {

            if (err) {
                console.log('-------------- fsConfig err start');
                console.log(err);
                console.log('-------------- fsConfig err end');
                return;
            }
            const configJson = JSON.parse(data);

            this.config = configJson;

            console.log(`-------------- config info`);
            console.log(this.config);
            console.log(`-------------- config end`);

            this.deleteDistFolder();

        });
    }

    /**
     * delete folder
     */

    deleteDistFolder() {

        const deletePath = path.join(__dirname, 'dist', this.config.dist);

        console.log(deletePath);

        fsExtra.remove(deletePath, (err) => {

            if (err) {
                console.log('-------------- deleteDistFolder err start');
                console.log(err);
                console.log('-------------- deleteDistFolder err end');
                return;
            }

            console.log('-------------- deleteDistFolder  success');

            console.log(`-------------- "${this.config.projectname}" 删除完成`);
            console.log(`----源文件地址：${path.join(__dirname, '.\\dist\\')}${this.config.dist}`);
            console.log(``);
        })

    }

};

const deleteDist = new deleteDistHandler();
