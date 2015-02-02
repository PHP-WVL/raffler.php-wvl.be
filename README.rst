raffler.php-wvl.be
==================

setup
-----

Prerequisites (`NodeJS`_, `NPM`_)
.....

The raffler.php-wvl.be site is managed by modern JS tools like `Bower`_ for dependencies, `RequireJS`_ for requiring files in the source code and `Grunt`_ for preparing the site for deploying on github pages.

In order for these tools to work, install `NodeJS`_ and `NPM`_ locally on your dev machine before you continue with the rest.

Dependencies (Bower)
.....

All external dependencies of raffler.php-wvl.be are managed by `Bower`_. To install Bower on your local machine, install it with NPM::

    npm install -g bower

Next, install the project's dependencies in the ``js/vendors/`` folder by executing the following command::

    bower install



.. _NodeJS: http://nodejs.org/
.. _NPM: https://www.npmjs.com/
.. _Bower: http://bower.io/
.. _RequireJS: http://www.requirejs.org/
.. _Grunt: http://gruntjs.com
