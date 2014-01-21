[![Build Status](https://travis-ci.org/avoronkin/backbone.model.tree.mixin.png?branch=master)](https://travis-ci.org/avoronkin/backbone.model.tree.mixin)

## Usage ##
```javascript
    var Backbone = require('backbone');
    var treeModelMixin = require('backbone.model.tree.mixin');

    var Node = Backbone.Model.extend(treeModelMixin);

    var Tree = Backbone.Collection.extend({
        model: Node
    });

    var tree = new Tree([{
            name: 'name1',
            parentName: 'root'
        }, {
            name: 'name2',
            parentName: 'name1'
        }, {
            name: 'name3',
            parentName: 'name2'
        }, {
            name: 'name4',
            parentName: 'name2'
        }]);

```

## Tests ##
mocha-phantomjs tests/test-runner.html
