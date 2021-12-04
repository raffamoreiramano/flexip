import { IoGrid } from 'react-icons/io5';
import { FaWrench, FaDirections, FaDollarSign } from 'react-icons/fa';
import { BsTelephoneFill } from 'react-icons/bs';
import { RiBarChart2Fill } from 'react-icons/ri';

function location({
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

const LOCATIONS = [
    location({
        name: "Dashboard",
        key: "/admin/dashboard",
        icon: IoGrid,
    }),
    location({
        name: "Administração",
        key: "/admin",
        icon: FaWrench,
        nested: [
            location({
                name: "Usuários",
                key: "/admin/usuarios"
            }),
            location({
                name: "Configurações Gerais",
                key: "/admin/configuracoes-gerais"
            }),
        ]
    }),
    location({
        name: "PABX",
        key: "/admin/PABX",
        icon: BsTelephoneFill,
    }),
    location({
        name: "Recepção",
        key: "/admin/recepcao",
        icon: FaDirections,
        nested: [
            location({
                name: "Status de Ramais",
                key: "/admin/recepcao/status-de-ramais",
                disabled: true,
            }),
            location({
                name: "Chamadas Online",
                key: "/admin/recepcao/chamadas-online",
                disabled: true,
            }),
            location({
                name: "Detalhes Fila",
                key: "/admin/recepcao/detalhes-fila",
                disabled: true,
            }),
        ]
    }),
    location({
        name: "Financeiro",
        key: "/admin/financeiro",
        icon: FaDollarSign,
        nested: [
            location({
                name: "Extrato",
                key: "/admin/financeiro/extrato"
            }),
            location({
                name: "Inserir Créditos",
                key: "/admin/financeiro/inserir-creditos"
            }),
        ]
    }),
    location({
        name: "Status",
        key: "/admin/status",
        icon: RiBarChart2Fill,
        disabled: true,
    })
];

export default LOCATIONS;