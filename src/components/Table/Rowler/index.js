import styles from './styles.module.css';

export default function Rowler({
    id,
    rows,
    onChange = () => {},
}) {
    return (
        <nav className={styles.rowler}>
            <label htmlFor={id || styles.rowler}>Linhas por página: </label>
            <input
                id={id || styles.rowler}
                type="number"
                name="rows"
                min={1}
                max={200}
                value={rows}
                onFocus={(event) => {
                    const root = document.getElementById('root');
                    const input = event.currentTarget;

                    const onWheel = event => event.stopPropagation();

                    root.addEventListener('wheel', onWheel, true);

                    const onBlur = () => {    
                        root.removeEventListener('wheel', onWheel);
                    }

                    input.removeEventListener('blur', onBlur);
                    input.addEventListener('blur', onBlur);
                }}
                onChange={(event) => {
                    onChange(parseInt(event.target.value));
                }}
            />
        </nav>
    );
}