/****************************************************************************************
 * App.js file is dealing with displaying menu & review order.
*****************************************************************************************/
define([
	'jquery',
	'underscore',
	'mockjax',
	'mockEndpointsCustom',
	'libs/vue/vue',
	'libs/vue-router/vue-router',
	'utils/coffeeShopUtil'
], function($, _, mockjax, mockEndpointsCustom, Vue, VueRouter, coffeeShopUtil) {
	Vue.use(VueRouter); // setting up a router for navigation
	var router = new VueRouter(); // create new router instance
	// TODO:: setup router instance for navigation based on component. we need to pass router instance to viewModel.
	var menuData = null;
	var urlToGetMenuData = 'http://localhost:8081/api/menu';
	$.ajax({ // setup Ajax request to get mock data using 'mockjax'.
		url: urlToGetMenuData,
		type: 'GET',
		contentType: "application/json",
		beforeSend: function() {},
		success: function (response, textStatus, jqXhr) {
			menuData = response;
			readOnlyData = response;
			initViewModel();
		},
		error: function (jqXHR, textStatus, errorThrown) {},
		complete: function() {}
	});

	function initViewModel() {
		var viewModel = new Vue({
		  	el: '#coffee-shop-menu',
			data: {
			    coffeeMenuItem: {title: '', imagePath:'', desc:''},
			    coffeeMenu: menuData,
			    reviewOrder: [],
			    orderReviewItems: {title: '', imagePath:'', desc:''},
			    totalInReviewOrder: 0
			 },
 			//created:hook is called after the instance is created.
			created: function() {},
			//mounted:Called after the instance has just been mounted where el is replaced by the newly created vm.$el
			mounted: function () {},

			methods: {
			    onClickAddToReviewOrder: function (e) {
			    	// onClick - add selected menu to review order section and message modifier data into string.
			    	var currentMenuObj = coffeeShopUtil.getCurrentObjIndex(e, this.coffeeMenu, this);
			    	if(currentMenuObj && !_.isNull(currentMenuObj.currentObj) && !_.isNull(currentMenuObj.currentObjIndex)) {
			    		var vmObj = this.coffeeMenu[currentMenuObj.currentObjIndex];
			    		vmObj = _.clone(vmObj);
			    		var listOfaddedModifier = $(e.currentTarget).closest('.list-group-item').find("input[type=checkbox]:checked");
	    				var modifierString = coffeeShopUtil.generateModifierString(listOfaddedModifier);
	    				this.$set(vmObj, 'addedModifierStr', modifierString);
	    				this.reviewOrder.push(vmObj);
	    				// once added: update the price in review order section.
	    				var updatedReviewOrderPrice = coffeeShopUtil.getUpdateInReviewOrderPrice(this.reviewOrder);
	    				this.$set(this, 'totalInReviewOrder', parseFloat(updatedReviewOrderPrice));
			    	}
			    },

			    onClickDeleteOrderItem: function (e) {
			    	// onClick - Delete an item from cart.
			    	var currentMenuObj = coffeeShopUtil.getCurrentObjIndex(e, this.reviewOrder, this);
			    	if(currentMenuObj && !_.isNull(currentMenuObj.currentObj) && !_.isNull(currentMenuObj.currentObjIndex)) {
						this.reviewOrder.splice(currentMenuObj.currentObjIndex,1);
			    	}
			    	// once deleted: update the price in review order section.
			    	var updatedReviewOrderPrice = coffeeShopUtil.getUpdateInReviewOrderPrice(this.reviewOrder);
			    	this.$set(this, 'totalInReviewOrder', parseFloat(updatedReviewOrderPrice));
			    },

			    updateTotalMenuPrice: function(e) {
			    	// onClick:modifier checkbox will update the total coffee price.
			    	coffeeShopUtil.updateTotalMenuPrice(e, this.coffeeMenu, this);
			    },

			    onClickCheckout: function(e) {
			    	// TODO:: write custom logic for checkout page.
			    }
			}
		});
	}


});
