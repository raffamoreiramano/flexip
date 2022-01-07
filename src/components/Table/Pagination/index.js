import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import styles from './styles.module.css';

export default function Pagination({
    current = 0,
    total = 1,
    onChange = () => {},
}) {

    const previousProps = () => {
        if (current > 0) {
            return {
                onClick: () => onChange(current - 1),
            }
        }

        return {
            disabled: true,
        }
    }

    const nextProps = () => {
        if (current < total - 1) {
            return {
                onClick: () => onChange(current + 1),
            }
        }

        return {
            disabled: true,
        }
    }


    return (
        <nav className={styles.pagination} style={{ visibility: total > 1 ? 'visible' : 'hidden' }}>
            <label>Página {(current + 1)} de {total}</label>
            <div className={styles.buttons}>
                <button
                    {...previousProps()}
                >
                    <IoIosArrowBack/>
                </button>
                <button
                    {...nextProps()}
                >
                    <IoIosArrowForward/>
                </button>
            </div>
        </nav>
    );
}