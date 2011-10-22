describe('multiprop parser - non properties', function() {
    it('does not parse instruction labels', function() {
        var props = _parseprops(':rotateRight');
        expect(props).toBeUndefined();
    });
    
    it('does not parse \'with\' instructions', function() {
        var props = _parseprops('with .box');
        expect(props).toBeUndefined();
    });
});