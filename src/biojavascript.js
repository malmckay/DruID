function reversed(str){
    if(str){
        return str.split('').reverse().join('');
    }else{
        return str;
    }
}
function complement(dnaSequence){
    return dnaSequence.split('').map(complementBasePair).join('');
}
function complementBasePair(X){
    var Y = BioJavascript_complementMappings[X];
    if(Y){return Y;}else{return X;}
}
var BioJavascript_complementMappings = {
    'c':'g','C':'G',
    'g':'c','G':'C',
    'a':'t','A':'T',
    't':'a','T':'A',
    'r':'y','R':'Y',
    'y':'r','Y':'R',
    'k':'m','K':'M',
    'm':'k','M':'K',
    'b':'v','B':'V',
    'v':'b','V':'B',
    'd':'h','D':'H',
    'h':'d','H':'D'
}
function isStrain(data){
    return /^[ACGTN\*\-]+$/i.test(trim(data));
}

function parseFasta(data, filename){
    if(data[0]!='>'){
        var lines = data.split(/\r|\n/);
        var sequence = lines.map(trim).join('').toUpperCase();
        return [{name:filename, sequence:sequence, reversed:false}]
    }else{
        var blocks = data.split(/>/);
        return blocks.filter(isNotBlank).map(blockToSequence);
    }
}

function isBlank(str){
    return str==null||str.length==0;
}
function isNotBlank(str){
    return !isBlank(str);
}

function blockToSequence(data){
    var lines = data.split(/\r|\n/);
    var name = lines.shift();
    var sequence = lines.map(trim).join('').toUpperCase();
    return {name:name, sequence:sequence, reversed:false};
    
}