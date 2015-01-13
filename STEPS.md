# Steps to run intern against SauceLab by config proxy

1. start hoxy proxy
  - `node proxy/hoxy-server/index.js`

2. start browsermod proxy server
  - `/home/beanstock/Downloads/browsermob-proxy-2.0-beta-9/bin/browsermob-proxy`

3. start browsermod proxy by specify upstream httpproxy
  - `curl -X POST -d 'port=9876' http://localhost:8080/proxy?httpProxy=localhost:9900`

4. run `start-tests.sh`

```
1. start har capture by post message to browser proxy
2. start testing: `./node_modules/intern/bin/intern-runner.js config=tests/intern-cx.js`
3. capture har file.
```
