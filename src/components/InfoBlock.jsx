import styles from './InfoBlock.module.css'

export default function InfoBlock({label, value}) {
    return (
        <div className={styles.block}>

            <div className={styles.content}>
                <span className={styles.lavel}>{label}</span>
                <span className={styles.value}>{value}</span>
            </div>
        </div>
    )
}