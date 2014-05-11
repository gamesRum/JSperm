
console.log('\n\nBenchmark: ');

console.log('Remix:');
runTest(checkIPTony);

console.log('Tony:');
runTest(checkIPTony);

console.log('Alonso:');
runTest(checkIPAlonso);

console.log('Vidal:');
runTest(checkIPVidal);

benchmark(function(next){
    author = 'Remix';

    for(i=0;i<10000;i++)
        runTest(checkIPRemix, true);

    next(clock);
});

benchmark(function(next){
    author = 'Tony';

    for(i=0;i<10000;i++)
        runTest(checkIPTony, true);

    next(clock);
});

benchmark(function(next){
    author = 'Alonso';

    for(i=0;i<10000;i++)
        runTest(checkIPAlonso, true);

    next(clock);
});

benchmark(function(next){
    author = 'Vidal';

    for(i=0;i<10000;i++)
        runTest(checkIPVidal, true);

    next(clock);
});