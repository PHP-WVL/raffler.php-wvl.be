raffler.php-wvl.be
==================

setup
-----

Prerequisites (.. _NodeJS: http://nodejs.org/, .. _NPM: https://www.npmjs.com/)
.....

The raffler.php-wvl.be site is managed by modern JS tools like .. _Bower: http://bower.io for dependencies, .. _RequireJS: http://www.requirejs.org/ for requiring files in the source code and .. _Grunt: http://gruntjs.com for preparing the site for deploying on github pages.

In order for these tools to work, install .. _NodeJS: http://nodejs.org/ and .. _NPM: https://www.npmjs.com/ locally on your dev machine before you continue with the rest.

Dependencies (Bower)
.....

All external dependencies of raffler.php-wvl.be are managed by .. _Bower: http://bower.io. To install Bower on your local machine, install it with NPM:

.. code:: bash
    npm install -g bower

Next, install the project's dependencies in the `js/vendors/` folder by executing the following command:


.. code:: bash
    bower install

