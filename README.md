Nexus Acceptance Test for Dimitrije Cvetkovic

## Project setup
```
1. npm install
```

### Compiles and hot-reloads for development
```
2. npm run serve
```

3. To actually run the tests you will need to install CORS extension in your browser, and to enable it in your

Notes:
- API that we are using returns wrong results from time to time (e.g. year=2022 and make=Acura returns both 2022 and 2021 years).
I have patched this on the frontend to only show expected results.

- For some reason, devProxy to this API wont work properly. I have lost a fair amount of time configuring it. The way I configure it works for other open APIs (e.g. github), but for some reason this API server refuses these calls. I have already worked this way and configured CORS bunch of times, either as a proxy on a client, or directly on a server. As a bypass here, you will need a CORS browser extension.