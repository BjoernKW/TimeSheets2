describe('App', function() {

  beforeEach(function() {
      browser.get('/dist/dev');
  });

  it('should have a title', function() {
      expect(browser.getTitle()).toEqual('TimeSheets2');
  });

  it('should have <section>', function() {
      expect(element(by.css('app section')).isPresent()).toEqual(true);
  });
});
