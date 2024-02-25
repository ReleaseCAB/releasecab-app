Release CAB UI
==============

Tech Stack
----------

- React
- Nextjs
- Chakra UI (leverage this whenever possible)

Page Authentication
-------------------

- Each page must have a guard on them. Right now we have "WithAuthGuard" and "WithoutAuthGuard".
  "WithAuthGuard" is to protect unauthenticated users from viewing the page, and "WithAuthGuard"
  is to protect authenticated users from viewing the page (like login page). Wrap each page in a
  guard, and if a new guard is needed for your use case add it. NO ROUTE SHOULD BE WITHOUT A GUARD.
- Each API call should have ``await ApiAuth();`` as the first thing it does. This ensures the user's token is valid and refreshed before ever making the call. The rest is magic, JWT token authentication should just work.

Time
----

- The server stores all dates/times in UTC. There is a TimeConverter utils helper which has a function to convert from UTC to the user's timezone.
- The UI should send a date with a timezone added to the backend, and the backend will automatically convert to UTC. Please ensure anything you send to the backend has a timezone.

URLs
----

- Frontend is served at localhost:3000
