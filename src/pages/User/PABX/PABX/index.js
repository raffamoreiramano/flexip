import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";

import styles from './styles.module.css';
import Branches from "../Components/Branches";
import Telephones from "../Components/Telephones";
import Departments from "../Components/Departments";
import InputRoutes from "../Components/InputRoutes";
import Audios from "../Components/Audios";
import URAs from "../Components/URAs";
import Queues from "../Components/Queues";
import Report from "../Components/Report";

export default function PABX(props) {
    const { match } = props;
    const ID = parseInt(match.params.PABX);

    const dispatch = useDispatch();

    const [PABX, setPABX] = useState(null);

    const initialRender = useRef(true);

    const fetchPABX = async () => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            dispatch(setIsLoading(true));

            try {
                const response = await api.get(`/v1/${API_GUARD}/pabx/${ID}`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { pabx } = response.data;
                    
                    if (!pabx.telephone_main) {
                        pabx.telephone_main = pabx.telephone || {ddd: "000", number: "000000000"};
                    }

                    setPABX(pabx);
                }
            } catch (error) {
                setPABX(null);

                console.log(error);
            } finally {
                dispatch(setIsLoading(false));
            }
        }
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;

            fetchPABX();
        }
    });

    const Panel = () => {
        if (initialRender.current) {
            return <p className={styles.nodata}>Carregando. . .</p>
        }
        
        if (PABX) {
            const properties = {
                ...props,
                PABX,
                fetchPABX,
            };

            return (
                <>
                    <Branches props={properties}/>
                    <Telephones props={properties}/>
                    <Departments props={properties}/>
                    <InputRoutes props={properties}/>
                    <Audios props={properties}/>
                    <URAs props={properties}/>
                    <Queues props={properties}/>
                    <Report props={properties}/>
                </>
            );
        }

        return <p className={styles.nodata}>PABX não encontrado!</p>        
    }

    return (
        <main className={styles.main}>
            { Panel() }
        </main>
    );
}