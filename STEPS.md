# Steps to run intern against SauceLab by config proxy

1. start hoxy proxy: `node proxy/hoxy-server/index.js`
2. start browsermod proxy server
3. start browsermod proxy by specify upstream httpproxy
4. start har capture by post message to browser proxy
5. chanege proxy port from step 3 to `tests/browsermod.js`
6. start testing: `./node_modules/intern/bin/intern-runner.js config=tests/intern-cx.js`
7. capture har file.

**notes: for step 2,3,4,7, refer to `proxy/browsermod.md`**
