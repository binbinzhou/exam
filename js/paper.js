/**
 * Created by zhoubinbin on 2016/9/28.
 * 试卷模块的js文件
 */
angular.module("app.paper",["ng","app.subject"])  //ng表示依赖angular核心模块
    //试卷查询控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])
    //试卷添加控制器
    .controller("paperAddController",["$scope","commonService","$routeParams","paperModel","paperService",
        function ($scope,commonService,$routeParams,paperModel,paperService) {
            //将app.subject中的全部方向加载到下拉框中
            commonService.getSubjectdepartments(function (data) {
                //将全部方向绑定到作用域的departments当中
                $scope.departments = data;
            });
            //将路径中的属性id赋给subjectId，然后在将其追加进数组
            var subjectId = $routeParams.id;
            if(subjectId!=0){
                //将要添加的题目的id添加到数组中
                paperModel.addSubjectId(subjectId);
                //将要添加的题目的路径中的所有信息都追加进题目信息的数组中
                paperModel.addSubject(angular.copy($routeParams));
            }
            //双向数据绑定模板
            $scope.pmodel = paperModel.model;
                $scope.savePaper = function () {
                    paperService.savePaper($scope.pmodel,function (data) {
                        alert(data);
                    });
                };
    }])
    //试卷删除控制器
    .controller("paperDelController",["$scope",function ($scope) {

    }])
    .factory("paperService",["$http","$httpParamSerializer",
        function ($http,$httpParamSerializer) {
            return {
                savePaper:function (params,handler) {
                    //把对象转化为指定格式
                    var obj = {};
                    for(var key in params){
                        var val = params[key];
                        switch (key){
                            case "departmentId":
                                obj['paper.department.id'] = val;
                                break;
                            case "title":
                                obj['paper.title'] = val;
                                break;
                            case "desc":
                                obj['paper.description'] = val;
                                break;
                            case "at":
                                obj['paper.answerQuestionTime'] = val;
                                break;
                            case "total":
                                obj['paper.totalPoints'] = val;
                                break;
                            case "scores":
                                obj['scores'] = val;
                                break;
                            case "subjectIds":
                                obj['subjectIds'] = val;
                                break;
                        }
                    }
                    console.log(obj);
                    //序列化对象，利用表单方式提交到后台
                    obj = $httpParamSerializer(obj);
                    $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).success(function (data) {
                        handler(data);
                    });
                }
            };
    }])
    .factory("paperModel",function () {
        return {
            //模板    单例  会保留原有数据
            model:{
                departmentId:1,     //方向id
                title:"",   //试卷名称
                desc:"",    //试卷描述
                at:0,       //答题时间，answer time
                total:0,    //总分
                scores:[],     //每个题目的分值
                subjectIds:[],   //每个题目的id
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id);
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject);
            }
        };
    });
