/**
 * 处理buffer ，主要是更安全，能避免中文截断成乱码等问题
 * @author hechangmin@gmail.com
 * @date 2014.1.21
 * @comment 不常用，没用到的话，暂时不用关注。 如果需要对编码转换你也许会发现这个有用的。
 */

function BufferHelper() {
    var trunks = [],
        size = 0,
        buffer = 0,
        status = 0;

    function concat(buffer) {
        for (var i = 0, trunk, trunk = arguments[i++];) {
            trunks.push(trunk);
            size += trunk.length;
            status = 0;
        }
        return this;
    }

    function toBuffer() {
        if(0 === status){

            var data = new Buffer(size),
                pos = 0;

            for (var i = 0, trunk; trunk = trunks[i++];) {
                trunk.copy(data, pos);
                pos += trunk.length;
            }

            status = 1;
            buffer = data;
        }

        return buffer;
    }

    function toString() {
        return Buffer.prototype.toString.apply(toBuffer(), arguments);
    }

    return {
       toString : toString,
       toBuffer : toBuffer,
       concat : concat
    };
}

module.exports = BufferHelper();