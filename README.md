# 📱 Mobile Security & Reverse Engineering Lab

A collection of high-level Android security research, focused on dynamic binary instrumentation (DBI) and native code analysis.

## 🔍 Key Research Areas
- **Anti-Debugging Bypass:** Neutralizing Linux-level protections like `ptrace` in native code.
- **Dynamic Instrumentation:** Hooking JNI boundaries and Java methods using **Frida**.
- **Static Analysis:** Mapping ARM64 assembly and decompiling APKs via **JADX** and **IDA Pro**.

## 🛠️ Lab Structure
- **uncrackable-level2-reversing:** Complete walkthrough and JS hooks for bypassing root detection and integrity checks in the OWASP UnCrackable L2 challenge.
- **frida-ts-agent:** A structured TypeScript-based Frida agent for clean, type-safe instrumentation.
- **insecure-bank-v2:** Analysis of common mobile vulnerabilities (IDORs, insecure data storage).

## 🚀 Featured Tooling
- **Frida:** For runtime manipulation and inline hooking.
- **JADX/IDA Pro:** For deep-dive static analysis.
- **Python/TypeScript:** Automation scripts for malware triage and behavior analysis.
