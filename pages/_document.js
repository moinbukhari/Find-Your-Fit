import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Find Your Fit" key="title"/>
        <meta property="og:description" content="a place to generate your personalised workout plan in minutes
" key="description"/>
        <meta
          property="og:image"
          content="https://i.imgur.com/xJ3VOub.png"
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
