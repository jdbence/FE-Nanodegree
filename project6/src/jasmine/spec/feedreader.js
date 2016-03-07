/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).toBeGreaterThan(0);
        });


        /* loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('URL on each feed', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBeNull();
                expect(feed.url).not.toBe('');
            });
        });

        /* loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
         it('name on each feed', function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBeNull();
                expect(feed.name).not.toBe('');
            }); 
         });
    });

    describe('The menu', function() {
        var bodyClasses = $('body').attr('class');
        
        // reset body classes after each test
        afterEach(function() {
            $('body').attr('class', bodyClasses);
        });
        
        /* Ensures the menu element is
         * hidden by default.
         */
        it('menu-hidden on body', function() {
            expect($('body')).toHaveClass('menu-hidden');
        });

         /* Ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        it('menu visible on click', function() {
            $('.menu-icon-link').trigger('click');
            expect($('body')).not.toHaveClass('menu-hidden');
        });   
        
        // hide menu on second click
        it('menu hidden on click', function() {
            $('.menu-icon-link').trigger('click');
            $('.menu-icon-link').trigger('click');
            expect($('body')).toHaveClass('menu-hidden');
        });
    });
    
    describe('Initial Entries', function() {
        var header = $('.header-title').html();
        
        beforeEach(function(done) {
            // async call done after feed loaded
            loadFeed(0, done);
        });
        
        // reset feed after tests
        afterEach(function() {
            $('.header-title').html(header);
            $('.feed').empty();
        });

        /* Ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('has atleast 1 entry', function() {
            expect($('.entry')).toExist();
        });  
    });
    
    describe('New Feed Selection', function() {
        var header = $('.header-title').html();
        var feed;
        
        beforeEach(function(done) {
            // Async call done after feed loaded
            loadFeed(0, done);
            feed = $('.feed').html();
        });
        
        // reset feed after tests
        afterEach(function() {
            $('.header-title').html(header);
            $('.feed').empty();
        });
        
        /* Ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('feed changed', function() {
            expect($('.feed').html()).not.toEqual(feed);
        });
    });
    
    describe('Menu Items', function() {
        beforeEach(function(done) {
            // Async call done after feed loaded
            loadFeed(0, done);
        });
        
        // reset feed after tests
        afterEach(function() {
            $('.feed').empty();
        });
        
        // menu item clicked
        it('click event stopped and menu hidden', function() {
            var link = $('.feed-list a')[0];
            var spyEvent = spyOnEvent(link, 'click');
            $(link).trigger('click');
            expect($('body')).toHaveClass('menu-hidden');
            expect(spyEvent).toHaveBeenPrevented();
        });
    });
    
    describe('Future Features', function() {
        var lastLogin = '2016-03-04';
        var utc = function(string) {
              var s = string.split('-');
              return Date.UTC(s[0], s[1], s[2]);
            };
        var featureFixture;
        
        beforeAll(function () {
            jasmine.getJSONFixtures().fixturesPath = './jasmine/spec/javascripts/fixtures/json/';
            featureFixture = getJSONFixture('futureFeatureFixture.json');
        });
        
        // Get Feed list from API instead of hardcoded locally
        // Real version would use AJAX request
        it('API feed from remote host', function() {
            expect(featureFixture.feed).toBeDefined();
            expect(featureFixture.feed).not.toBeNull();
            expect(featureFixture.feed.entries).toBeDefined();
            expect(featureFixture.feed.entries).not.toBeNull();
            expect(featureFixture.feed.entries.length).toBeGreaterThan(0);
        });
        
        // Make sure each feed has an image
        it('API feed has img', function() {
            featureFixture.feed.entries.forEach(function(feed) {
                expect(feed.img).toBeDefined();
                expect(feed.img).not.toBeNull();
                expect(feed.img).not.toBe('');
            });
        });
        
        // Check for new articles since last login
        it('API feed has atleast 1 new article', function() {
            var articles = 0;
            featureFixture.feed.entries.forEach(function(feed) {
                expect(feed.pubdate).toBeDefined();
                expect(feed.pubdate).not.toBeNull();
                if(utc(feed.pubdate) >= utc(lastLogin)) {
                    articles++;
                }
            });
            expect(articles).toBeGreaterThan(0);
        });
    });
}());
