import { GetStaticPaths, GetStaticProps } from 'next'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/produt'

import Image from 'next/image'
import axios from 'axios'
import { stripe } from '../../lib/stripe'
import Stripe from 'stripe'
import { useState } from 'react'
import Head from 'next/head'

type ProductProps = {
  product: {
    id: string
    name: string
    description: string
    price: string
    imageUrl: string
    defaultPriceId: string
  } | null
}

export default function Product({ product }: ProductProps) {
  const [isCreatedCheckoutSession, setIsCreatedCheckoutSession] =
    useState(false)

  async function handleBuyProduct() {
    try {
      setIsCreatedCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product?.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch {
      setIsCreatedCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
      <Head>
        <title>{product?.name}</title>
      </Head>

      {product ? (
        <ProductContainer>
          <ImageContainer>
            <Image src={product.imageUrl} width={520} height={480} alt="" />
          </ImageContainer>

          <ProductDetails>
            <h1>{product.name}</h1>
            <span>{product.price}</span>
            <p>{product.description}</p>

            <button
              onClick={handleBuyProduct}
              disabled={isCreatedCheckoutSession}
            >
              Comprar agora
            </button>
          </ProductDetails>
        </ProductContainer>
      ) : (
        <p>Produto inválido</p>
      )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string }

  let product = null
  let price = null

  try {
    product = await stripe.products.retrieve(id, {
      expand: ['default_price'],
    })

    price = product.default_price as Stripe.Price
  } catch {}

  return {
    props: {
      product: product
        ? {
            id,
            name: product.name,
            description: product?.description ?? '',
            price: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format((price?.unit_amount ?? 0) / 100),
            imageUrl: product.images[0],
            defaultPriceId: price?.id,
          }
        : null,
    },
    revalidate: 60 * 60 * 1, // 1 Hour
  }
}
