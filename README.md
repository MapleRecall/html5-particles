# html5-particles
A particle generator on HTML 5 Canvas 
<<<<<<< HEAD
=======

一个性可能能不是很好的js粒子生成器，最初是为了完成某内部技术交流会做一个创意loading的作业而写的，结果越写越偏写出了这个东西，主要用途是在指定canvas里按一定的参数生成粒子。

（最终loading的成品可以看[Demo_Loading](http://maplerecall.github.io/html5-particles/demos/demo_1.html)）

##使用方法
在您的页面中引入这个js，最简单的方法如下
```js
var mp = mapleParticles(canvas);
```
其中的canvas是需要进行绘制的canvas元素。调用该方法将返回一个对象，对象中包含配置参数对象和一些常用的方法，对参数对象进行修改可以直接反应到渲染结果，还是蛮方便的……吧……

##参数
啊参数好多好烦，直接先去[Demo_with_dat.gui](http://maplerecall.github.io/html5-particles/demos/demo.html)
里瞅瞅看效果吧。

参数是一个Object对象，带有参数的调用方法大致如下
```js
var config={
	num: 200,
        size: {
            minSize: 10,
            maxSize: 300
        },
}
var mp = mapleParticles(canvas,config);
```

当然可选的参数远不止这些（我是懒鬼不想全写了），其它的去源码里瞅瞅呗，应该都有注释……

##关于性能
说实话写这个的时候是我第一次接触canvas，能画出东西就很开心了，所以没有优化性能（好吧也不知道怎么优化\_(:3」∠)_），当开启模糊效果的时候在非webkit/brink内核的浏览器上性能十分糟糕，如果关闭模糊，不设置太多粒子的话一般使用还是没啥问题的。
```js
var config={
	blur:false//high performance
}
```
##Demos
通过不同的配置可以达到不同的效果，下面列出了几个<del>随便乱写的</del>简单的demo，大多数都开启了模糊效果，建议使用webkit/brink内核浏览器查看。
* 带有配置面板的demo，蛮好玩的：[Demo_with_dat.gui](http://maplerecall.github.io/html5-particles/demos/demo.html)
* 技术交流会的最终Loading：[Demo_Loading](http://maplerecall.github.io/html5-particles/demos/demo_1.html)
* 粉白粉白：[Love Me](http://maplerecall.github.io/html5-particles/demos/demo_2.html)
* 土豪金：[GOLDEN TIME](http://maplerecall.github.io/html5-particles/demos/demo_3.html)
* <del>天依</del>未来蓝：[SEE THE FUTURE](http://maplerecall.github.io/html5-particles/demos/demo_4.html)
* 鼠标/触摸随动：[MapleRecall](http://maplerecall.github.io/html5-particles/demos/demo_5.html)
* GalGame：[さようなら](http://maplerecall.github.io/html5-particles/demos/demo_7.html)
>>>>>>> gh-pages
