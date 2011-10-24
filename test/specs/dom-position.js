describe('dom position tests', function() {
    // create a test container
    var container = _dom.create('div', {}, { 
            background: 'lime', 
            width: '500px', 
            height: '500px',
            position: 'absolute',
            top: '0px',
            left: '0px'
        }),
        el = _dom.create('div', {}, { background: 'navy', width: '100px', height: '100px' });
        
    container.appendChild(el);
    
    beforeEach(function() {
        document.body.appendChild(container);
    });
    
    afterEach(function() {
        document.body.removeChild(container);
    });
    
    it('should be able to position an element in the top left', function() {
        _dom.position(el, 'top left');
        expect(el.offsetLeft).toEqual(0);
        expect(el.offsetTop).toEqual(0);
    });
    
    it('should be able to position an element in the bottom right', function() {
        _dom.position(el, 'bottom right');
        expect(el.offsetLeft).toEqual(400);
        expect(el.offsetTop).toEqual(400);
    });
    
    it('should be able to position an element in the center middle', function() {
        _dom.position(el, 'center middle');
        expect(el.offsetLeft).toEqual(200);
        expect(el.offsetTop).toEqual(200);
    });
    
    it('should be able to position and element with a positive offset', function() {
        _dom.position(el, 'top+10 left+10');
        expect(el.offsetLeft).toEqual(10);
        expect(el.offsetTop).toEqual(10);
    });
    
    it('should be able to position an element with a negative offset', function() {
        _dom.position(el, 'top-10 left-10');
        expect(el.offsetLeft).toEqual(-10);
        expect(el.offsetTop).toEqual(-10);
    });
    
    it('should be able to position an element with a positive offset (bottom right)', function() {
        _dom.position(el, 'bottom+10 right+10');
        expect(el.offsetLeft).toEqual(410);
        expect(el.offsetTop).toEqual(410);
    });
    
    it('shoud be able to position an element with a negative offset (bottom right)', function() {
        _dom.position(el, 'bottom-10 right-10');
        expect(el.offsetLeft).toEqual(390);
        expect(el.offsetTop).toEqual(390);
    });
    
    it('should be able to position an element with a negative offset (center middle)', function() {
        _dom.position(el, 'center+10 middle+10');
        expect(el.offsetLeft).toEqual(210);
        expect(el.offsetTop).toEqual(210);
    });
    
});