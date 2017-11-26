describe('UC 149 - Define Default Feature Aspects', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('There is a list of 8 default Feature Aspects');

    it('Each default aspect has an option to edit its text');

    it('Each default aspect has an option to save or undo edting when editing text');

    it('Each default aspect has an option to include or exclude that aspect');

    it('The edit option is only visible for a Designer');


    // Actions
    it('A Designer can set a default Feature Aspect as included');

    it('A Designer can set a default Feature Aspect as not included');

    it('A Designer can edit and save the text of a default Feature Aspect');


    // Conditions
    it('A default Feature Aspect may not be given the same name as another default Feature Aspect in the Design');

    it('Only a Designer can edit a default Feature Aspect text');

    it('Only a Designer can include or exclude a default Feature Aspect');

    it('Different Designs may have different default Feature Aspects');

    it('Default Feature Aspects in different Designs may have the same names');


    // Consequences
    it('When default Feature Aspects are changed any new Feature created subsequently has the included default aspects in the order listed.');

    it('When default Feature Aspects are changed any existing Features keep their existing Feature Aspects');

});
