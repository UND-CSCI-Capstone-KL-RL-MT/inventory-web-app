var app = angular.module('app');

app.factory('InventoryService', function($http) {
	
	return {
		
		getInventory: function() {
			return $http.get('../inventory-api/get_items.php')
				.then(function(res) {
					return res.data;
				})
		},
		
		filterInventory: function(filter) {
			return $http.get('../inventory-api/get_items.php', { params: {filter: filter}})
				.then(function(res) {
					return res.data;
				})
		},
		
		addInventory: function(item) {
			return $http.post('../inventory-api/add_item.php', item)
				.then(function(res) {
					return res.data;
				})
		},
		
		updateInventory: function(item) {
			return $http.post('../inventory-api/update_item.php', item)
				.then(function(res) {
					return res.data;
				})
		},
		
		removeInventory: function(item) {
			return $http.post('../inventory-api/remove_item.php', item)
				.then(function(res) {
					return res.data;
				})
		}
		
	}
	
});

app.controller('Inventory', function($rootScope, $scope, $mdDialog, $mdToast, $timeout, uiGridConstants, InventoryService) {
	
	$scope.inventory = [{"item_id":"M127711","item_description":"Dell Monitor","item_building":"Streibel","item_location":115}];
	$scope.grid = true;
	$scope.gridOptions = {
		enableHorizontalScrollbar: 0,
		enableVerticalScrollbar: 1,
		enableSorting: true,
		enableGridMenu: true,
		gridMenuShowHideColumns: false,
		exporterCsvFilename: 'inventory-report-' + moment().format('MM-DD-YYYY') + '.csv',
		exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link')),
		exporterMenuPdf: false,
		exporterSuppressColumns: ['actions'],
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
		},
		rowHeight: 50,
		data: [{"item_id":"M127711","item_description":"Dell Monitor","item_building":"Streibel","item_location":115}],
		columnDefs: [
			{
				name: 'item_id',
				field: 'item_id',
				displayName: 'ID',
				enableCellEdit: true,
				cellTemplate: './templates/grid/cell_template.html',
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'item_description',
				field: 'item_description',
				displayName: 'Description',
				sort: { direction: uiGridConstants.ASC, priority: 1 },
				enableCellEdit: true,
				cellTemplate: './templates/grid/cell_template.html',
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'item_building',
				field: 'item_building',
				displayName: 'Building',
				enableCellEdit: true,
				cellTemplate: './templates/grid/cell_template.html',
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'item_location',
				field: 'item_location',
				displayName: 'Room',
				enableCellEdit: true,
				cellTemplate: './templates/grid/cell_template.html',
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'actions',
				field: 'actions',
				displayName: 'Actions',
				enableCellEdit: false,
				cellTemplate: '<md-button class="md-warn" ng-click="grid.appScope.removeInventory(row.entity)">Delete</md-button><img class="savedIndicator" src="./images/checkmark.png" ng-if="row.entity.saved" />'
			}
		]
	}
	
	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, function(rowEntity, newValue, oldValue) {
			if (rowEntity.unsaved == true) {
				if (rowEntity.item_id == "" || rowEntity.item_description == "") {
					$mdToast.show(
						$mdToast.simple()
							.textContent('Please enter an item ID and item description to save this item.')
							.position('bottom right')
							.hideDelay(3000)
					);
				} else {
					rowEntity.saved = false;
					InventoryService.addInventory(rowEntity)
						.then(function() {
							rowEntity.unsaved = false;
							rowEntity.saved = true;
							$timeout(function() {
								rowEntity.saved = false;
							}, 2000);
						});
				}
			} else {
				rowEntity.saved = false;
				InventoryService.updateInventory(rowEntity)
					.then(function() {
						rowEntity.saved = true;
						$timeout(function() {
							rowEntity.saved = false;
						}, 2000);
					});
			}
		});
	};
	
	$scope.getInventory = function() {
		InventoryService.getInventory()
			.then(function(res) {
				$scope.gridOptions.data = res;
			});
	};
	
	$scope.addItem = function() {
		$scope.gridOptions.data.push({item_id: '', item_description: '', item_building: 'Streibel Hall', item_location: '', saved: false, unsaved: true})
	}
	
	$scope.removeInventory = function(item) {
		
		var confirm = $mdDialog.confirm()
			.title("Are you sure you'd like to remove item " + item.item_id + "?")
			.ariaLabel("Really remove item?")
			.ok('Yes')
			.cancel('No');
		
		$mdDialog.show(confirm).then(function() {
			InventoryService.removeInventory(item)
				.then(function(res) {
					$scope.getInventory();
					$mdToast.show(
						$mdToast.simple()
							.textContent('Item with ID ' + item.item_id + ' removed successfully.')
							.position('bottom right')
							.hideDelay(3000)
					);
				});
		}, function() {
			// cancelled removal of item.
		})
	};
	
	$scope.searchTextChange = function(searchText) {
		InventoryService.filterInventory(searchText)
			.then(function(res) {
				$scope.gridOptions.data = res;
			})
	};
	
	$scope.getInventory();
	
});