(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('underscore'));
    } else {
        root.treeModelMixin = factory(root._);
    }
}(this, function (_) {

    return {
        nodeId: 'name',
        nodeParentId: 'parentName',

        addChild: function (model) {
            model.set(this.nodeParentId, this.get(this.nodeId));
            this.collection.add(model);
        },

        isRoot: function () {
            return this.getParent() === undefined;
        },

        getRoot: function () {
            var parent = this.getParent();

            return parent ? parent.getRoot() : this;
        },

        getParent: function () {
            var parent,
                parentId = this.get(this.nodeParentId),
                whereClause = {};


            if (parentId) {
                whereClause[this.nodeId] = parentId;

                parent = this.collection.findWhere(whereClause);
            }

            return parent;
        },

        getChildren: function () {
            var whereClause = {};

            whereClause[this.nodeParentId] = this.get(this.nodeId);

            return this.collection.where(whereClause);
        },

        getDescendants: function () {
            var models = [];
            var children = this.getChildren();

            models = models.concat(children);

            _(children).each(function (model) {
                if(model.getDescendants().length){
                    models = models.concat(model.getDescendants());
                }
            });

            return models;
        },

        getPatch: function (models) {
            models = models || [];

            models.unshift(this);

            return this.isRoot() ? models : this.getParent().getPatch(models);
        },

        isAncestor: function (model) {
            var modelAncestors = model.getPatch();
            return  _(modelAncestors).find(function (ancestor) {
                return ancestor.cid === this.cid;
            }, this);
        },

        toJSON: function () {
            var node = _.clone(this.attributes),
                children = this.getChildren();

            node.children = _.invoke(children, 'toJSON');

            return node;
        }

    };
}));
