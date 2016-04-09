/**
 * Created by MapleRecall on 2015/07/09.
 */

 var mapleLoading = function(canvas, config) {
    //默认参数
    var _config = {
        num: 200, //数量
        size: {
            minSize: 1, //最小尺寸
            maxSize: 50 //最大尺寸
        },
        zone: { //在画布中生成的区域，1为100%的地方
            x: [0.01, 0.99],
            y: [0.01, 0.99]
        },
        speed: { //粒子的初始速度，这个单位是什么我也不知道……
            x: [-1, 1], //x轴速度区间
            y: [-1, 1], //y轴速度区间
            ax: [-0.01, 0.01], //x轴加速度区间
            ay: [-0.01, 0.01] //y轴加速度区间
        },
        time: {
            fadeIn: 500, //生成时间
            fadeOut: 4000 //消逝时间
        },
        atmosphere: [ //色彩氛围，在指定颜色区间中随机生成颜色效果真是棒极了！
        {
            start:{
                r: 0,
                g: 160,
                b: 191,
                a: 0.3
            },
            end:{
                r: 64,
                g: 224,
                b: 255,
                a: 0.7,
            }
        }, {
            start:{
                r: 64,
                g: 191,
                b: 0, 
                a: 0.3
            },
            end:{
                r: 128,
                g: 255,
                b: 64,
                a: 0.7
            }
        }
        ],
        background: "rgba(0,0,0,0.9)", //覆盖的底色
        atmosphereBG:true,//启用氛围底色
        mode: "lighter", //画布的混合模式
        follow: false, //跟随鼠标出现
        active: 50, //鼠标随动程度
        perspective:0.2,//模拟的视差值,一般为0~1,1为无限远,负值有奇效……
        sizeToZLevel:true,//将大小映射到虚拟Z轴级别
        blur: true //模糊效果……存在性能问题_(:3」∠)_…………
    };
    //简单的默认值处理，没有克隆对象，
    if (!config) config = {};
    for (key in _config) {
        if (_config.hasOwnProperty(key) && !config.hasOwnProperty(key)) {
            config[key] = _config[key]
        }
    }

    if (canvas && canvas.getContext) {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(fun) {
                setTimeout(fun, 16)
            }
        }

        var raf;
        var isPause=true;
        var gList = []; //球球配置列表
        var tx = 0,
        ty = 0,
        mx = 0,
        my = 0,
        ox = .5,
        oy = .5; //鼠标随动相关
        var ctx = canvas.getContext("2d");
        ctx.globalCompositeOperation = "lighter"; //世界都亮起来了

        var setCanvasSize = function() {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        //随机球球生成，返回一个配置对象……
        //为什么叫RandomLight？因为本来是想做带模糊效果的光球……
        var getRandomLight = function() {
            var offsetTime=Math.random() * (config.time.fadeIn + config.time.fadeOut) * 2|0;
            var scale = Math.pow(Math.random(), 4); //缩放级别
            var zLevel=1-(1-(config.sizeToZLevel?scale:Math.random()))*(1-config.perspective);//虚拟的Z轴级别，与视觉尺寸无关
            var sr = config.size.minSize + scale * (config.size.maxSize - config.size.minSize) | 0;
            var atmosphere = config.atmosphere[Math.random() * config.atmosphere.length | 0];
            return {
                x: (config.follow ? ox : (config.zone.x[0] + Math.random() * (config.zone.x[1] - config.zone.x[0]))) * canvas.width,
                y: (config.follow ? oy : (config.zone.y[0] + Math.random() * (config.zone.y[1] - config.zone.y[0]))) * canvas.height,
                z: 0, //Todo
                zLevel:zLevel,
                sr: sr,//半径
                er: sr * 1.5,//模糊半径
                speedX: (config.speed.x[0] + Math.random() * (config.speed.x[1] - config.speed.x[0])) * zLevel,
                speedY: (config.speed.y[0] + Math.random() * (config.speed.y[1] - config.speed.y[0])) * zLevel,
                ax: (config.speed.ax[0] + Math.random() * (config.speed.ax[1] - config.speed.ax[0])) * zLevel,
                ay: (config.speed.ay[0] + Math.random() * (config.speed.ay[1] - config.speed.ay[0])) * zLevel,
                pro: 0, //起始进度,
                offsetTime: offsetTime, //生成前等待时间
                timeOut: offsetTime, //等待计时器
                color: [
                atmosphere.start.r + (Math.random() * (atmosphere.end.r - atmosphere.start.r)) | 0,
                atmosphere.start.g + (Math.random() * (atmosphere.end.g - atmosphere.start.g)) | 0,
                atmosphere.start.b + (Math.random() * (atmosphere.end.b - atmosphere.start.b)) | 0,
                atmosphere.start.a + (Math.random() * (atmosphere.end.a - atmosphere.start.a)) 
                ],
                glow: true
            };
        };

        //执行渲染，这步有极大的性能问题……
        var render = function() {

            //确认粒子数量
            if(gList.length!==config.num){
                if(gList.length<config.num){
                    for (var i = gList.length; i < config.num; i++) {
                        gList.push(getRandomLight());
                    }
                }else{
                    gList.length=config.num;

                }
            }
            //按Z轴级别模拟Z轴排序
            gList.sort(function sortNumber(a, b) {
                return a.zLevel - b.zLevel
            });

            //指数缓动？
            mx = tx - (tx - mx) * 0.95;
            my = ty - (ty - my) * 0.95;
            
            //按照前两个色彩氛围绘制渐变底色
            ctx.globalCompositeOperation = "source-over";
            if(config.atmosphereBG){
                if (config.atmosphere.length > 1) {
                    var grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    grd.addColorStop(0,
                        "rgba(" + ((config.atmosphere[0].start.r + config.atmosphere[0].end.r) / 2 | 0) + "," + ((config.atmosphere[0].start.g + config.atmosphere[0].end.g) / 2 | 0) + "," + ((config.atmosphere[0].start.b + config.atmosphere[0].end.b) / 2 | 0) + "," + "1)"
                        );
                    grd.addColorStop(1,
                        "rgba(" + ((config.atmosphere[1].start.r + config.atmosphere[1].end.r) / 2 | 0) + "," + ((config.atmosphere[1].start.g + config.atmosphere[1].end.g) / 2 | 0) + "," + ((config.atmosphere[1].start.b + config.atmosphere[1].end.b) / 2 | 0) + "," + "1)"
                        );
                    ctx.fillStyle = grd;
                } else {
                    ctx.fillStyle = "rgba(" + ((config.atmosphere[0].start.r + config.atmosphere[0].end.r) / 2 | 0) + "," + ((config.atmosphere[0].start.g + config.atmosphere[0].end.g) / 2 | 0) + "," + ((config.atmosphere[0].start.b + config.atmosphere[0].end.b) / 2 | 0) + "," + "1)"
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            //绘制背景覆盖层
            ctx.fillStyle = config.background ? config.background : "rgba(0,0,0,0.9)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //设置合成模式
            ctx.globalCompositeOperation = config.mode ? config.mode : "lighter";
            //开始绘制粒子
            var colorStrPrefix, mixOpacity, newGrd;
            for (var i = 0; i < gList.length; i++) {

                //粒子开始呈现时重新定位
                if (gList[i].timeOut>0&&(gList[i].timeOut-=16)<=0){
                    if (config.follow) {
                        gList[i].x=ox*canvas.width;
                        gList[i].y=oy*canvas.height;
                    }else{
                        gList[i].x=(config.follow ? ox : (config.zone.x[0] + Math.random() * (config.zone.x[1] - config.zone.x[0]))) * canvas.width;
                        gList[i].y=(config.follow ? oy : (config.zone.y[0] + Math.random() * (config.zone.y[1] - config.zone.y[0]))) * canvas.height;
                    }
                    
                }

                if (gList[i].timeOut<=0){
                    if (gList[i].pro > 0) {
                        gList[i].x += gList[i].speedX;
                        gList[i].y += gList[i].speedY;

                        gList[i].rx = gList[i].x + mx * gList[i].zLevel / config.size.minSize * config.active;
                        gList[i].ry = gList[i].y + my * gList[i].zLevel / config.size.minSize * config.active;

                        gList[i].speedX += gList[i].ax;
                        gList[i].speedY += gList[i].ay;

                        colorStrPrefix = "rgba(" + gList[i].color[0] + "," + gList[i].color[1] + "," + gList[i].color[2] + ",";
                        mixOpacity = gList[i].color[3] * gList[i].pro;

                        var proScale=(0.9 + gList[i].pro * 0.1);
                        if (config.blur) {
                            newGrd = ctx.createRadialGradient(
                                gList[i].rx,
                                gList[i].ry,
                                gList[i].sr * proScale,

                                gList[i].rx,
                                gList[i].ry,
                                gList[i].er * proScale
                                );
                            newGrd.addColorStop(0, colorStrPrefix + mixOpacity + ")");
                            newGrd.addColorStop(0.5, colorStrPrefix + mixOpacity * 0.25 + ")");
                            newGrd.addColorStop(1, colorStrPrefix + "0)");
                            ctx.fillStyle = newGrd;
                            ctx.fillRect(
                                gList[i].rx - gList[i].er, gList[i].ry - gList[i].er,
                                gList[i].er * 2, gList[i].er * 2
                                );
                        } else {
                            ctx.beginPath();
                            ctx.arc(gList[i].rx, gList[i].ry, gList[i].sr * proScale, 0, 2 * Math.PI);
                            ctx.fillStyle = colorStrPrefix + mixOpacity + ")";
                            ctx.fill();
                        }
                        if (gList[i].glow) {
                            gList[i].pro += (16 / config.time.fadeIn);
                            if (gList[i].pro >= 1) {
                                gList[i].glow = false;
                            }
                        } else {
                            gList[i].pro -= (16 / config.time.fadeOut);
                        }
                    } else {
                        if (gList[i].glow) {
                            gList[i].pro += (16 / config.time.fadeIn);
                        } else {
                            gList[i] = getRandomLight(gList[i].offsetTime);
                        }
                    }
                }
            }
            raf = window.requestAnimationFrame(render);
        };

        var startRender=function(){
            if(isPause){
               raf = window.requestAnimationFrame(render); 
               isPause=false;
            }
        }
        var pauseRender=function(){
            window.cancelAnimationFrame(raf);
            isPause=true;
        }
        var reset=function(){
            gList=[];
        }
        var init = function() {
            setCanvasSize();
            window.addEventListener("resize", setCanvasSize);
            canvas.addEventListener("mousemove", function(event) {
                ox = event.offsetX / canvas.width;
                oy = event.offsetY / canvas.height;
                tx = (ox - 0.5) * 2;
                ty = (oy - 0.5) * 2;
            });
            canvas.addEventListener("touchmove", function(event) {

                ox = event.touches[0].clientX / canvas.width;
                oy = event.touches[0].clientY / canvas.height;
                tx = (ox - 0.5) * 2;
                ty = (oy - 0.5) * 2;
            });

            for (var i = 0; i < config.num; i++) {
                //setTimeout(function () {
                    gList.push(getRandomLight());
                }
                raf =  window.requestAnimationFrame(render);
                isPause=false;
            };


            init();


            return {
                config: config,
                start:startRender,
                pause:pauseRender,
                reset:reset,
                canvas:canvas
            };
        }
    };
