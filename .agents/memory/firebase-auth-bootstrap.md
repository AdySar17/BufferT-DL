---
name: Firebase Auth bootstrap
description: Durable rules for preventing authentication flicker across the app's static pages and React entry point.
---

Firebase Auth must be initialized through one canonical module URL across every page. Configure browser-local persistence before registering the first auth-state listener, process redirect results before exposing the first resolved state, and never infer “signed out” from a timeout or a localStorage marker.

**Why:** Query-string variants of the auth module create separate browser module instances, and resolving the Header before Firebase finishes restoration produces a false sign-in state during navigation.

**How to apply:** Let the Header render a loading state until Firebase emits its first real state; once a user exists, render that identity immediately from Auth while Firestore role/profile hydration happens separately. Use Firestore only for app metadata and authorization roles, not to decide whether Firebase Auth is signed in.