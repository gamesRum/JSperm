function anagramTest(word1, word2) {
    var chars1 = word1.split('').sort().join(),
        chars2 = word2.split('').sort().join();
    return chars1 === chars2;
}

function isAnagram(first, second){
    return first.length === second.length
	    || isAnagram(first.substr(1), second.replace(str1.charAt(0),''));
}
