# ChatByKarnav

Static GitHub Pages chat backed by Firebase Authentication and Cloud Firestore.

## Deploy

1. Review `firestore.rules` and test it in Firebase's Rules Playground or a non-production project.
2. Publish those Firestore rules in Firebase Console. The old blanket signed-in rule exposes all documents and should be replaced.
3. GitHub Pages publishes `index.html` from the configured branch. Browser notifications require HTTPS and the visitor's permission.

Features in the current client: community and member-to-member chat, message replies, emoji reactions, unread markers, browser notifications, typing indicators, online presence, loaded-message search and older-message pagination, profile bios, and block/report controls.

## Important constraints

- This app uses client-side Firebase SDK. Client-side send delays are not security controls. For abuse-resistant rate limits, report review/moderation actions, and reliable offline presence, use a trusted backend/Cloud Functions or Realtime Database presence integration.
- Blocking hides blocked users' messages in this browser and Firestore rules prevent private messages while either participant blocks the other. Global messages are shared room content and cannot be individually hidden by Firestore query security rules; each browser filters its locally blocked senders.
- Browser notification popups only work while the app is open. Background push requires a service worker and Firebase Cloud Messaging setup.
- Profiles intentionally omit email. Existing profile documents in `users/{uid}` are not automatically migrated; members should save their new profile once. Do not copy email into `publicProfiles`.
- Conversation unread markers are derived from the latest message time and read receipt, not a fully reliable badge counter in every offline/race condition.
- Search currently scans the first 100 profiles; use a search service for larger directories.
- Presence heartbeat and `beforeunload` offline updates are best-effort; a user may appear online briefly after disconnecting.
- Rules do not enable Firebase Storage avatar uploads. Configure separate Storage rules before using profile photos.
- Firestore may prompt creation of indexes for compound queries.
