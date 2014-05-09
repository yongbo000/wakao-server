var _Debug = false; //是否为测试环境，true为线下环境,线上发布时需要设置false


module.exports = {
    _DEBUG : _Debug,
    _db_name : _Debug ? 'wakao' : '',
    _host : _Debug ? 'localhost' : '',
    _user : _Debug ? 'root' : '',
    _password : _Debug ? 'mysql5421' : '',
    _port : _Debug ? 3306 : 4050,

    _reg_isvalid_id: /^[0-9]\d*$/

};
