// agent/index.ts

declare var Java: any;

/**
 * פונקציה לעטיפת הלוגיקה כדי למנוע שגיאות TypeError בזמן הטעינה
 */
(function main() {
    // 1. מעקף ROOT וסגירת אפליקציה (שלב 8 ב-WriteUp) [cite: 8, 11]
    Java.perform(function() {
        var System = Java.use("java.lang.System");
        System.exit.overload("int").implementation = function(code: number) {
            console.log("[*] App tried to close (System.exit). Root detection bypassed!");
        };
    });

    // איתור כתובות הפונקציות ב-Native Pointer [cite: 7, 85]
    var barAddr = (Module as any).findExportByName("libfoo.so", "Java_sg_vantagepoint_uncrackable2_CodeCheck_bar");
    var strncmpAddr = (Module as any).findExportByName("libc.so", "strncmp");

    // 2. מעקף מלא - מאפשר ללחוץ VERIFY בלי להזין כלום [cite: 83, 84]
    if (barAddr) {
        Interceptor.attach(barAddr, {
            onLeave: function(retval: any) {
                console.log("[!] Bypassing Validation Check (bar)... Forcing return to TRUE");
                // כפיית תוצאה חיובית (1) כפי שזיהית ב-IDA [cite: 74]
                retval.replace(ptr(1)); 
            }
        });
    }

    // 3. חילוץ המפתח ב-strncmp (שלב 7 ב-WriteUp) [cite: 85-91]
    if (strncmpAddr) {
        Interceptor.attach(strncmpAddr, {
            onEnter: function(args: any) {
                try {
                    var s2 = args[1].readUtf8String();
                    var secret = "Thanks for all the fish"; // המפתח שמצאת ב-IDA [cite: 59]

                    if (s2 && s2.indexOf(secret) !== -1) {
                        console.log("\n[!] Bridge Intercepted!"); // [cite: 92]
                        console.log("[+] User Input: " + args[0].readUtf8String()); // [cite: 93]
                        console.log("[+] Secret Key: " + s2); // [cite: 94]
                    }
                } catch (e) {
                    // התעלמות מקריאות זיכרון לא תקינות
                }
            }
        });
    }
    
    console.log("[+] Hook script loaded successfully. Waiting for input...");
})();