var _Debug = true; //是否为测试环境，true为线下环境,线上发布时需要设置false

function config() {

    this._size = 20; //分页时的每页数据量

    this.bcs_host = 'http://bcs.duapp.com';
    this.bucket_article_img = 'wakao01/';

    //数据库配置
    this._db_name = _Debug ? 'wakao' : 'KoAkGOFhcTzETVyLVTdP';
    this._host = _Debug ? 'localhost' : 'sqld.duapp.com';
    this._user = _Debug ? 'root' : 'OqIG5KgoaGqVPeHghtkYTGaq';
    this._password = _Debug ? 'mysql5421' : 'qalD337NHjfPjKBXjsNG70BZwMGdeHH6';
    this._port = _Debug ? 3306 : 4050;

    this._DEBUG = _Debug;

    //正则
    this._reg_isvalid_id = /^[0-9]\d*$/; //判断是否为合法id
};


module.exports = config;
