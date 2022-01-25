import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setIsLoading } from "../../../../store/actions";

import api from "../../../../services/api";
import { API_GUARD } from "../../../../services/env";

import Alert from "../../../../components/Modals/Alert";

import UserList from "./List";
import UserForm from "./Form";

import styles from './styles.module.css';

export default function UserSettings() {
    const dispatch = useDispatch();

    const [isAlertActive, setIsAlertActive] = useState(false);
    const [alertContent, setAlertContent] = useState({
        title: "Ops!",
        message: "Parece que houve um erro... Por favor, tente mais tarde!"
    });
    const success = useRef(false);

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState({
        type: 'add',
        payload: {}
    });

    const [users, setUsers] = useState(null);
    const [pages, setPages] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const usersToPages = () => {
            const USERS = [...users];
            const rows = 10;
            const total = Math.max(Math.floor(USERS.length / rows), 1);
            let pages = [];
            
            for (let i = total; i >= 0; i--) {
                const slice = USERS.splice(0, rows);

                if (slice.length > 0) {
                    pages.push(slice);
                }
            }

            setPages(pages);
            setCurrent(0);
        }

        if (!initialRender.current) {
            usersToPages();
        }
        
    }, [users]);
    
    const initialRender = useRef(true);

    const fetchData = async () => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            try {
                const response = await api.get(`/v1/${API_GUARD}/user`, {
                    headers: { Authorization: "Bearer " + access_token }
                });

                if (response.status === 200) {
                    const { users } = response.data;

                    setUsers(users);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            dispatch(setIsLoading(true));

            fetchData().finally(() => {
                dispatch(setIsLoading(false));
            });
        }
    });

    const refresh = () => {
        dispatch(setIsLoading(true));

        fetchData().finally(() => {
            setOpen(false);

            dispatch(setIsLoading(false));
        });
    }

    const showAlert = (content, response = false) => {
        success.current = response;

        setAlertContent(content);
        setIsAlertActive(true);
    }

    const navigate = (page) => {
        setCurrent(page);
    }

    const add = () => {
        setAction({
            type: 'add',
            payload: {},
        });
        
        setOpen(true);
    }

    const edit = (user) => {
        setAction({
            type: 'edit',
            payload: user,
        });

        setOpen(true);
    }

    const remove = async (user) => {
        dispatch(setIsLoading(true));

        try {
            const access_token = localStorage.getItem("access_token");
            const response = await api.delete(`/v1/${API_GUARD}/user/${user.id}`, {
                headers: { Authorization: "Bearer " + access_token }
            });

            if (response.status && response.status === 200) {
                const content = { 
                    title: "Pronto...", 
                    message: `O usuário "${user.name}" foi excluído com sucesso!`
                };

                showAlert(content, true);
            }
        } catch (error) {
            let content = {
                title: "Ops!",
                message: "Parece que houve um erro... Por favor, tente mais tarde!",
            }            
            
            if (error.response) {
                const { title, message } = error.response.data;

                content = {
                    title: title || content.title,
                    message: message || content.message,
                }

                console.log(error.response.data);
            }

            showAlert(content);
        } finally {
            dispatch(setIsLoading(false));
        }
    }

    const Form = () => {
        const addProps = {
            refresh,
        }

        const editProps = {
            ...addProps,
            user: action.payload,
        }

        switch (action.type) {
            case "edit": return <UserForm props={editProps} />
            default: return <UserForm props={addProps} />
        }
    }

    return (
        <main className={styles.main}>
            <UserList
                users={users}
                add={add}
                edit={edit}
                remove={remove}
                navigate={navigate}
                pages={pages}
                current={current}
                open={open}
            />
            { open && Form() }
            <Alert
                title={alertContent.title}
                message={alertContent.message}
                state={[isAlertActive, setIsAlertActive]}
                onClose={() => {
                    if (success.current) {
                        refresh();
                    }
                }}
            />
        </main>
    );
}