import styles from './styles.module.css';

export default function Table({
    id,
    className,
    children,
}) {
    let props = {
        children,
        className: styles.table,
    };

    if (id) {
        props.id = id;
    }

    if (className) {
        props.className += " " + className;
    }

    return <table {...props} />;
}