// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Origin = require('core/origin');
  var AssetManagementCollectionView = require('./assetManagementCollectionView');
  var AssetManagementPreviewView = require('./assetManagementPreviewView');
  var AssetManagementView = require('./assetManagementView');
  var AssetManagementModalFiltersView = require('./assetManagementModalFiltersView');
  var AssetManagementModelAutofillView = require('./assetManagementModalAutofillView');

  var AssetManagementModalView = AssetManagementView.extend({
    preRender: function(options) {
      this.options = options;
      AssetManagementView.prototype.preRender.apply(this, arguments);
    },

    postRender: function() {
      this.setupSubViews();
      this.setupFilterAndSearchView();
      if (this.options.assetType === "Asset:image" && Origin.scaffold.getCurrentModel().get('_component') === 'graphic') {
      	this.setupImageAutofillButton();
      }
      this.resizePanels();
    },

    setupSubViews: function() {
    	this.search = {};
    	// Replace Asset and : so we can have both filtered and all asset types
    	var assetType = this.options.assetType.replace('Asset', '').replace(':', '');

      if (assetType) {
        var filters = [assetType];
    	  this.search.assetType = { $in: filters };
      }
      // Push collection through to collection view
      this.$('.asset-management-assets-container-inner').append(new AssetManagementCollectionView({collection: this.collection, search: this.search}).$el);
    },

    setupFilterAndSearchView: function() {
    	new AssetManagementModalFiltersView(this.options);
    },

    setupImageAutofillButton: function() {
    	new AssetManagementModelAutofillView({ modalView: this });
    },

    resizePanels: function() {
      var actualHeight = $(window).height() - $('.modal-popup-toolbar').outerHeight();
      this.$('.asset-management-assets-container').height(actualHeight);
      this.$('.asset-management-preview-container').height(actualHeight);
    },

    onAssetClicked: function(model) {
      this.$('.asset-management-no-preview').hide();

      var previewView = new AssetManagementPreviewView({ model: model });
      this.$('.asset-management-preview-container-inner').html(previewView.$el);

      var filename = model.get('filename');
    	var assetObject = {
    		assetLink: 'course/assets/' + filename,
    		assetId: model.get('_id'),
    		assetFilename: filename
    	};
      this.data = assetObject;
      Origin.trigger('modal:assetSelected', assetObject);
    },

    getData: function() {
    	return this.data;
    }
  });

  return AssetManagementModalView;
});
