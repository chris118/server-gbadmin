module.exports = {
    format : function (str, arguments) {
        var args = arguments;
        return str.replace(/{(\d+)}/g,
            function(m,i){
                return args[i];
            });
    },
    trim : function (str, arguments) {
        return '';
    },

    responseJson : function (res, result) {
        console.log(result);
        if(typeof result === 'undefined'){
            res.json({
                code : 200,
                msg: '无结果',
                data: null
            });
        }else {
            res.json({
                code : 200,
                msg: 'success',
                data: result
            });
        }
    }
};