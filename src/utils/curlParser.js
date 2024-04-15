const words = require('shellwords');

/**
 * Attempt to parse the given cURL string.
 */
exports.parse = function(s) {
  if (!s.startsWith('curl ')) return;

  const args = rewrite(words.split(s));
  const out = { method: 'GET', headers: {} };
  let state = '';

  args.forEach(function(arg) {
    switch (true) {
      case isURL(arg):
        out.url = arg;
        break;

      case arg === '-A' || arg === '--user-agent':
        state = 'user-agent';
        break;

      case arg === '-H' || arg === '--header':
        state = 'header';
        break;

      case arg === '-d' || arg === '--data' || arg === '--data-ascii':
        state = 'data';
        break;

      case arg === '-u' || arg === '--user':
        state = 'user';
        break;

      case arg === '-I' || arg === '--head':
        out.method = 'HEAD';
        break;

      case arg === '-X' || arg === '--request':
        state = 'method';
        break;

      case arg === '-b' || arg === '--cookie':
        state = 'cookie';
        break;

      case arg === '--compressed':
        out.headers['Accept-Encoding'] = out.headers['Accept-Encoding'] || 'deflate, gzip';
        break;

      case !!arg:
        switch (state) {
          case 'header':
            const field = parseField(arg);
            out.headers[field[0]] = field[1];
            state = '';
            break;
          case 'user-agent':
            out.headers['User-Agent'] = arg;
            state = '';
            break;
          case 'data':
            if (out.method === 'GET' || out.method === 'HEAD') out.method = 'POST';
            out.headers['Content-Type'] = out.headers['Content-Type'] || 'application/x-www-form-urlencoded';
            out.body = out.body ? out.body + '&' + arg : arg;
            state = '';
            break;
          case 'user':
            out.headers['Authorization'] = 'Basic ' + Buffer.from(arg).toString('base64');
            state = '';
            break;
          case 'method':
            out.method = arg;
            state = '';
            break;
          case 'cookie':
            out.headers['Cookie'] = arg;
            state = '';
            break;
        }
        break;
    }
  });

  return out;
};

/**
 * Rewrite args for special cases such as -XPUT.
 */
function rewrite(args) {
  return args.reduce(function(args, a) {
    if (a.startsWith('-X')) {
      args.push('-X');
      args.push(a.slice(2));
    } else {
      args.push(a);
    }
    return args;
  }, []);
}

/**
 * Parse header field.
 */
function parseField(s) {
  return s.split(/: (.+)/);
}

/**
 * Check if `s` looks like a URL.
 */
function isURL(s) {
  return /^https?:\/\//.test(s);
}
