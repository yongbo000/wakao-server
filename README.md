哇靠百科server端源码
============

    关于作者：[yongbo](http://blog.wakao.me),一个爱好移动App的前端工程师。

哇靠百科server端代码，刚接触node时，一个现学现用的项目。
客户端源码 [点这里前往](https://github.com/yongbo000/wakao-app)

### 说明

项目依赖与以下node模块

* mysql
* express
* ejs

如果没有以上全局包，进入项目目录，先执行如下命令，加载所有包依赖

    npm install －g


## Server端基于NodeJS

时间问题，Server端源码暂不开放，在这月底我将整理好Server端代码并开源出来。

**简单Server端介绍**

- 基于以下Node模块开发

    * express

    * ejs模版引擎

    * mysql

- 代码托管于百度BAE3.0（目前已经开始收费），使用了百度提供的一些云服务：

    * mysql云数据库

    * image服务

            基于image服务我制作了一个图片缩放接口 ：
            http://apitest.wakao.me/zoom?size={图片宽度}&url={图片路径}
            例如访问如下链接地址：http://apitest.wakao.me/zoom?size=200&url=http://bcs.duapp.com/imgs00/20131130/2217/2818-ceda3c727db376bcef7f9abf6fadcce8.jpg
            通过改变size值即可返回按照宽度缩放的图片。

    * bcs云存储

            我的图片、文件数据全部存放在百度云存储上，目前云存储还没有开始收费




### 致谢

[express](https://github.com/visionmedia/express)
[mysql](https://github.com/felixge/node-mysql)
[ejs](https://github.com/visionmedia/ejs)
