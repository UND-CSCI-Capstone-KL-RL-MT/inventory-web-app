var app = angular.module('app');

app.factory('InventoryService', function($http) {
	
	return {
		
		getInventory: function() {
			return $http.get('../inventory-api/get_items.php')
				.then(function(res) {
					return res.data;
				})
		},
		
		updateInventory: function(item) {
			return $http.post('../inventory-api/update_item.php')
				.then(function(res) {
					return res.data;
				})
		}
		
	}
	
});

app.controller('Inventory', function($rootScope, $scope, $mdDialog, $mdToast, $timeout, uiGridConstants, InventoryService) {
	
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
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'item_description',
				field: 'item_description',
				displayName: 'Description',
				sort: { direction: uiGridConstants.ASC, priority: 1 },
				enableCellEdit: true,
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			},
			{
				name: 'item_building',
				field: 'item_building',
				displayName: 'Building',
				enableCellEdit: false,
				enableColumnResizing: true
			},
			{
				name: 'item_location',
				field: 'item_location',
				displayName: 'Room',
				enableCellEdit: true,
				editableCellTemplate: '<form name="inputForm" class="md-grid-input-form"><md-input-container class="md-grid-input"><label>{{ col.displayName }}</label><input type="INPUT_TYPE" ui-grid-editor ng-model="MODEL_COL_FIELD" autocomplete="off"></md-input-container></form>',
				enableColumnResizing: true
			}
		]
	}
	
	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, function(rowEntity, newValue, oldValue) {
			rowEntity.saved = false;
			InventoryService.updateInventory(rowEntity)
				.then(function() {
					rowEntity.saved = true;
					$timeout(function() {
						rowEntity.saved = false;
					}, 500);
				});
		});
	};
	
	$scope.getInventory = function() {
		InventoryService.getInventory()
			.then(function(res) {
				$scope.gridOptions.data = res;
			});
	}
	
	$scope.getInventory();
	
});