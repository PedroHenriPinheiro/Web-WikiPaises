import { useState, useMemo } from 'react'
import { useCountries } from '../hooks/UseCountries'
import Card from '../components/Card'
import styles from './Home.module.css'

const REGIONS = ['Americas', 'Europe', 'Asia', 'Africa', 'Oceania']
const PAGE_SIZE = 24

export default function Home() {
  const { countries, loading, error } = useCountries()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = countries
    if (region) list = list.filter(c => c.region === region)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c => c.name.common.toLowerCase().includes(q))
    }
    return list
  }, [countries, region, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  function handleRegion(r) {
    setRegion(prev => prev === r ? '' : r)
    setPage(1)
  }

  if (error) return <div className={styles.msg}>{error}</div>

  return (
    <main className={styles.main}>
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar país..."
            value={search}
            onChange={handleSearch}
            className={styles.search}
          />
        </div>
        <div className={styles.filters}>
          {REGIONS.map(r => (
            <button
              key={r}
              className={`${styles.filterBtn} ${region === r ? styles.active : ''}`}
              onClick={() => handleRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Carregando países...</span>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            {filtered.length} país{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className={styles.grid}>
            {paginated.map(c => (
              <Card key={c.cca3} country={c} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
