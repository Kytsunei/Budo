<html>
<head>

    <title>Budo | Prototype</title>

    <link rel="stylesheet" href="Style.css" type="text/css">
    <!-- Library Inclusions; -->
    <script src="Libraries/jquery-2.1.4.js" type="text/javascript"></script>
    <script src="Libraries/TestDataLibrary.js" type="text/javascript"></script>
    <script src="Libraries/Utility.js" type="text/javascript"></script>
    <script src="Libraries/DataTypes.js" type="text/javascript"></script>
    <!-- Object Inclusions; -->
    <script src="Tengu/ScheduleMaker.js" type="text/javascript"></script>
    <script src="Tengu/ScriptMaker.js" type="text/javascript"></script>
    <!-- Object Inclusions; -->
    <script src="DataEngine.js" type="text/javascript"></script>
    <script src="DisplayEngine.js" type="text/javascript"></script>
    <script src="Tengu.js" type="text/javascript"></script>
    <script src="Application.js" type="text/javascript"></script>

    <script>

        var application = new ApplicationEngine();
        $(document).ready(function () {
            console.log("Document ready, initializing application.");
            application.initialize();
        });

        // Throw-Away Button Functionality;
        function refresh(cookie_action) {
            if (cookie_action === 'keep') {
                window.location.reload();
            } else if (cookie_action === 'clear') {
                application.data.clearCookie('profile_id');
                application.data.clearCookie('bookmark');                document.cookie = "";
                window.location.reload();
            } else {
                console.log('Misuse of refresh function parameters.')
            }
        }
        function loginAs (id) {
            application.quickLogin(id);
        }

    </script>

</head>
<body>

<div id="settings_div">
    <div id="save_output">ajax : false</div>
    <div id="ears_output">listening : false</div>
    <div id="mouth_output">speaking : false</div>
</div>

<div id="page_div"></div>
<div id="refresh_button_1" onclick="refresh('keep')">Refresh</div>
<div id="refresh_button_2" onclick="refresh('clear')">Clear Cookies <br/>and Refresh</div>
<div id="log_button" onclick="application.data.log()">Log Data</div>

<div id="login_as_boxer" class="quick_login" onclick="loginAs(1)">User 1: Boxer</div>
<div id="login_as_tangsoo" class="quick_login" onclick="loginAs(2)">User 2: TangSoo</div>
<div id="login_as_kungfu" class="quick_login" onclick="loginAs(3)">User 3: KungFu</div>
<div id="login_as_boxerbro" class="quick_login" onclick="loginAs(4)">User 4: BoxerBro</div>
<div id="login_as_tangtwo" class="quick_login" onclick="loginAs(5)">User 5: TangTwo</div>

</body>
</html>