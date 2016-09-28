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

    //给最里面的li绑定事件
    $(".baseUI>li>ul>li").off("click");
    $(".baseUI>li>ul>li").on("click",function () {
        if(!$(this).hasClass("current")){
            $(".baseUI>li>ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });
});

//核心模块
angular.module("app",["ng","ngRoute","app.subject","app.paper"])
    //核心模块
    .controller("mainCtrl",["$scope",function ($scope) {
        
    }])
    //
    /*设置a、b、c、d
       a     题型id
     * b     方向id
     * c     知识点id
     * d     难度id
     * 使用的是后台过滤：前台只需获取到过滤的参数id传给后台，后台再把数据发送过来。
     * 思路：
     * 1、路由配置(index.html中的a标签需跟路由的路径一致，当选项为全部的时候变量都为0，
    而subjectList中a标签也需要跟路由匹配)
    需要在控制器中注入$routeParams，获取路径中的参数，再将$routeParams绑定到params中：$scope.params = $routeParams;
    *
    *2、利用占位符，当做变量(在subjectList中a标签，当选项为全部的时候类型id为0,也就是a为0，而其他变量为params.b或其他，
     而在遍历的a标签中，已知后面已经遍历出来type，所以将a后面的变量设置为type.id，所以当你点击哪个哪个的id就为type.id，
     其他则为params.a或其他，)

    * 3、添加active3样式(利用active3与他所在的行中做一个三目运算，例：在题目类型中，当选项为全部时：{{params.a == 0?'active3':'' }}
    * 只有当id为0是才会给他添加active3样式，否则为空，这样当我们点击当选多选简答的时候active都为空。在遍历的a标签中：{{params.a == type.id?'active3':'' }}
    * 当有id的时候就给这个添加一个active3，若没有id就为空。)
    *
    * 4、在获取所有题目信息的服务中，获取的时候给后台传一个参数，params，若参数有东西就会鼓过滤，若没有则把全部信息显示，
    * 由于我们在前台获取的四个id是由abcd来保存，后台无法识别，所以要将四个保存id的变量用后台指定的变量来保存，前后台会规定格式，
    *用一个data空对象来接收装换好的值，首先遍历params，判断条件当值不为0的时候才用switch语句转换值，最后把data传给get获取数据中的
    * params让后台过滤
    * */
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/AllSubject/a/:a/b/:b/c/:c/d/:d",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectController"
        }).when("/SubjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        }).when("/SubjectDel/id/:id",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectDelController"
        }).when("/SubjectState/id/:id/state/:state",{
            templateUrl:"tpl/subject/subjectList.html",
            controller:"subjectCheckController"
        }).when("/PaperList",{
            templateUrl:"tpl/paper/paperManager.html",
            controller:"paperListController"
        }).when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
            templateUrl:"tpl/paper/paperAdd.html",
            controller:"paperAddController"
        }).when("/PaperSubjectList",{
            templateUrl:"tpl/paper/subjectList.html",
            controller:"subjectController"
        });
    }]);