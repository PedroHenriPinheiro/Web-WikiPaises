import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE = 'https://restcountries.com/v3.1'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${BASE}/all?fields=name,flags,capital,region,subregion,population,cca3`)
      .then(res => {
        const sorted = res.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        )
        setCountries(sorted)
      })
      .catch(() => setError('Não foi possível carregar os países.'))
      .finally(() => setLoading(false))
  }, [])

  return { countries, loading, error }
}

// export function useCountryDetail(code) {
//   const [country, setCountry] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     if (!code) return
//     setLoading(true)
//     axios
//       .get(`${BASE}/alpha/${code}`)
//       .then(res => setCountry(Array.isArray(res.data) ? res.data[0] : res.data))
//       .catch(() => setError('País não encontrado.'))
//       .finally(() => setLoading(false))
//   }, [code])

//   return { country, loading, error }
// }


export function useCountryDetail(code) {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code) return

    let active = true
    Promise.resolve().then(() => {
      if (active) setLoading(true)
    })

    axios
      .get(`${BASE}/alpha/${code}`)
      .then(res => {
        if (active) setCountry(Array.isArray(res.data) ? res.data[0] : res.data)
      })
      .catch(() => {
        if (active) setError('País não encontrado.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [code])

  return { country, loading, error }
}