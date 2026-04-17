import { useNavigate } from 'react-router-dom'
import styles from './Card.module.css'

const REGION_COLORS = {
    Africa: {bg: '#2d1b0e', text: '#f59e0b', border: '#78350f'},
    Americas: {bg: '#0d2618', text: '#34d399', border: '#065f46'},
    Asia: {bg: '#0d1f38', text: '#60a5fa', border: '#1e40af'},
    Europe: {bg: '#1a0d2e', text: '#a78bfa', border: '#5b21b6'},
    Oceanbia: {bg: '#0d2626', text: '#2dd4bf', border: '#0f766e'}
}


function formatPopulation(n) {
    if(n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
    
    if(n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'

    if(n >= 1_000) return (n / 1_000).toFixed(1) + 'K'

    return n.toLocaleString()
}


export default function Card({ country }) {
    const navigate = useNavigate()
    const region = country.region || 'Other'
    const colors = REGION_COLORS[region] || {bg: '#1a1f2e', text: '#94a3b8', border: '#334155'}

    return(
        <article
            className={styles.card}
            onClick={() => navigate(`/country/${country.cca3}`)}
            role='button'
            tabIndex={0}
            aria-label={`Ver detalhes de ${country.name.common}`}
        >
            <div className={styles.flagWrap}>
                <img
                    src={country.flags?.svg || country.flags?.png}
                    alt={`Bandeira de ${country.name.common}`}
                    className={styles.flag}
                    loading="lazy"
                />
            </div>
            <div>
                <div className={styles.body}>
                    <h2 className={styles.name}>{country.name.common}</h2>
                    <div className={styles.meta}>
                        <span className={styles.capital}>
                            {country.capital?.[0] || '-'}
                        </span>
                        <span
                            className={styles.badge}
                            style={{background: colors.bg, color: colors.text, borderColor: colors.border}}
                        >
                            {region}
                        </span>
                    </div>
                    <div className={styles.pop}>
                        <span className={styles.popLabel}>População</span>
                        <span className={styles.popValue}>{formatPopulation(country.population)}</span>
                    </div>
                </div>
            </div>
        </article>
    )
}