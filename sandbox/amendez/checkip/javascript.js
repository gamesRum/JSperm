var checkIPTony = function(ip){
    var oct, ix, aux;

    if (typeof ip !== 'string') {
        return false;
    }

    oct = ip.split(".");

    if (oct.length !== 4) {
        return false;
    }

    for (ix = 0; ix < 4; ix += 1) {
        aux = parseInt(oct[ix]);

        if (isNaN(aux) || aux < 0 || aux > 255) {
            return false;
        }
    }

    return true;
};

var checkIPRemix = function(ip){
    var oct, ix, aux;

    if (typeof ip != 'string') return false;

    oct = ip.split(".");

    if (oct.length != 4) return false;

    for (ix = 0; ix < 4; ix ++) {
        aux = parseInt(oct[ix]);

        if (isNaN(aux) || aux < 0 || aux > 255) return false;
    }

    return true;
};

var checkIPAlonso = function(ipToCheck) {
    var result = false,
        stringLength = ipToCheck? ipToCheck.length : null;

    if(stringLength >= 7 && stringLength <= 15  ) {
        var tokens = ipToCheck.split('.'),
            dotCount = tokens.length - 1,
            validTokens = true;

        for(var index = 0; index < tokens.length; index++) {
            var token = tokens[index];

            if(token % 1 !== 0 || token.length - 1 > 3 || token < 0 || token > 255) {
                    validTokens = false;
            }
        }

        if(dotCount === 3 && validTokens) {
            result = true;
        }
    }

    return result;
};

var checkIPVidal = function(ip){
    if(!ip) return false;

    var octets = ip.split(".");

    if(octets.length != 4) return false;

    for(var i = 0; i < octets.length; i++){
        var octet = parseInt(octets[i], 10);

        if(isNaN(octet) || octet < 0 || octet > 255) return false;
    }

    return true;
};