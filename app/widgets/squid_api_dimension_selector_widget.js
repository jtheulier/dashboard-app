(function (root, factory) {
    root.squid_api.view.DimensionSelector = factory(root.Backbone, root.squid_api, app.template.squid_api_dimension_selector_widget);
}(this, function (Backbone, squid_api, template) {

    var View = Backbone.View.extend({
        template : null,
        dimensions : [],

        initialize: function(options) {
            // setup options
            if (options.template) {
                this.template = options.template;
            } else {
                this.template = template;
            }
            var me = this;
            squid_api.model.project.on('change', function(model) {
                // get the dimensions from the api
                var domain = squid_api.utils.find(model.get("domains"), "oid", me.model.get("domains")[0].domainId);
                var dims = domain.dimensions;
                
                // filter categorical dimensions
                for (var i=0; i<dims.length; i++){
                    var dim = dims[i];
                    if (dim.type == "CATEGORICAL") {
                        me.dimensions.push(dim);
                    }
                }
                me.render();
            });
        },

        setModel: function(model) {
            this.model = model;
            this.initialize();
        },
        
        events: {
            "change": function(event) {
                var oid = this.$el.find("select").val();
                this.model.setDimensionId(oid);
            }
        },

        render: function() {
            // display
            var jsonData = {"selAvailable" : true, "options" : []};
            for (var i=0; i<this.dimensions.length; i++) {
                var dim = this.dimensions[i];
                var selected = false;
                if (dim.oid == this.model.get("dimensions")[0].dimensionId) {
                    selected = true;
                }
                var option = {"label" : dim.name, "value" : dim.oid, "selected" : selected};
                jsonData.options.push(option);
            }
            var html = this.template(jsonData);
            this.$el.html(html);
            this.$el.show();
            return this;
        }

    });

    return View;
}));
