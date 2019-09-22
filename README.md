# best-friends-club
A gathering place for the best of friends

## TODO
Add sockets for interactive game. Use cookies to remember users and generate user names for new clients.
Fix an issue where changing styles causes styled-components to output new hashes that are hard to verify in jest snapshots. Fix with `jest-styled-components`
Fix an issue where saving invalid server code (e.g. syntax error) causes the server to crash and become unrecoverable requiring a full rebuild and restart

## Roadmap
1. Add codename tests
2. Add server-side HMR (working but too many hot update files in build)
3. Implement Code Splitting
4. Switch to SSR
5. Add meta information
6. Get coding!

## Development
```
npm install
npm run init
npm run start
```

Then navigate to http://localhost:8080

## References
React-Typescript cheatsheat
https://github.com/sw-yx/react-typescript-cheatsheet