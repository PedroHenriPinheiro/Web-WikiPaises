import { useParams, useNavigate } from 'react-router-dom'
import { useCountryDetail } from '../hooks/UseCountries'
import InfoBlock from '../components/InfoBlock'
import { useRef, useEffect } from 'react'
import styles from './Detail.module.css'

function formatNumber(n) {
  return n ? n.toLocaleString('pt-BR') : '—'
}

function getLanguages(langs) {
  if (!langs) return '—'
  return Object.values(langs).join(', ')
}

function getCurrency(currencies) {
  if (!currencies) return '—'
  const [key] = Object.keys(currencies)
  const c = currencies[key]
  return `${c.name} (${key}${c.symbol ? ' · ' + c.symbol : ''})`
}

const COUNTRY_CONTENT = {
  BRA: {
    text: 'Brasil: onde o café resolve mais problemas que terapia ☕',
    audio: '/sounds/hino.mp3'
  },
  USA: {
    text: 'Estados Unidos: terra dos filmes de Hollywood e onde tudo parece virar um reboot 🎬'
  },
  JPN: {
    text: 'Japão: tecnologia futurista convivendo perfeitamente com tradições milenares 🤖⛩️'
  },
  DEU: {
    text: 'Alemanha: engenharia de precisão e uma obsessão saudável por organização 🇩🇪'
  },
  FRA: {
    text: 'França: onde até o pão parece ter diploma em gastronomia 🥖'
  }
}

const DEFAULT_DESC =
  'Este país possui uma história rica e uma cultura única, contribuindo de forma significativa para a diversidade e o patrimônio da humanidade.'

export default function Detail() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { country, loading, error } = useCountryDetail(code)

  const audioRef = useRef(null)

  const extra = country ? COUNTRY_CONTENT[country.cca3] : null
  const desc = extra?.text || DEFAULT_DESC

  
  useEffect(() => {
    if (extra?.audio) {
      audioRef.current = new Audio(extra.audio)
    }
  }, [extra])

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <span>Carregando...</span>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>{error || 'País não encontrado.'}</p>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Voltar
        </button>
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        ← Voltar para a lista
      </button>

      <div className={styles.hero}>
        <div className={styles.flagWrap}>
          <img
            src={country.flags?.svg || country.flags?.png}
            alt={`Bandeira de ${country.name.common}`}
            className={styles.flag}
          />
        </div>

        <div className={styles.heroInfo}>
          <h1 className={styles.officialName}>{country.name.official}</h1>
          <h2 className={styles.commonName}>{country.name.common}</h2>
          <div className={styles.codeBadge}>{country.cca3}</div>

          <p className={styles.description}>{desc}</p>

          {extra?.audio && (
            <button
              className={styles.audioBtn}
              onClick={() => audioRef.current?.play()}
            >
              ▶️ Ouvir hino
            </button>
          )}
        </div>
      </div>

      <section>
        <h3 className={styles.sectionTitle}>Informações Gerais</h3>
        <div className={styles.grid}>
          <InfoBlock label="Capital" value={country.capital?.[0]} />
          <InfoBlock label="Continente" value={country.region} />
          <InfoBlock label="Sub-região" value={country.subregion} />
          <InfoBlock
            label="Área (km²)"
            value={
              country.area
                ? country.area.toLocaleString('pt-BR') + ' km²'
                : null
            }
          />
          <InfoBlock
            label="População"
            value={formatNumber(country.population)}
          />
          <InfoBlock
            label="Idiomas"
            value={getLanguages(country.languages)}
          />
          <InfoBlock
            label="Moeda"
            value={getCurrency(country.currencies)}
          />
          <InfoBlock label="Código (cca3)" value={country.cca3} />
        </div>
      </section>

      {country.borders?.length > 0 && (
        <section className={styles.borders}>
          <h3 className={styles.sectionTitle}>Países Vizinhos</h3>
          <div className={styles.borderTags}>
            {country.borders.map(b => (
              <button
                key={b}
                className={styles.borderTag}
                onClick={() => navigate(`/country/${b}`)}
              >
                {b}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}