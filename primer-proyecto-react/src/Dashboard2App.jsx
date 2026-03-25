

export const Dashboard2App = ({tipoUsuario}) => {
    switch  (tipoUsuario) {
        case 'Admin':
            return <h1>Bienvenido, Administrador</h1>
        case 'Usuario':
            return <h1>Bienvenido, Usuario</h1>
        case 'Invitado':
            return <h1>Bienvenido, Invitado</h1>
        default:
            return <h1>Tipo de usuario no reconocido</h1>
    }
}
 