# Project 6 : Feed Reader Testing
In this project, Jasmine Unit tests are written to test functional expectations.

[get-zip]: https://github.com/jdbence/FE-Nanodegree/archive/master.zip
[get-tgz]: https://github.com/jdbence/FE-Nanodegree/archive/master.tar.gz
[clone-http]: https://github.com/jdbence/FE-Nanodegree.git
[clone-svn]: https://github.com/jdbence/FE-Nanodegree
[clone-ghwin]: github-windows://openRepo/https://github.com/jdbence/FE-Nanodegree
[clone-ghmac]: github-mac://openRepo/https://github.com/jdbence/FE-Nanodegree
[gulp]: http://gulpjs.com
[jasmine]: http://jasmine.github.io/
## Includes

[Gulp][gulp], [Jasmine][jasmine]

## Installation

* Clone git repository via [https][clone-http] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Checkout with [svn][clone-svn]

### Gulp Dependencies

```node
//  Move into project folder
cd project6/
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
cd project6/
//  Install globals
npm install http-server -g
//  Start server
http-server -p 8080
```

## License

Project is released under the [MIT License](http://opensource.org/licenses/MIT).