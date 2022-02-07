import React from "react";

import { BRLMask } from "../../../../services/helpers";

import Table from "../../../../components/Table";

import styles from '../styles.module.css';

export default function Extract({ data }) {
    let total;

    if (!data) {
        data = {
            telephones: {
                label: 'Telefone',
                quantity: '...',
                value: '...',
                total: '...',
            },
            branches: {
                label: 'Ramal',
                quantity: '...',
                value: '...',
                total: '...',
            },
        }

        total = '...';
    } else {
        const {
            amount_branches,
            amount_telephones,
            qtd_branches,
            qtd_telephones,
            total_amount,
        } = data;

        total = BRLMask(total_amount, 100, 2);

        data = {
            telephones: {
                label: 'Telefone',
                quantity: qtd_telephones,
                value: BRLMask((amount_telephones / qtd_telephones), 100, 2),
                total: BRLMask(amount_telephones, 100, 2),
            },
            branches: {
                label: 'Ramal',
                quantity: qtd_branches,
                value: BRLMask((amount_branches / qtd_branches), 100, 2),
                total: BRLMask(amount_branches, 100, 2),
            },
        }
    }
    
    return (
        <article className={styles.extract}>
            <h2>Extrato</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Valor unitário</th>
                        <th>Valor somatório</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.values(data).map((item, index) => (
                            <tr key={index}>
                                <th>{item.label}</th>
                                <td>{item.quantity}</td>
                                <td>{item.value}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th>Total:</th>
                        <td></td>
                        <td></td>
                        <td>{total}</td>
                    </tr>
                </tfoot>
            </Table>
        </article>
    );
}