var runTest = function(testFunction, silent) {
    for(var index = 0; index < testCases.length; index++) {
        var words = testCases[index],
            response = null;

        try{
            response = anagramTest(words[0], words[1]);
        } catch(err) {
            response = 'ERROR';
        }

        if(!silent) {
            console.log('    [', response, ']', words);
        }
    }
};

function benchmark (method) {
  var author = null,
      start = +(new Date);

  method && method(function (callback) {
    var end = +(new Date);
    var difference = end - start;

    callback && callback(start, end, { ms: difference });
  });
}

function clock(start, end, difference) {
    console.log('[' + author + '] ' + difference.ms + 'ms!');
};

console.log('\n\nBenchmark: ');
console.log('Tony:');
runTest(anagramTest);

console.log('\n\nBenchmark: ');
console.log('Alonso:');
runTest(isAnagram);

benchmark(function(next){
    author = 'Tony';

    for(i=0;i<10000;i++)
        runTest(anagramTest, true);

    next(clock);
});

benchmark(function(next){
    author = 'Alonso';

    for(i=0;i<10000;i++)
        runTest(isAnagram, true);

    next(clock);
});