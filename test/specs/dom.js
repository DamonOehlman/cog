describe('dom', function() {
    it('can create a div', function() {
        expect(_dom.create('div').tagName).toEqual('DIV');
    });
    
    it('can set common attribute values', function() {
        var element = _dom.create('div', { className: 'test' });
        expect(element.className).toEqual('test');
    });
    
    it('can set tag specific attribute values', function() {
        var element = _dom.create('canvas', { width: 300, height: 300 });
        expect(element.width).toEqual(300);
        expect(element.height).toEqual(300);
    });
    
    it('can set css style properties', function() {
        var element = _dom.create('div', {}, { 'background-color': 'red' });
        expect(element.style['background-color']).toEqual('red');
    });
});