import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";

import styles from './styles.module.css';
import Branches from "../Components/Branches";
import Telephones from "../Components/Telephones";

export default function PABX(props) {
    const { match } = props;
    const ID = parseInt(match.params.PABX);

    const dispatch = useDispatch();

    const [PABX, setPABX] = useState(null);

    const initialRender = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { pabx } = response.data;

                        setPABX(pabx);
                    }
                } catch (error) {
                    setPABX('');

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

    const Panel = () => {
        if (initialRender.current) {
            return <p className={styles.nodata}>Carregando. . .</p>
        }
        
        if (PABX) {
            const properties = {
                ...props,
                PABX
            };
            return (
                <>
                    <Branches props={properties}/>
                    <Telephones props={properties}/>
                </>
            );
        }

        return <p className={styles.nodata}>PABX não encontrado!</p>        
    }

    return (
        <main className={styles.main}>
            <Panel/>
        </main>
    );
}