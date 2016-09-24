/**
 * Created by zhoubinbin on 2016/9/22.
 * 首页核心jQuery文件
 */
$(function () {
    //实现左侧导航动画效果
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function () {
        $(".baseUI>li>ul").slideUp();
        $(this).next().slideDown(300);
    });
    //默认收缩baseUI下面的li下面的ul。展示第一个
    $(".baseUI>li>ul").slideUp();
    $(".baseUI>li>a").eq(0).trigger("click");
    $(".baseUI>li>ul>li>a").eq(0).trigger("click");

});


//核心模块
angular.module("app",["ng","ngRoute","app.subject"])      //ng???
    //核心模块
    .controller("mainCtrl",["$scope",function ($scope) {
        
    }])
    //路由配置
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/AllSubject",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectManager",{
            templateUrl:"tpl/subject/subjectManager.html",
            controller:"subjectController"
        });
    }]);