import type { AppProps } from 'next/app'
import { Container, Header } from '../styles/pages/app'
import { globalStyles } from '../styles/global'

import LogoImage from '../assets/logo.svg'
import Image from 'next/image'

globalStyles()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={LogoImage} alt='' />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
