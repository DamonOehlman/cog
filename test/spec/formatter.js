describe('formatter', function() {
    var twoParamFormatter = _formatter('{1} {0} Test'),
        multiFormatter = _formatter('{0}{1}{2}{1}{0}');
    
    it('should be able to parse a single replacement parameter', function() {
        var formatter = _formatter('{0} Test');
        
        expect(formatter('Good')).toEqual('Good Test');
    });

    it('should be able to replace two instances of the same parameter', function() {
        var formatter = _formatter('{0} {0} Test');
        
        expect(formatter('Good')).toEqual('Good Good Test');
    });

    it('should be able to replace multiple parameters', function() {
        expect(twoParamFormatter('Good', 'Super')).toEqual('Super Good Test');
    });
    
    it('should fail gracefully with insufficient arguments', function() {
        expect(twoParamFormatter('Good')).toEqual(' Good Test');
    });
    
    it('should no spaces between format specifiers', function() {
        expect(multiFormatter('A', 'B', 'C')).toEqual('ABCBA');
    });
});