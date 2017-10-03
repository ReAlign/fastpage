<#--  pageName: 新页面  -->
<#--  author:   -->
<#--  date: 2017/10/04 01:10:15  -->
<@compress>
    <#escape x as x?html>
        <#include "/common/macro.ftl">
    <!DOCTYPE html>
    <html>
    <head>
        <title>新页面</title>
        <@nekcss/>
    </head>
    <body>
        <@menus/>
        <@pageHead title="新页面" />
        <@nekui/>

    <script src="${jslib}define.js?pro=${jspro}"></script>
    <script src="${jspro}pages/index/index.js"></script>
        <@footer/>
    </body>
    </html>
    </#escape>
</@compress>
