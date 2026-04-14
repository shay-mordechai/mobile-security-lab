# Mobile Security & Reverse Engineering Lab

Welcome to my Mobile Security Research Laboratory. This repository contains write-ups, custom scripts, and research notes from my work analyzing Android applications, bypassing anti-analysis mechanisms, and performing Dynamic Binary Instrumentation (DBI).

## 🏗️ Lab Architecture & Tooling Strategy
To maintain a clean and reproducible research environment, this lab utilizes a containerized architecture (ארכיטקטורה מבוססת קונטיינרים):

* **The Host OS & Emulator:** The Android Virtual Device (AVD) runs natively on the host operating system (Fedora), acting as an independent target environment.
* **Isolated Toolchain (Distrobox):** All offensive security tools (Frida, ADB, JADX) are containerized within a Distrobox environment. This keeps the host system clean and prevents dependency conflicts (התנגשויות תלויות).
* **The Bridge (ADB):** Android Debug Bridge acts as a virtual network cable, crossing the container's boundary to connect the isolated tools with the host-level emulator.
* **Dynamic Instrumentation (Frida):** Android applications run on **ART** (Android Runtime). Frida embeds a miniature **V8** engine to parse JavaScript hook scripts, translating them Just-In-Time (JIT) into CPU-level Assembly instructions. These instructions are injected directly into the application's native memory space, allowing runtime hooking of core OS libraries (like `libc.so`).

## 🚀 Research Projects & Challenges

### 🔓 [UnCrackable Level 2](./uncrackable-level2-reversing)
Bypassing Linux kernel-level anti-debugging (`ptrace`) and extracting hidden secret keys from a native C/C++ JNI library (`libfoo.so`) using Frida inline hooking.

---
*Future targets waiting in the lab:*
* *UnCrackable Level 1*
* *UnCrackable Level 3*
* *InsecureBankv2*
