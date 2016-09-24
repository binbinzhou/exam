/**
 * Created by zhoubinbin on 2016/9/22.
 * 题目管理的js模块
 */
angular.module("app.subject",["ng","ngRoute"])
    .controller("subjectController",["$scope","$location","SubjectService","SubjectsAllService",function ($scope,$location,SubjectService,SubjectsAllService) {
        //创建单个添加方法，绑定到html中
        $scope.add = function () {
            //设置路径，配合路由
            $location.path("/subjectAdd");
        };
        //调用获取类型函数
        SubjectService.getSubjecttypes(function (data) {
            $scope.types = data;
        });
        //调用获取方向函数
        SubjectService.getSubjectdepartments(function (data) {
            $scope.departments = data;
        });
        //调用获取知识点函数
        SubjectService.getSubjecttopics(function (data) {
            $scope.topics = data;
        });
        //调用获取难度函数
        SubjectService.getSubjectlevel(function (data) {
            $scope.levels = data;
        });
        //调用所有题目信息
        SubjectsAllService.getAllSubject(function (data) {
            //对每个题目进行遍历
            data.forEach(function (subject) {
                //为每个选项添加ABCD编号
                var answer = [];
                //对每个选择题里面的选项进行遍历
                if(subject.subjectType.id != 3){
                    subject.choices.forEach(function (choice,index) {
                        //给选项组数里面的每一个选项设置一个属性no，调用一个方法将索引值转换为对应的ABCD
                        choice.no = SubjectService.convertIndexToNo(index);
                    });
                    //如果题目类型id不为3，也就是为单选或者多选的时候
                    if(subject.subjectType.id != 3){
                        subject.choices.forEach(function (choice) {
                            //如果选项的值为true则将序号添加进数组中
                            if(choice.correct){
                                answer.push(choice.no);
                            }
                        });
                        //将数组转化为字符串格式
                        subject.answer = answer.toString();
                    }
                }
            });
            $scope.subjects = data;

        });
        //添加新题目
        $scope.subject = {};
        $scope.saveSubject = function () {
            console.log($scope.subject);
        };
    }])
    //获取全部题目的信息，创建一个新的服务，方便之后的增删该查，
    .service("SubjectsAllService",["$http",function ($http) {
        //获取所有题目信息
        this.getAllSubject = function (handler) {
            $http.get("data/subjects.json").success(function (data) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action").success(function (data) {
                handler(data);
            });
        };
        //向后台提交添加的题目的信息
        this.addSubject = function (subject) {
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",subject).success(function () {
                alert("保存成功");
            });
        };
        
    }])
    .factory("SubjectService",["$http",function ($http) {
        return {
            convertIndexToNo:function (index) {
                return index ==0 ?"A":(index ==1?"B":(index == 2?"C":(index ==3?"D":"E" )));
            },
            //获取题目类型数据
            getSubjecttypes:function (handler) {
                $http.get("data/type.json").success(function (data) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目方向数据
            getSubjectdepartments:function (handler) {
                $http.get("data/department.json").success(function (data) {
                //$http.get("$http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {").success(function (data) {
                    handler(data);
                });
            },
            //获取题目知识点数据
            getSubjecttopics:function (handler) {
                $http.get("data/topic.json").success(function (data) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目难度数据
            getSubjectlevel:function (handler) {
                $http.get("data/level.json").success(function (data) {
                //$http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });
            }

        };
    }])
    //配置路由
    .config(["$routeProvider",function ($routeProvider) {
        $routeProvider.when("/subjectAdd",{
            templateUrl:"tpl/subject/subjectAdd.html",
            controller:"subjectController"
        });
    }])
    .directive("subjectDt",function () {
        return {
            restrict:"AE",
            compile:function () {
                return {
                    post:function postLink(scope, element) {
                        element.find("div").on("click",function (event) {
                            if (event.target.nodeName == "A") {
                                console.log($(event.target));
                                $(event.target).addClass("active3").siblings().removeClass("active3");
                            }
                        });
                    }
                };
            }
        };
    });
