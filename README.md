# A testing API for disc golf throw data fetched from GCP Cloud SQL MySQL database

First install dependencies with `npm i`

Build and run the API with `npm run serve`

If a database connection can't be formed, check that the server's network is in authorized networks in GCP.

For realtime updating, socket.io is used. An event is emitted to the frontend anytime the insert endpoint is called. The frontend should refetch throw data upon receiving that event.
