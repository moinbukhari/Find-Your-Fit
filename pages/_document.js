import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <meta property="og:title" content="Find Your Fit" key="title"/>
        <meta property="og:description" content="a place to generate your personalised workout plan in minutes
" key="description"/>
        <meta
          property="og:image"
          content="https://i.imgur.com/xJ3VOub.png"
        />
        <Script
          id="posthog"
          dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_F1ZAKe6pt6TXiHNqRiDRpdMjjHDzn6JZeuWN3l4PyzJ',{api_host:'https://eu.posthog.com'})`,
          }}
        />
        
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
