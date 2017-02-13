describe('UC 421 - View Changes to Updatable Design Version', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A Design Component added in a Design Update has a status of Added');

    it('A Design Component whose name is modified in a Design Update has a status of Modified');

    it('A Design Component whose text is modified in a Design Update has a status of Text Changed');

    it('A Design Component removed in a Design Update has a status of Removed');

    it('A Design Component moved in an Documentation Update has a status of Moved');

    it('For Design Components whose name has changed, the new and old names are shown');

    it('For Design Components whose details have changed, the new and old details are shown');

    it('Removed Design Components are shown as struck through');


    // Actions
    it('Test summary data may be shown if hidden');

    it('Test summary data may be hidden if showing');

});
