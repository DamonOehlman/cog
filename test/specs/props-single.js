describe('multiprop parser - single items', function() {
    // check we can add a class to the element
    it('can parse a single item, with a positive integer value', function() {
        var props = _parseprops('x100');
        expect(props.x).toEqual(100);
    });
    
    it('can parse a single item, with a negative integer value', function() {
        var props = _parseprops('x-100');
        expect(props.x).toEqual(-100);
    });
    
    it('can parse a single item, with a positive numeric value', function() {
        var props = _parseprops('x5.5');
        expect(props.x).toEqual(5.5);
    });
    
    it('can parse a single item, with a negative numeric value', function() {
        var props = _parseprops('x-5.5');
        expect(props.x).toEqual(-5.5);
    });
    
    it('can parse a single item, with a percentage value', function() {
        var props = _parseprops('x100%');
        expect(props.x).toEqual('100%');
    });
    
    it('can parse a single item, with an absolute value', function() {
        var props = _parseprops('x!100');
        expect(props.x).toEqual('!100');
    });
    
    it('can parse a single item, with a string value', function() {
        var props = _parseprops('color:#f00');
        expect(props['color']).toEqual('#f00');
    });
    
    it('can parse a single item, with a hyphenated name', function() {
        var props = _parseprops('background-color:#f00');
        expect(props['background-color']).toEqual('#f00');
    });
});