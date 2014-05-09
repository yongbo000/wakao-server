/*!
 * waterFall v1.0.2
 * author: yongbo_
 * Weibo ID: 喜欢咬尾巴的猫
 * Date: 2012/12/5 AM
 */
function getElementByClassName(tag, className) {
    var eles = [], tag = tag || '*';
    var tags = document.getElementsByTagName(tag);
    var reg = new RegExp("\\b" + className + "\\b")
    for(var i=0; i<tags.length; i++) {
        if(reg.test(tags[i].className)) {
            eles.push(tags[i]);
        }
    }
    return eles;
}

;(function($){
function waterFall(options) {
    var _options = waterFall.prototype.options;
    for(var n in _options) { //初始化瀑布流参数
        if(options[n] != undefined) {
            this[n] = options[n];//初始化用户自定义参数
        } else {
            this[n] = _options[n];//初始化默认参数
        }
    }
    this.loadFinish = false;
    this.isLoading = false;
    this.init();
}
waterFall.prototype = {
    options: { //默认瀑布流配置参数
        id: '',
        url: '',
        view: '',//展示模版
        params: {},//加载数据时向服务器发送请求可附加参数
        colWidth: 300,
        colAmount: 3,
        startIndex: 0,
        data: [],//保存请求返回的数据
        size: 10 //每次请求返回的数据量
    },
    //加载数据前检测是否能继续加载数据
    loadDetect: function() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            //offsetTop = document.getElementById('detectDiv').offsetTop,
            H = window.innerHeight || document.documentElement.clientHeight;
            if(!this.loadFinish && !this.isLoading && this.minColHeight - scrollTop <= H) {
                this.getData();
            }
    },
    //滚动监听
    scroll: function() {
        var wf = this;
        window.onscroll = function() {
            wf.loadDetect();
        }
        return this;
    },
    //取高度最小的列
    minHeightColumn2: function() {
        //缓存列标签元素，下次使用时可直接调用，不用再次获取
        var columns = this.cols || (this.cols = getElementByClassName('div','col')), minHCol = columns[0];
        for(var i=0; i<columns.length; i++) {
            if(minHCol.offsetHeight > columns[i].offsetHeight) {
                minHCol = columns[i];
            }
        }
        return $(minHCol);
    },
    minHeightColumn: function() {
        //缓存列标签元素，下次使用时可直接调用，不用再次获取
        var columns = this.cols || (this.cols = $('.col')), minHCol = undefined;
        columns.each(function() {
            minHCol = (minHCol == undefined) ? $(this) : minHCol.height() > $(this).height() ? $(this) : minHCol;
        });
        return minHCol;
    },
    //添加请求返回的数据
    append: function(data) {
        for(var i=0; i < data.length; i++) {
            var tempViewId = this.view;
            var itemHtml = tempToHTML(tempViewId, new Array(data[i]));
            //添加到高度最小的那一列
            this.minHeightColumn2().append(itemHtml);
        }
        this.minColHeight = this.minHeightColumn2().height();
        console.log(this.minColHeight);
        return this;
    },
    //向服务器请求数据
    getData: function() {
        var self = this;
        var reqUrl = this.url;
        var paras = {
            lastId: self.startIndex
        };
        var p = this.params;
        for(var n in p) {
            paras[n] = p[n];
        }
        this.isLoading = true; //设置正在载入状态,避免持续请求
        $.getJSON(reqUrl, paras, function(response) {
            var data = response.data;
            self.startIndex = data[data.length - 1].id;
            self.append(data);
            //设置非载入状态
            self.isLoading = false;
        });
        return this;
    },
    //生成列
    createCols: function(colAmount){
        var colsHtml = '';
        for(var i = 0; i < colAmount; i++){
            colsHtml += '<div class="col"></div>';
        }
        return colsHtml;
    },
    //生成瀑布流
    createWaterFall:function(){
        var id = this.id,
            colWidth = this.colWidth,
            colAmount = this.colAmount;
        var detectDiv = '<div id="detectDiv" class="detectDiv"><span class="wf-loading">正在很费力的加载...</span></div>';
        var contentHtml = this.createCols(colAmount) + detectDiv;
        var wf_wrap = $('#'+ id);
        var colCss = {
            width: colWidth + 'px'
        };
        wf_wrap.addClass('waterFall').html(contentHtml);
        wf_wrap.find('div.col').css(colCss);
        return this;
    },
    //初始化瀑布流
    init: function() {
        this.createWaterFall();
        return this;
    },
    //展示瀑布流
    show: function(){
        this.getData().scroll();
        return this;
    }
};
window.waterFall = waterFall;//将引用放入全局变量
})(jQuery)
