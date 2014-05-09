$.fn.extend({
    yScrollTop: function (settings) {
        var options = $.fn.extend({
            distance: 500, //默认500，设置滚动距离超过distance时显示返回顶部按钮
            speed: 200, //（毫秒）返回顶部的时间
            class: null, //样式（两种方式添加样式）
            css: null//样式,{}
        }, settings);
        var target = $(this);
        var itimer;
        if (options.class) {
            target.addClass(options.class);
        }
        if (options.css) {
            target.css(options.css);
        }

        var goTop = function () {
            $("html, body").animate({ scrollTop: 0 }, options.speed);
        }
        var scrollListener = function () {
            clearTimeout(itimer);
            itimer = setTimeout(function () {
                var st = $(document).scrollTop();
                (st > options.distance) ? target.css({
                    'display': 'block'
                }) : target.hide();
            }, 100);
        };
        $(window).bind("scroll", scrollListener);
        target.bind('click', function () {
            goTop();
        });
    }
});
