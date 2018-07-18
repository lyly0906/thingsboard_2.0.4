/*
 * Copyright © 2016-2018 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable import/no-unresolved, import/default */

import logoSvg from '../../svg/logo_title_white.svg';

/* eslint-enable import/no-unresolved, import/default */
/*eslint-disable*/
/*@ngInject*/
export default function LoginController(toast, loginService, userService/*, $rootScope, $log, $translate*/) {
    var vm = this;

    vm.logoSvg = logoSvg;

    vm.user = {
        name: '',
        password: ''
    };

    vm.login = login;
    vm.signUp = signUp;

    function doLogin() {
        loginService.login(vm.user).then(function success(response) {
            var token = response.data.token;
            var refreshToken = response.data.refreshToken;
            userService.setUserFromJwtToken(token, refreshToken, true);
        }, function fail(/*response*/) {
            /*if (response && response.data && response.data.message) {
                toast.showError(response.data.message);
            } else if (response && response.statusText) {
                toast.showError(response.statusText);
            } else {
                toast.showError($translate.instant('error.unknown-error'));
            }*/
        });
    }

    function login() {
        doLogin();
    }

    function signUp(){
        $('#signup-modal').show();
        $('.close').click(function(){
            $('#signup-modal').hide();
        });
        $("input[name='email']").bind("input propertychange change",function(event){
            $(".error").html("");
        });
        $(":input[name='UserAccount']").click(function(){
            $('.error').html("");
            if($("input[name='email']").val() == ""){
                $(".error").html("邮箱不能为空！");
                return false;
            }
            if(!$("input[name='email']").val().match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {

                $(".error").html("邮箱格式不正确！请重新输入");
                return false;
            } else {
                var mail = $("input[name='email']").val();
                $.ajax({
                    type: "POST",
                    url: "/api/noauth/createAccount",
                    data: JSON.stringify({"email": mail}),
                    contentType: "application/json",
                    dataType: "json",
                    success: function (res) {
                        console.log(res);
                        if(res.name == "isActive"){
                            $(".error").html("该邮箱已激活！");
                            $("input[name='email']").val("");
                        }else{
                            $(".error").html("激活邮件已成功发送！");
                            $("input[name='email']").val("");
                        }
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {//这个error函数调试时非常有用，如果解析不正确，将会弹出错误框　　　　
                        console.log(XMLHttpRequest.responseText);
                        console.log(XMLHttpRequest.status);
                        console.log(XMLHttpRequest.readyState);
                        console.log(textStatus); // parser error;
                        var errorJson = JSON.parse(XMLHttpRequest.responseText);
                        if(XMLHttpRequest.status == 400){
                            $(".error").html(errorJson.message);
                        }
                    }
                });
            }
        });
    }
}
/*eslint-enable*/