#bootstrap cli
###1.概述

参照vue-cli写的一个项目构建器，用于构建基于bootstrap3+jquery的前端项目

###2.使用
安装：
```
npm i jquery-boostrap-cli -g
```
命令行切换到要生成项目的目录，执行
```
bootstrap init <project-name>
```
执行后构建器会以问答的形式完成初始化配置，然后在当前目录下生成名称为project-name的项目模板
###3.自定义初始化配置
你可以在github上下载模板文件预设问答  
[Download-Template](https://github.com/ContantLearn/bootstrap-template) 

如果你对vue-cli有一定了解的话下面的内容可以无视  

下载模板之后修改模版中的meta.js
然后使用本地模版方式生成<project-name>项目，
```
bootstrap init -l templateLocalPath <project-name>
```
templateLocalPath是你下载下来模板的地址，这样你就可以定制属于你自己的模板了