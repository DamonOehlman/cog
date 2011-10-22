describe('typetools', function() {
    it('should be able to detect an array', function() {
        var testArray = [];
        
        expect(_is(testArray, 'array')).toBeTruthy();
    });
});