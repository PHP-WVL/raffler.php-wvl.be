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

.. code:: bash

    $ npm install -g bower

Next, install the project's dependencies in the ``js/vendors/`` folder by executing the following command::

.. code:: bash

    $ bower install

Task Manager (Grunt)
.....

When deploying the raffler to the Github Pages, we need the dependencies without their source. The deploy task for `Grunt`_ will prepare everything for deploying to the Github Pages.

To install Grunt, run::

.. code:: bash

    $ npm install grunt

Then prepare the sources for deploy to Github Pages::

.. code:: bash

    $ git checkout gh-pages
    $ grunt deploy
    $ git add .
    $ git commit -sm "<your message>"
    $ git push

This will first checkout the correct branch (``gh-pages``), next it will prepare your sources and finally you have to add, commit & push those changes in the ``gh-pages`` branch.


.. _NodeJS: http://nodejs.org/
.. _NPM: https://www.npmjs.com/
.. _Bower: http://bower.io/
.. _RequireJS: http://www.requirejs.org/
.. _Grunt: http://gruntjs.com
