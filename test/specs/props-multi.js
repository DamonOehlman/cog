describe('multiprop parser - multiple items', function() {
    it('can parse a space separated value string', function() {
        var props = _parseprops('x100 y100');
        expect(props.x).toEqual(100);
        expect(props.y).toEqual(100);
    });
    
    it('can parse a comma separated value string', function() {
        var props = _parseprops('x100,y100');
        expect(props.x).toEqual(100);
        expect(props.y).toEqual(100);
    });
    
    it('can parse a space separated string of simple values', function() {
        var props = _parseprops('x100 y100 r90 scale0.5 background:green');
        expect(props.x).toEqual(100);
        expect(props.y).toEqual(100);
        expect(props.r).toEqual(90);
        expect(props.scale).toEqual(0.5);
        expect(props.background).toEqual('green');
    });
    
    it('can parse a space separated value string, with complex props', function() {
        var props = _parseprops('x!100 y-200 background-color:red font-family:"Courier New"');
        expect(props.x).toEqual('!100');
        expect(props.y).toEqual(-200);
        expect(props['background-color']).toEqual('red');
        expect(props['font-family']).toEqual('Courier New');
    });
});