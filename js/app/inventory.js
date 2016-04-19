var app = angular.module('app');

app.controller('Inventory', function($rootScope, $scope, $mdDialog, $mdToast, $timeout, uiGridConstants) {
	
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
		data: [{"item_id":"M127711","item_description":"Dell Monitor","item_building":"Streibel","item_location":115},{"item_id":"M127735","item_description":"Dell Monitor","item_building":"Streibel","item_location":115},{"item_id":"M25264","item_description":"Dell Monitor","item_building":"Streibel","item_location":115},{"item_id":"M150142","item_description":"Asus Monitor","item_building":"Streibel Hall","item_location":109},{"item_id":"M143489","item_description":"Leather Office Chair","item_building":"Odegard Hall","item_location":5},{"item_id":"M143490","item_description":"Cool Chair","item_building":"Streibel Hall","item_location":105},{"item_id":"M123456","item_description":"Lorem Ipsum","item_building":"Streibel Hall","item_location":109},{"item_id":"M150149","item_description":"Dell Monitor","item_building":"Streibel Hall","item_location":109},{"item_id":"M143675","item_description":"Lab Cubicle","item_building":"Streibel Hall","item_location":113},{"item_id":"M143625","item_description":"Input Changer","item_building":"Streibel Hall","item_location":109},{"item_id":"M121365","item_description":"Dell Optiplex","item_building":"Streibel Hall","item_location":103}],
		columnDefs: [
			{
				name: 'item_id',
				field: 'item_id',
				displayName: 'ID',
				enableCellEdit: false,
				enableColumnResizing: true
			},
			{
				name: 'item_description',
				field: 'item_description',
				displayName: 'Description',
				sort: { direction: uiGridConstants.ASC, priority: 1 },
				enableCellEdit: false,
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
				enableCellEdit: false,
				enableColumnResizing: true
			}
		]
	}
	
});