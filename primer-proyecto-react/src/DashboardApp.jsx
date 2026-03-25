const UsuarioLogueado = () => {
    return (
        <div>
            <h1>Bienvenido</h1>
            <p>Usuario logueado con exito</p>

        </div>
    )
}

const UsuarioNoLogueado = () => {
    return (
        <div>
            <h1>Por favor, inicie sesión</h1>
            <p>Debe iniciar sesión para acceder al dashboard</p>
        </div>
    )
}


export const DashboardApp = ({ islogged }) => {
    return (
        <div>
            {islogged ? <UsuarioLogueado /> : <UsuarioNoLogueado />}
        </div>
    )
}
