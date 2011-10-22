describe('multiprop parser - quoted items', function() {
    it('can parse a single item, with a quoted value', function() {
        var props = _parseprops('font-family:"Courier New"');
        expect(props['font-family']).toEqual('Courier New');
    });
});