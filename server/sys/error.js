var error = function() {
    
}
error.prototype.retError = function(msg) {
    console.log("Error Occurs : " + msg);
    return false;
}

global.ErrorInfo = new error;
