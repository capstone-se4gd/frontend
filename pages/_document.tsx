import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Remove any font preloading here */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}