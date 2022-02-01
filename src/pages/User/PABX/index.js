import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import { phoneMask } from '../../../services/helpers';

import styles from './styles.module.css';

export default function PABXList({ history }) {
    const dispatch = useDispatch();

    const [list, setList] = useState([]);

    const initialRender = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { pabxList } = response.data;

                        setList(pabxList);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (initialRender.current) {
            initialRender.current = false;
            dispatch(setIsLoading(true));

            fetchData().finally(() => {
                dispatch(setIsLoading(false));
            });
        }
    });

    const List = () => {
        const [filteredList, setFilteredList] = useState(list);

        if (initialRender.current) {
            return <p className={styles.nodata}>Carregando. . .</p>
        }
        
        if (list.length === 0) {
            return <p className={styles.nodata}>Nenhum PABX encontrado!</p>
        }

        const onSearch = (event) => {
            const search = event.target.value.toLocaleLowerCase();
            const digits = search.replace(/\D/g, "");
    
            if (search.length > 0) {
                const filtered = list.filter(pabx => {
                    if (pabx.name.match(search)) {
                        return pabx;
                    }
                    
                    if (pabx.code.toString().match(search)) {
                        return pabx;
                    }
                    
                    if (pabx.company.name.match(search)) {
                        return pabx;
                    }
                    
                    if (pabx.company.code.toString().match(search)) {
                        return pabx;
                    }
                    
                    if (digits.length > 0 && (pabx.telephone.ddd + pabx.telephone.number).match(digits)) {
                        return pabx;
                    }
        
                    if (search === "bloqueado" && !!pabx.blocked) {
                        return pabx;
                    }
        
                    if (search === "desbloqueado" && !!!pabx.blocked) {
                        return pabx;
                    }
        
                    return false;
                });
        
                setFilteredList(filtered);
            } else if (filteredList !== list) {
                setFilteredList(list);
            }
        }

        return (
            <>
                <div className={styles.search}>
                    <label htmlFor="search">Pesquisar</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Nome, empresa, código, telefone ou status..."
                        title="Pesquisa por nome, código, telefone ou status do PABX ou por nome ou código da empresa..."
                        onChange={onSearch}
                    />
                </div>
                {
                    filteredList.length > 0
                    ? <ul className={styles.list}>
                        {
                            filteredList.map((pabx, index) => (
                                <li key={index}>
                                    <article
                                        className={`${styles.pabx} glass`}
                                        onClick={() => {
                                            history.push(`/admin/PABX/${pabx.id}`);
                                        }}
                                    >
                                        <h3>{pabx.name}</h3>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Empresa:</th>
                                                    <td>{pabx.company.name} ({pabx.company.code})</td>
                                                </tr>
                                            </tbody>
                                            <tbody className={styles.mainData}>
                                                <tr>
                                                    <th>Número padrão:</th>
                                                    <td>{phoneMask(pabx.telephone_main.ddd + pabx.telephone_main.number)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Ramais contratados:</th>
                                                    <td>{pabx.max_branches}</td>
                                                </tr>
                                                <tr>
                                                    <th>Ramais em uso:</th>
                                                    <td>{pabx.branches_in_use}</td>
                                                </tr>
                                            </tbody>
                                            <tbody>
                                                <tr>
                                                    <th>Status:</th>
                                                    <td>{!!pabx.blocked ? "Bloqueado" : "Desbloqueado"}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </article>
                                </li>
                            ))
                        }
                    </ul>
                    : <p className={styles.nodata}>. . .</p>
                }
            </>
        );
    }

    return (
        <main className={styles.main}>
            <List />
        </main>
    );
}