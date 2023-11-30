import Link from 'next/link'
import {
  SuccessContainer,
  ImageContainer,
  TextContainer,
} from '../styles/pages/success'
import { GetServerSideProps } from 'next'
import { stripe } from '../lib/stripe'
import Stripe from 'stripe'
import Image from 'next/image'
import Head from 'next/head'

type SuccessProps = {
  customerName: string
  product: {
    name: string
    imageUrl: string
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra realizada!</title>
      </Head>

      <SuccessContainer>
        <h1>Compra efetuada!</h1>

        <ImageContainer>
          <Image src={product.imageUrl} alt="" width={120} height={110} />
        </ImageContainer>

        <TextContainer>
          Uhuul <strong>{customerName}</strong>, sua{' '}
          <strong>{product.name}</strong> já está a caminho da sua casa.{' '}
        </TextContainer>

        <Link href="/">Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sessionId = String(query.session_id)
  let customerName = null
  let product = null

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })

    customerName = session.customer_details?.name
    product = session.line_items?.data[0].price?.product as Stripe.Product
  } catch {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      customerName,
      product: {
        name: product?.name ?? '',
        imageUrl: product?.images[0] ?? '',
      },
    },
  }
}
