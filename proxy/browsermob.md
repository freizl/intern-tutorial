# Start BMP master server

  - `/home/beanstock/Downloads/browsermob-proxy-2.0-beta-9/bin/browsermob-proxy`

# Start a slave proxy

  - `curl -X POST http://localhost:8080/proxy`
     will return a port for new proxy

  - start a proxy with upstream proxy
    `curl -X POST http://localhost:8080/proxy?httpProxy=localhost:9876`

# Capture HAR

  1. `curl -X PUT -d 'initialPageRef=Foo' http://localhost:9090/proxy/9091/har'`
  2. start testing
  3. `curl http://localhost:8080/proxy/9091/har -o result.har`

# Reference

  1. https://support.saucelabs.com/entries/37604494-BrowserMob-with-Sauce-Connect-4
