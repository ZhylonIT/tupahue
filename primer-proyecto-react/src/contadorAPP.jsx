import { useState } from "react"

export const ContadorAPP = ({ init }) => {
    const [counter, setCounter] = useState(init)



return (
    <>
        <p>El contador es: {counter}</p>
        <button onClick={() => setCounter(counter => counter += 1)}>
            Agregar boton
        </button>
    </>
)
}
