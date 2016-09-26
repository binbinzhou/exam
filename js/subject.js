/**
 * Created by zhoubinbin on 2016/9/22.
 * 题目管理的js模块
 */
angular.module("app.subject",["ng","ngRoute"])
    .controller("subjectController",["$scope","$location","SubjectService","SubjectsAllService","$routeParams",
        function ($scope,$location,SubjectService,SubjectsAllService,$routeParams) {
        //将路由参数绑定到作用域当中
            $scope.params = $routeParams;

            $scope.subject = {
                typeId :1,
                departmentId:1,
                levelId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:""
            };
            //调用添加题目信息方法
            $scope.submit = function () {
                SubjectService.saveSubject($scope,subject,function (data) {
                   console.log(data);
                });
            };

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
        SubjectsAllService.getAllSubject($routeParams,function (data) {
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
    }])
    //获取全部题目的信息，创建一个新的服务，方便之后的增删该查，
    .service("SubjectsAllService",["$http",function ($http) {
        //保存添加题目信息
        this.saveSubject = function (params,handler) {
            //处理数据
            var obj = {};

            console.log(obj);
            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj)
                .success(function (data) {
                    handler(data);
                });
        };


        //获取所有题目信息
        //function中要传一个params参数
        this.getAllSubject = function (params,handler) {
            //用一个空对象来接收属性和值，
            var data = {};
            //遍历data，将data转换为后台能识别的对象，
            for(var key in params){
                var val = params[key];
                if(val!=0){
                    switch(key){
                        case "a":
                            data['subject.subjectType.id'] = val;
                            break;
                        case "b":
                            data['subject.department.id'] = val;
                            break;
                        case "c":
                            data['subject.topic.id'] = val;
                            break;
                        case "d":
                            data['subject.subjectLevel.id'] = val;
                            break;
                    }
                }
            }
            console.log(data);
            //$http.get("data/subjects.json").success(function (data) {
               $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action",{
                  params:data
                }).success(function (data) {
                handler(data);
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
                //$http.get("data/type.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目方向数据
            getSubjectdepartments:function (handler) {
                //$http.get("data/department.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目知识点数据
            getSubjecttopics:function (handler) {
                //$http.get("data/topic.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllTopics.action").success(function (data) {
                    handler(data);
                });
            },
            //获取题目难度数据
            getSubjectlevel:function (handler) {
                //$http.get("data/level.json").success(function (data) {
                $http.get("http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action").success(function (data) {
                    handler(data);
                });
            }
        };
    }]);
