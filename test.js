
console.log('Running tests...');


function testAddition() {
    const result = 2 + 2;
    const expected = 4;

    if (result === expected) {
        console.log('✓ Addition test passed');
        return true;
    } else {
        console.log('✗ Addition test failed');
        return false;
    }
}


function testString() {
    const result = 'Hello' + ' Jenkins';
    const expected = 'Hello Jenkins';

    if (result === expected) {
        console.log('✓ String test passed');
        return true;
    } else {
        console.log('✗ String test failed');
        return false;
    }
}


function testArray() {
    const arr = [1, 2, 3];
    const result = arr.length;
    const expected = 3;

    if (result === expected) {
        console.log('✓ Array test passed');
        return true;
    } else {
        console.log('✗ Array test failed');
        return false;
    }
}


const tests = [testAddition, testString, testArray];
let passed = 0;
let total = tests.length;

tests.forEach(test => {
    if (test()) {
        passed++;
    }
});

console.log(`\nTest Results: ${passed}/${total} tests passed`);

if (passed === total) {
    console.log('All tests passed! ✓');
    process.exit(0);
} else {
    console.log('Some tests failed! ✗');
    process.exit(1);
}