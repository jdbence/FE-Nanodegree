# Project 3 : Frogger
Clone of the classic game Frogger.
Player uses the arrow keys(left, up, right, down) to move.
Player uses the mouse to interact with the menu UI.
Game is broken down into levels that gradually increase in difficulty.
Player must collect level keys to advance to the next level.
Player must complete the level within the given time.
Player must avoid obstacles(enemies, water) or they will reset to the start position.

[example]: https://jdbence.github.io/FE-Nanodegree/project3/build/index.html
[get-zip]: https://github.com/jdbence/FE-Nanodegree/archive/master.zip
[get-tgz]: https://github.com/jdbence/FE-Nanodegree/archive/master.tar.gz
[clone-http]: https://github.com/jdbence/FE-Nanodegree.git
[clone-svn]: https://github.com/jdbence/FE-Nanodegree
[clone-ghwin]: github-windows://openRepo/https://github.com/jdbence/FE-Nanodegree
[clone-ghmac]: github-mac://openRepo/https://github.com/jdbence/FE-Nanodegree

[Live Example][example]

## Installation

* Clone git repository via [https][clone-http] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Checkout with [svn][clone-svn]

### Gulp Dependencies

```node
//  Move into project3 folder
cd project3/
//  Install globals
npm install gulp jscs -g
//  Install local dependences
npm install
```

### Gulp Tasks

```node
//  Styleguide && ESLint with generated report 
gulp syntax
//  Build app.js && app.min.js
gulp
```

## Simple Server

```node
//  Move into project3 folder
cd project3/
//  Install globals
npm install http-server -g
//  Start server
http-server -p 8080
```

## License

Project is released under the [MIT License](http://opensource.org/licenses/MIT).
