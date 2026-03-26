# Android Native & JNI Reverse Engineering (UnCrackable Level 2)

**Techniques Demonstrated:** Static/Dynamic Analysis, JNI (Java Native Interface) Analysis, Anti-Debugging Bypass, Dynamic Binary Instrumentation (DBI) via Frida.

## 📝 Objective
The goal of this challenge is to bypass root detection and anti-debugging mechanisms in an Android application to extract a hidden secret key. The core validation logic is implemented within a native C/C++ library (`libfoo.so`).

## 🔍 Stage 1: Static Analysis & JNI Discovery
Initial static analysis using JADX revealed that the critical verification function was defined with the `native` keyword. This indicated that the execution flow crosses the JNI boundary into a compiled native library.

1. I extracted the APK and located the `libfoo.so` native library.
2. Loading the library into IDA Pro and examining the **Exports** table, I identified the JNI signature to find the exported function: `Java_sg_vantagepoint_uncrackable2_CodeCheck_bar`.

## 🛡️ Stage 2: Analyzing the Anti-Debugging Mechanism
Before diving into the core logic, I noticed a mechanism writing a value to a `flag` variable. Analyzing the disassembly of the initialization function (`sub_8D0`), I uncovered a Linux kernel-level anti-debugging trick:
* The application invokes `fork()` to create a child process.
* The child process immediately executes `ptrace(PTRACE_ATTACH, parent_pid, 0, 0)` on its parent.
* It then enters an infinite `waitpid` loop.

Since Linux allows only one debugger to attach to a process at a time via `ptrace`, this effectively locks out external debuggers (like GDB or IDA debugger) from attaching to the parent process, preventing dynamic analysis.

## ⚙️ Stage 3: Reversing the JNI Bridge Logic
Looking at the core validation function `CodeCheck_bar`, I identified the execution flow:
* The function first checks if `flag == 1` (likely a Root/Tamper detection check). If the flag is set, the Zero Flag is triggered after the `CMP` instruction, bypassing the conditional jump (`JNZ`) and forcing the execution into the validation logic.
* **The JNI Bridge (הגישור):** The function utilizes JNIEnv offsets to pull the user's input from the Java layer (using `GetByteArrayElements` at offset `1472LL`) and compares it against a hardcoded secret string stored in the native memory (`"Thanks for all the fish"`).
* The final comparison is performed using the standard C library function `strncmp`.

## 💉 Stage 4: Dynamic Instrumentation (Frida Hooking)
While I could patch the binary statically in IDA, bypassing the `ptrace` kernel lock dynamically is a much more elegant approach that avoids breaking the APK signature. I opted to use **Inline Hooking** via Frida (DBI).

Instead of modifying the application's code, I wrote a Frida script to hook the `strncmp` function directly inside `libc.so`. The detour intercepts the execution pointer right when `strncmp` is called, allowing me to dump the arguments in memory.

```javascript
// Locate the "strncmp" function inside the standard C library
var strncmpPtr = Module.findExportByName("libc.so", "strncmp");

Interceptor.attach(strncmpPtr, {
    onEnter: function(args) {
        // Read the arguments being compared
        var arg0 = Memory.readUtf8String(args[0]); // User Input
        var arg1 = Memory.readUtf8String(args[1]); // The Secret Key

        // Filter out background strncmp calls to find our target string
        if (arg1.indexOf("Thanks for all the fish") !== -1) {
            console.log("\n[!] Bridge Intercepted!");
            console.log("[+] User Input: " + arg0);
            console.log("[+] Secret Key: " + arg1);
        }
    }
});
```

## 🚩 The Result
Injecting the Frida script at runtime successfully bypassed the `ptrace` anti-debugging lock without requiring any modifications to the APK. As soon as the application attempted to validate the input, the JNI bridge was intercepted, and the hidden secret key was extracted from memory seamlessly.

*Submitted on: 26/03/2026*
