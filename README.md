# Hugo 博客客户端

针对<a href="https://gohugo.io">hugo</a>所做的文章编辑工具。

目前做了mac && win版本。传送门https://github.com/jecshcier/blog_client_fe/releases


这里只是前端部分，使用webpack + react + codeMirror构建。

基于cherry框架（自己集成了electron的一些通用接口），了解源码请移步https://github.com/jecshcier/cherry2



## 主要功能

- 文章管理（新建、删除、编辑文章）

- 分类标签管理（新建、删除分类、标签、关键字）

- 图片插入

- 代码片段插入

- 一键生成静态文件

![1](https://blog.cshayne.cn/images/MjAxOS0wMy0xMS3lhpnkuobkuIDkuKpibG9n5a6i5oi356uvLi4uLm1k/1.png)

![2](https://blog.cshayne.cn/images/MjAxOS0wMy0xMS3lhpnkuobkuIDkuKpibG9n5a6i5oi356uvLi4uLm1k/2.png)


### 创建文章

选择好hugo的静态资源根目录后，可以选择对应的标签、类型、关键字创建文章，标签的创建见标签管理。

默认只会在hugo根目录/content/post目录下读取、创建文章。

![3](https://blog.cshayne.cn/images/3.png)

### 标签管理

在创建文章时，需要选择标签，这些标签需要您手动创建，创建完成后，会自动生成配置文件名称为blog.config.js存在hugo根目录中。

![4](https://blog.cshayne.cn/images/MjAxOS0wMy0xMS3lhpnkuobkuIDkuKpibG9n5a6i5oi356uvLi4uLm1k/4.png)

### 插入图片

可以拖拽或者选择的方式选择您需要在文章中插入的图片（也可直接粘贴剪切板），图片会直接复制一份到hugo的静态资源目录下。

为了让图片更好地被访问，需要您事先配置好域名，这样图片在插入完毕提交到云端后可以直接通过域名访问。

### 一键生成静态资源

生成静态资源会执行hugo命令（需要您安装好hugo cli），将静态资源一件打包在public目录下。你就可以将public目录里的所有文件放到你想要放的地方去啦！

在系统设置 - hugo命令行位置中可以设置hugo cli的位置，mac下一般为/usr/local/bin/hugo，windows取决于hugo的安装方式，如不知道hugo安装在何处，可以使用`where hugo`来查看hugo所在的位置。


---待更新         
