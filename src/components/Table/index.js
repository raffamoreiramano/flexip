import styles from './styles.module.css';

export default function Table({
    id,
    className,
    children,
    thead,
}) {
    let props = {
        className: styles.table,
    };

    if (id) {
        props.id = id;
    }

    if (className) {
        props.className += " " + className;
    }

    return (
        <table {...props}>
            {
                thead && (
                    <>
                        <colgroup>
                            {
                                thead.map(col => (<col width={col.width} />))
                            }
                        </colgroup>
                        <thead>
                            <tr>
                                {
                                    thead.map(th => (<th align={th.align}>{th.heading}</th>))
                                }
                            </tr>
                        </thead>
                    </>
                )
            }
            {children}
        </table>
    );
}