<@compress>
    <#escape x as x?html>
        <#include "/common/macro.ftl">
    <!DOCTYPE html>
    <html>
    <head>
        <title>~head_title~</title>
        <@nekcss/>
    </head>
    <body>
        <@menus/>
        <@pageHead title="~header_title~" />
        <@nekui/>

    <script src="${jslib}define.js?pro=${jspro}"></script>
    <script src="${jspro}pages/~newJsPath~/~newJsName~.js"></script>
        <@footer/>
    </body>
    </html>
    </#escape>
</@compress>
