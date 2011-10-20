var fs = require('fs');

global.fc = {
    //generate a GUID
    guid : function() {
        var guid = ""; 
        for (var i = 1; i <= 32; i++){ 
            var n = Math.floor(Math.random() * 16.0).toString(16); 
            guid += n; 
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) 
                guid += "-"; 
        } 
        return guid; 
    }
    //get random
    ,random : function(n) {
        return Math.floor(Math.random() * n);
    }
    //get timestamp
    ,getTimestamp : function() {
        return Date.now();
    }
    //get object length
    ,objectLength : function(object) {
        var c = 0;
        for (var i in object) {
            if (object.hasOwnProperty(i)) ++c;
        }
        return c;
    }
    ,getXY : function(index) {
        index = index.split(',');
        return {x : parseInt(index[0]), y : parseInt(index[1])};
    }
    ,getIndex : function(x, y) {
        return x + ',' + y;
    }
    ,fix : function(float) {
        return typeof(float) === 'number' ? parseInt(float.toFixed()) : float;
    }
    ,readFile : function(path) {
        var content = fs.readFileSync(path, 'utf8');
        var array = content.split("\n");
        delete array[0];
        content = array.join("\n");
        return JSON.parse(content);
    }
    ,fill0 : function(length, origin) {
        var originLength = ('' + origin).length;
        var fillTime = length - originLength;
        var string = origin;
        for (var i = 0; i < fillTime; ++i) {
            string = '0' + string;
        }
        return string;
    }
    ,encode : function(msg) {
        return JSON.stringify(msg);
    }
}
