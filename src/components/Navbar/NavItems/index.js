import React from 'react';

import { IoGrid } from 'react-icons/io5';
import { FaWrench, FaDirections, FaDollarSign } from 'react-icons/fa';
import { BsTelephoneFill } from 'react-icons/bs';
import { RiBarChart2Fill } from 'react-icons/ri';

function navItem({
    icon,
    name = "", 
    key = "", 
    disabled = false, 
    nested 
}) {
    let obj = {
        name,
        key,
        disabled,
    };

    if (icon) {
        obj.icon = icon;
    }

    if (nested) {
        obj.nested = nested;
    }

    return obj;
}

const NavItems = [
    navItem({
        name: "Home",
        key: "/admin/dashboard",
        icon: IoGrid,
    }),
    navItem({
        name: "Administração",
        key: "/admin",
        icon: FaWrench,
        nested: [
            navItem({
                name: "Usuários",
                key: "/admin/usuarios"
            }),
            navItem({
                name: "Configurações Gerais",
                key: "/admin/configuracoes-gerais"
            }),
        ]
    }),
    navItem({
        name: "PABX",
        key: "/admin/PABX",
        icon: BsTelephoneFill,
    }),
    navItem({
        name: "Recepção",
        key: "/admin/recepcao",
        icon: FaDirections,
        nested: [
            navItem({
                name: "Status de Ramais",
                key: "/admin/recepcao/status-de-ramais",
                disabled: true,
            }),
            navItem({
                name: "Chamadas Online",
                key: "/admin/recepcao/chamadas-online",
                disabled: true,
            }),
            navItem({
                name: "Detalhes Fila",
                key: "/admin/recepcao/detalhes-fila",
                disabled: true,
            }),
        ]
    }),
    navItem({
        name: "Financeiro",
        key: "/admin/financeiro",
        icon: FaDollarSign,
        nested: [
            navItem({
                name: "Extrato",
                key: "/admin/financeiro/extrato"
            }),
            navItem({
                name: "Inserir Créditos",
                key: "/admin/financeiro/inserir-creditos"
            }),
        ]
    }),
    navItem({
        name: "Status",
        key: "/admin/status",
        icon: RiBarChart2Fill,
        disabled: true,
    })
];

export default NavItems;