'use strict';


var socialApp = angular.module('socialApp', ['ngRoute', 'datatables', 'ngFileUpload', 'ngImgCrop', 'ui.bootstrap']);

socialApp.config(function($routeProvider){
  
    /*Routes for admin*/
    $routeProvider.when('/admin-login', {
        controller: 'login',
        templateUrl : 'admin/login/login.html',
    }).when('/resetPassword',{
        controller:'resetPasswordController',
        templateUrl : 'admin/login/resetPassword.html',
    }).when('/newPassword/:token/:id',{
        controller:'newPasswordController',
        templateUrl : 'admin/login/changePassword.html'
    }).when('/dashboard', {
        controller: 'login',
        templateUrl : 'admin/admin-panel/html/dashboard.html',
        activetab: 'dashboard'
    }).when('/add-society', {
        controller: 'society',
        templateUrl : 'admin/admin-panel/html/add-society.html',
        activetab: 'society'
    }).when('/society-list', {
        controller: 'societyList',
        templateUrl : 'admin/admin-panel/html/society-list.html',
        activetab: 'society'
    }).when('/add-blocks/:id', {
        controller: 'block',
        templateUrl : 'admin/admin-panel/html/add-blocks.html',
        activetab: 'society'
    }).when('/edit-block/:blockId', {
        controller: 'editBlock',
        templateUrl : 'admin/admin-panel/html/edit-block.html',
        activetab: 'society'
    }).when('/block-list/:id', {
        controller: 'blockList',
        templateUrl : 'admin/admin-panel/html/block-list.html',
        activetab: 'society'
    }).when('/manager-list', {
        controller: 'managerList',
        templateUrl : 'admin/admin-panel/html/manager-list.html',
        activetab: 'society'
    }).when('/add-manager', {
        controller: 'addManager',
        templateUrl : 'admin/admin-panel/html/add-manager.html',
        activetab: 'society'
    });

    /*routes for manager*/
    $routeProvider.when('/society-manager-login', {
        controller: 'societyLogin',
        templateUrl : 'login/login.html',
    }).when('/manager-reset-password', {
        controller: 'societyResetPasswordController',
        templateUrl : 'login/resetPassword.html',
    }).when('/manager-new-password/:token/:id', {
        controller: 'society-newPasswordController',
        templateUrl : 'login/changePassword.html',
    }).when('/select-block', {
        controller: 'selectBlock',
        templateUrl : 'society/html/select-block.html',
    }).when('/society-dashboard/:blockID', {
        controller: 'societyDashboard',
        templateUrl : 'society/html/dashboard.html',
        activetab: 'societyDashboard'
    }).when('/manage-society/:blockID/:id', {
        controller: 'societyListByID',
        templateUrl : 'society/html/society-list.html',
        activetab: 'manageSociety'
    }).when('/manager-edit-block/:blockID/:id', {
        controller: 'editBlock',
        templateUrl : 'society/html/edit-block.html'
    }).when('/manager-change-password/:blockID', {
        controller: 'changePassword',
        templateUrl : 'society/html/changePassword.html'
    }).when('/society-flats/:blockID', {
        controller: 'flats',
        templateUrl : 'society/html/flats.html',
        activetab: 'manageFlats'
    }).when('/add-resident/:blockID/:flatID', {
        controller: 'addResident',
        templateUrl : 'society/html/add-resident.html',
        activetab: 'manageFlats'
    }).when('/resident-list/:blockID', {
        templateUrl : 'society/html/resident-list.html',
        controller: 'residentList',
        activetab: 'residentList'
    }).when('/resident-info/:blockID/:residentID', {
        templateUrl : 'society/html/resident-info.html',
        controller: 'residentInfo',
        activetab: 'residentList'
    }).when('/pending-complaint-list/:blockID', {
        templateUrl : 'society/html/complaint-list.html',
        controller: 'pendingComplaintList',
        activetab: 'Complaints'
    }).when('/underS-complaint-list/:blockID', {
        templateUrl : 'society/html/complaint-list.html',
        controller: 'usComplaintList',
        activetab: 'Complaints'
    }).when('/resolved-complaint-list/:blockID', {
        templateUrl : 'society/html/complaint-list.html',
        controller: 'resolvedComplaintList',
        activetab: 'Complaints'
    });

    /*Routes for Front*/
    $routeProvider.when('/', {
        templateUrl : 'man2help/index.html',
    }).when('/all-society-list', {
        controller: 'societyFocietyList',
        templateUrl : 'man2help/society-list.html',
    }).when('/society/:slug', {
        controller: 'frontSociety',
        templateUrl : 'front/html/society-landing.html',
    }).when('/block/:societySlug/:blockSlug', {
        controller: 'blockLanding',
        templateUrl : 'front/html/block-landing.html',
    });

    /*Routes for  Resident's*/

    $routeProvider.when('/resident-login', {
        templateUrl : 'login/login.html',
        controller: 'residentLogin'
    }).when('/resident-reset-password', {
        templateUrl : 'login/resetPassword.html',
        controller: 'residentRessetPassword'
    }).when('/resident-new-password/:token/:id', {
        templateUrl : 'login/changePassword.html',
        controller: 'residentChangePassword'
    }).when('/resident-dashboard', {
        templateUrl : 'resident/html/dashboard.html',
        controller: 'residentLogin',
        activetab: 'residentDashboard'
    }).when('/resident-complaint-log', {
        templateUrl : 'resident/html/complaint-log.html',
        controller: 'logComplaint',
        activetab: 'Complaints'
    }).when('/full-complaint-form/:complaintID', {
        templateUrl : 'resident/html/full-complaint-form.html',
        controller: 'fullComplaintForm',
        activetab: 'Complaints'
    }).when('/complaint-list', {
        templateUrl : 'resident/html/complaint-list.html',
        controller: 'complaintList',
        activetab: 'Complaints'
    });
    /*Routes for 404*/
    $routeProvider.when('/404', {
        templateUrl : 'front/html/404.html',
    }).otherwise({
        redirectTo: '/404'
    });
});

