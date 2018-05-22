var app = angular.module('userApp', ['datatables'])
app.controller('userCtrl', function($scope, $compile, $http, DTOptionsBuilder, DTColumnBuilder) {

    /**
     * init the controller
     */
    $scope.init = function() {
        $scope.db = {}
        $scope.user = {}
        $scope.users = {}
        $scope.dtInstance = {};
        $scope.init_dataTable()
        $scope.new()
    }

    /**
     * edit the supplier
     */
    $scope.edit = function(id) {
        $('#saveButton').show()
        $scope.user = $scope.db[id]
    }

    /**
     * add new supplier
     */
    $scope.new = function() {
        $('#saveButton').show()
        $scope.user = {
            email: "",
            username: "",
            password: "",
            
        }
    }

    $scope.view = function(id){
        $('#saveButton').hide();
        $scope.user = $scope.db[id]
    }

    /**
     * confirm to delete supplier
     */
    $scope.remove = function(id) {
        var user = $scope.db[id]
        if (user) {
            ngcurd.confirm({
                title: 'Confirm remove ',
                message: 'Warning: all this user\'s data will be removed!',
                ok: function() {
                    ngcurd.post('/user/remove', {id: id}, {
                        success: function(){
                            $scope.dtInstance.reloadData()
                        }
                    })
                }
            })
        }
    }

    /**
     * add or update supplier
     */
    $scope.save = function() {

        ngcurd.post('/user/update', $scope.user, {
            success: function(){
                $scope.dtInstance.reloadData()
            }
        })
    }

    /**
     * init the DataTable
     */
    $scope.init_dataTable = function() {

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                url: '/user/query',
                type: 'POST'
            })
            // or here
            .withDataProp('data')
            .withOption('processing', true)
            .withOption('serverSide', true)
            .withOption('responsive', true)
            .withPaginationType('full_numbers')
            .withOption('createdRow', function(row, data, dataIndex) {
                // Recompiling so we can bind Angular directive to the DT
                $compile(angular.element(row).contents())($scope);
            });
        $scope.dtColumns = [
            
                DTColumnBuilder.newColumn('id').withTitle('Id'),
                DTColumnBuilder.newColumn('email').withTitle('Email'),
                DTColumnBuilder.newColumn('username').withTitle('Username'),
                DTColumnBuilder.newColumn('password').withTitle('Password'),
                DTColumnBuilder.newColumn('id').withTitle('').notSortable().renderWith(function(col, type, row) {
                    $scope.db[row.id] = row
                    return '<button ng-click="view(' + row.id + ')" class="btn btn-default btn-circle" data-toggle="modal"  data-target="#edit_user" ><i class="fa fa-eye"></i></button> '
                         + '<button ng-click="edit(' + row.id + ')" class="btn btn-success btn-circle" data-toggle="modal"  data-target="#edit_user"><i class="fa fa-edit"></i></button> ' 
                         + '<button ng-click="remove(' + row.id + ')" class="btn btn-warning btn-circle" data-toggle="modal" data-target="#edit_user" ><i class="fa fa-remove"></i></button>'
                        
                })
            ]
    }


    //init current app.controller
    $scope.init()

});
