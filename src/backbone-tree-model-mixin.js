var treeModelMixin = {
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

    getPatch: function (models) {
        models = models || [];

        models.unshift(this);

        return this.isRoot() ? models : this.getParent().getPatch(models);
    },

    toJSON: function () {
        var node = _.clone(this.attributes),
            children = this.getChildren();

        node.children = _.invoke(children, 'toJSON');

        return node;
    }

};
