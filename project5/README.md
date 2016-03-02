# Project 5 : Neighborhood Map
Single page application featuring a map of a US National Parks.
Uses Gulp for combining and minifying html, css, js and images.

[get-zip]: https://github.com/jdbence/FE-Nanodegree/archive/master.zip
[get-tgz]: https://github.com/jdbence/FE-Nanodegree/archive/master.tar.gz
[clone-http]: https://github.com/jdbence/FE-Nanodegree.git
[clone-svn]: https://github.com/jdbence/FE-Nanodegree
[clone-ghwin]: github-windows://openRepo/https://github.com/jdbence/FE-Nanodegree
[clone-ghmac]: github-mac://openRepo/https://github.com/jdbence/FE-Nanodegree
[gulp]: http://gulpjs.com
[GMat]: https://design.google.com/icons
[GMap]: https://developers.google.com/maps/documentation/javascript/
[flickr]: https://www.flickr.com
[Wik]: https://en.wikipedia.org
[knockout]: http://knockoutjs.com
[packery]: http://packery.metafizzy.co/

## Includes

[Gulp][gulp], [KnockoutJS][knockout], [Packery][packery], [Material Icons][GMat], [Google Maps][GMap], [Flickr][flickr], [Wikipedia][Wik]

## Installation

* Clone git repository via [https][clone-http] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Checkout with [svn][clone-svn]

### Gulp Dependencies

```node
//  Move into project folder
cd project5/
//  Install globals
npm install gulp -g
//  Install local dependences
npm install
```

### Gulp Tasks

```node
//  Minifies html, js, css and moves them to dist folder
gulp build
//  Compresses images and moves them to dist folder
gulp images
// Copies required font files
gulp font
// Empties the dist folder
gulp clean
```

## Simple Server

```node
//  Move into project folder
cd project5/
//  Install globals
npm install http-server -g
//  Start server
http-server -p 8080
```

## License

Project is released under the [MIT License](http://opensource.org/licenses/MIT).