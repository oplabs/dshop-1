import { useEffect, useState } from 'react'
import memoize from 'lodash/memoize'

import { useStateValue } from 'data/state'
import useConfig from 'utils/useConfig'
import useBackendApi from 'utils/useBackendApi'

const getProducts = memoize((url) => fetch(url).then((r) => r.json()))

function useProducts() {
  const [{ products, productIndex, reload }, dispatch] = useStateValue()
  const { config } = useConfig()
  const { get } = useBackendApi()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function fetchProducts() {
    setLoading(true)
    try {
      let products = []
      if (config.isAffiliate) {
        products = await get('/affiliate/products')
      } else {
        products = await getProducts(`${config.dataSrc}products.json`)
      }
      dispatch({ type: 'setProducts', products })
      setLoading(false)
    } catch (e) {
      setError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (reload.products) {
      getProducts.cache.clear()
    }
    if (config.dataSrc) {
      fetchProducts()
    }
  }, [config.dataSrc, reload.products])

  return { products, productIndex, loading, error }
}

export default useProducts
