describe('UC 802 - Edit User Details', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Interface
    it('A user in the users list has an option to edit it');

    it('A user being edited has an option to save changes');

    it('A user being edited has an option to cancel editing');


    // Actions
    it('The admin user can edit an Ultrawide user and save details');

    it('The admin user can edit an Ultrawide user and cancel without saving details');


    // Conditions
    it('A user may not be saved with the username 'admin'');

    it('A user may not be saved with a username that is the same as for an existing active user');

    it('A user may not be saved with a username that is the same as for an existing inactive user');

    it('A user may not be saved with no username');

    it('A user may not be saved with no password');

    it('Only the admin user can save changes to users');

});
