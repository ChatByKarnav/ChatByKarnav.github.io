# ChatByKarnav setup notes

## Deploying this update

The site is a static GitHub Pages app and uses the existing Firebase project. Before deploying the new site, replace the current Firestore rules in Firebase Console with the contents of `firestore.rules`. Test the rules in the Firebase Rules Playground or a non-production project first. This ruleset intentionally does not allow access to the legacy `users/{uid}` profile documents because the old app stored email addresses there; public profile data now lives in `publicProfiles/{uid}` and must not contain email addresses.

New data layout:

- `publicProfiles/{uid}`: display name, grade, division, school, bio; no email.
- `global_messages/{messageId}` and its `reactions/{uid}` subcollection.
- `global_typing/{uid}`.
- `conversations/{sortedUid1_sortedUid2}` with `members`, followed by `messages`, `typing`, and `readReceipts` subcollections.
- `users/{uid}/presence/current` and `users/{uid}/blocks/{otherUid}`.
- `reports/{reportId}`.

## Notes / limits

- Browser notifications require the visitor to grant notification permission. The page must be served over HTTPS (GitHub Pages is HTTPS).
- The UI limits message size and applies a small client-side send delay. A client-side delay is not secure anti-spam enforcement; production-grade throttling/moderation needs a trusted Cloud Function or other server-side service. Reports are recorded for an administrator to review; no admin console is included.
- Typing status expires from the UI when the page closes only after Firestore state is cleared; stale typing docs can remain if a client disconnects unexpectedly. Presence is refreshed once per minute; `beforeunload` offline updates are best-effort. For robust disconnect status, use Firebase Realtime Database presence or a trusted backend.
- The app's member search is capped to the first 100 profiles fetched and filtered in the browser. A larger directory needs a dedicated search/index solution.
- Existing accounts continue to authenticate, but existing profile fields are not automatically copied. After deploying the updated rules/site, each member should save their profile once to populate `publicProfiles`; owners may migrate profile documents, excluding email fields.
- Existing global message records are compatible if they have `uid`, `sender`, `text`, and a Firestore timestamp. Make sure Firebase indexes are created if the console requests them.
- The pre-existing Storage avatar upload is not part of this rewrite; current avatars are not migrated to public profiles. Add a dedicated, authenticated Storage ruleset before enabling profile image uploads again.
