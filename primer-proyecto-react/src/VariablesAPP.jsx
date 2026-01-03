import './VariablesAPP.css'

const string = 'Esta es una cadena de texto con comillas simples'
const string2 = "Esta es una cadena de texto con comillas dobles"
const string3 = `Esta es una cadena de texto con comillas invertidas`
const num = 1


export const VariablesAPP = () => {
  return (
    <>
      <h1>{string}</h1>
      <h2>{string2}</h2>
      <h3>{string3}</h3>
      <h4>{num}</h4>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor odit praesentium debitis totam dolores
        culpa enim nisi consequuntur, obcaecati nostrum libero eligendi id, modi accusamus veniam optio doloremque quas
        quidem!</p>
    </>
  )
}

