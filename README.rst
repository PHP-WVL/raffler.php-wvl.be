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

    $ npm install -g bower

Next, install the project's dependencies in the ``js/vendors/`` folder by executing the following command::

    $ bower install

Task Manager (Grunt)
.....

When deploying the raffler to the Github Pages, we need the dependencies without their source. The deploy task for `Grunt`_ will prepare everything for deploying to the Github Pages.

To install Grunt, run::

    $ npm install grunt

Deploying to Github Pages
-----

Before deploying, make sure your changes are merged into the master branch. Then to deploy to Github Pages, simply use::

    $ grunt deploy

This will merge ``master`` branch with ``gh-pages`` branch, copy the necessary vendor files, commit them and finally push to Github.


.. _NodeJS: http://nodejs.org/
.. _NPM: https://www.npmjs.com/
.. _Bower: http://bower.io/
.. _RequireJS: http://www.requirejs.org/
.. _Grunt: http://gruntjs.com
