
function initWaterFall() {
    new waterFall({
        id: 'wf',//瀑布流ID
        url:'http://apitest.wakao.me/images/get',//数据请求接口，返回json格式
        size: 10,//每次请求要加载的数据条数
        colWidth: 450,//列宽
        colAmount: 2,//列数
        view:'view',
        params: { //请求数据时可向服务器发送附带参数

        }
    }).show();
}

function initScrolltop() {
    $('#gotop').yScrollTop({
        css: {
            'position': 'fixed',
            'bottom': '10px',
            'right': '10px',
            'z-index': 9999
        }
    });
}

function initPage(){
    initWaterFall();
    initScrolltop();
}

//初始化页面
initPage();




