Java.perform(function() {
    console.log("[*] Frida Loaded");

    var System = Java.use("java.lang.System");
    System.exit.overload("int").implementation = function(code) {
        console.log("[*] System.exit blocked");
    };

    var CodeCheck = Java.use("sg.vantagepoint.uncrackable2.CodeCheck");

    CodeCheck.bar.overload('[B').implementation = function(input) {
        console.log("[🔥] Bypass!");
        return true;
    };
});
