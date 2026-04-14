setImmediate(function () {
    var target = Module.findExportByName("libfoo.so",
        "Java_sg_vantagepoint_uncrackable2_CodeCheck_bar");

    if (!target) {
        setTimeout(arguments.callee, 100);
        return;
    }

    Interceptor.attach(target, {
        onLeave: function (retval) {
            console.log("🔥 ORIGINAL:", retval);
            retval.replace(1);
            console.log("🔥 BYPASSED!");
        }
    });
});
