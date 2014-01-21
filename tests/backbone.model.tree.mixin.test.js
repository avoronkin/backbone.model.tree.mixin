describe('Tree model mixin', function () {
    var tree, n1, n2, n3, n4, Node;

    beforeEach(function () {
        Node = Backbone.Model.extend(treeModelMixin);

        var Tree = Backbone.Collection.extend({
            model: Node
        });

        tree = new Tree([{
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

        n4 = tree.findWhere({
            name: 'name4'
        });
        n3 = tree.findWhere({
            name: 'name3'
        });
        n2 = tree.findWhere({
            name: 'name2'
        });
        n1 = tree.findWhere({
            name: 'name1'
        });

    });

    describe('addChild()', function () {

        it('should add child node to collection', function (done) {
            var child = new Node({
                name: 'child'
            });

            n1.collection.on('add', function () {
                if (n1.collection.contains(child)) {
                    done();
                }
            });

            n1.addChild(child);
        });

        it('in child node should set a reference to parent node', function () {
            var child2 = new Node({
                name: 'child2'
            });

            n1.addChild(child2);

            child2.get('parentName').should.to.be.equal('name1');
        });
    });

    describe('getRoot()', function () {
        it('should return root node', function () {
            var n3Root = n3.getRoot();
            n3Root.get('name').should.to.be.equal('name1');
        });

        it('should return a reference to itself for root node', function () {
            var n1Root = n1.getRoot();
            n1Root.get('name').should.to.be.equal('name1');
        });

    });

    describe('getParent()', function () {
        it('should return parent node', function () {
            var n3Parent = n3.getParent();
            n3Parent.get('name').should.to.be.equal('name2');
        });

        it('should return undefined if there is no parent node', function () {
            var n1Parent = n1.getParent();
            should.not.exist(n1Parent);
        });
    });

    describe('isRoot()', function () {
        it('should return true for root node', function () {
            n1.isRoot().should.to.be.true;
        });

        it('should return false for a non-root node', function () {
            n3.isRoot().should.to.be.false;
        });
    });

    describe('getChildren()', function () {
        it('should return an array with child nodes', function () {
            var n2Children = n2.getChildren();

            n2Children.should.to.be.an('array');
            n2Children.should.to.have.length(2);
        });

        it('should return an empty array if node has no children', function () {
            var n3Children = n3.getChildren();
            n3Children.should.to.be.an('array');
            n3Children.should.to.have.length(0);
        });

    });

    describe('getPatch()', function () {
        it('should return "breadcrumbs"', function () {
            var breadcrumbs = n3.getPatch();

            breadcrumbs.should.to.be.an('array');
            breadcrumbs.should.to.have.length(3);
            breadcrumbs[0].should.to.be.equal(n1);
            breadcrumbs[1].should.to.be.equal(n2);
            breadcrumbs[2].should.to.be.equal(n3);
        });
    });

    describe('toJSON()', function () {
        it('should return node + children nested json', function () {
            var json = n1.toJSON();

            json.should.to.be.eql({
                name: 'name1',
                parentName: 'root',
                children: [{
                    name: 'name2',
                    parentName: 'name1',
                    children: [{
                        name: 'name3',
                        parentName: 'name2',
                        children: []
                    }, {
                        name: 'name4',
                        parentName: 'name2',
                        children: []
                    }]
                }]
            });
        });


    });
});
