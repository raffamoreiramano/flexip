import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../store/actions";

import api from "../../../services/api";
import { API_GUARD } from "../../../services/env";

import Extract from "./Extract";
import Credits from "./Credits";

import styles from './styles.module.css';

export default function Finance() {
    const dispatch = useDispatch();

    const initialRender = useRef(true);

    const [fetchedData, setFetchedData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("access_token");

            if (access_token) {
                try {
                    const response = await api.get(`/v1/${API_GUARD}/financial/billing_forecast`, {
                        headers: { Authorization: "Bearer " + access_token }
                    });

                    if (response.status === 200) {
                        const { data } = response.data;
                        const [fetchedData] = data;

                        setFetchedData(fetchedData);
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

    return (
        <main className={styles.main}>
            <Extract data={fetchedData}/>
            <Credits/>
        </main>
    );
}