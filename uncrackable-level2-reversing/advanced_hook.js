// simple_hook.js - Final Bypass based on Shay's IDA Research

Java.perform(function() {
    console.log("[*] Frida Loaded. Applying Shay's Logic...");

    // 1. מעקף ROOT (שלב 8 ב-WriteUp) [cite: 8, 11]
    var System = Java.use("java.lang.System");
    System.exit.overload("int").implementation = function(code) {
        console.log("[*] Root detection bypassed! App stays alive.");
    };

    // 2. Full Bypass - Hooking the Java side of the Native method [cite: 6, 81-84]
    // מכיוון ש'bar' היא פונקציית native, Hook בג'אווה יתפוס אותה לפני שהיא עוברת ל-C
    var CodeCheck = Java.use("sg.vantagepoint.uncrackable2.CodeCheck");
    CodeCheck.bar.implementation = function(input) {
        console.log("[!] Intercepted CodeCheck.bar() - Forcing Success!");
        return true; // הניצחון הסופי
    };
});

// 3. חילוץ המפתח (שלב 7 ב-WriteUp) [cite: 85-91]
// ננסה להצמיד את ה-Native Hook בנפרד כדי לא להפיל את כל הסקריפט
try {
    var strncmp = Module.findExportByName("libc.so", "strncmp");
    if (strncmp) {
        Interceptor.attach(strncmp, {
            onEnter: function(args) {
                var s2 = args[1].readUtf8String();
                if (s2 && s2.indexOf("Thanks for all the fish") !== -1) {
                    console.log("\n[🔥 BINGO] Secret Key Found in Memory: " + s2);
                }
            }
        });
    }
} catch (e) {
    console.log("[!] Native Bridge unstable, but Java Bypass is active.");
}
