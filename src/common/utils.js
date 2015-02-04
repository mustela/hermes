String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var Utils = function(){};

Utils.prototype.getGravatarImageUrl = function(email){
    var MD5 = new Hashes.MD5();

    return "http://www.gravatar.com/avatar/{md5}".supplant({md5:MD5.hex(email)});
};
