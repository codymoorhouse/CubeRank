

$(document).ready(function () {
    var stringFrom = "Email From : ";
    var newLine = "\n";
    var from, to, subject, text;
    $("#send_email").click(function () {
        to = "adamepp123@gmail.com"; // we change this to our receiving one later
        from = $("#from").val();
        subject = $("#subject").val();
        text = $("#content").val();
        $("#message").text("Sending E-mail...Please wait");
        $.get("http://localhost:3000/send", {to: to, subject: subject, text: stringFrom.concat(from,newLine,text)}, function (data) {
            if (data == "sent") {
                $("#message").empty().html("Email has been sent");
            }

        });
    });
});

(function(angular) {
    'use strict';
    var app = angular.module('contact', []);

    app.controller('contactCtrl', function() {});
})(window.angular);