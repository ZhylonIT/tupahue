import { 
  Favorite, Handshake, Park, Construction, 
  DirectionsRun, EmojiObjects, Groups, Gavel, Public 
} from '@mui/icons-material';

// 1. Definimos los Senderos (Lobatos, Scouts, Caminantes)
export const SENDEROS = [
  { id: 'salud', nombre: 'Salud y Bienestar', icon: <Favorite />, color: '#E91E63' },
  { id: 'ambiente', nombre: 'Ambiente', icon: <Park />, color: '#4CAF50' },
  { id: 'paz', nombre: 'Paz y Desarrollo', icon: <Handshake />, color: '#2196F3' },
  { id: 'habilidades', nombre: 'Habilidades para la Vida', icon: <Construction />, color: '#FF9800' },
];

// 2. Definimos las Áreas de Crecimiento (Solo para Rovers)
export const AREAS_ROVERS = [
  { id: 'corporalidad', nombre: 'Corporalidad', icon: <DirectionsRun />, color: '#E91E63' },
  { id: 'creatividad', nombre: 'Creatividad', icon: <EmojiObjects />, color: '#FF9800' },
  { id: 'afectividad', nombre: 'Afectividad', icon: <Favorite />, color: '#F44336' },
  { id: 'sociabilidad', nombre: 'Sociabilidad', icon: <Groups />, color: '#2196F3' },
  { id: 'caracter', nombre: 'Carácter', icon: <Gavel />, color: '#795548' },
  { id: 'espiritualidad', nombre: 'Espiritualidad', icon: <Public />, color: '#9C27B0' },
];

export const OBJETIVOS_POR_RAMA = {
  LOBATOS: {
    salud: [
      "Reconozco los cambios que se producen en mi cuerpo y los acepto como parte de mi crecimiento.",
      "Mantengo hábitos de higiene personal y del entorno de forma habitual.",
      "Reconozco y elijo alimentos saludables para mi crecimiento.",
      "Realizo actividades físicas y juegos que me ayudan a mantenerme sano y fuerte.",
      "Identifico situaciones de riesgo en mi entorno y actúo para prevenirlas.",
      "Conozco y aplico técnicas básicas de primeros auxilios ante heridas leves.",
      "Identifico mis emociones y sentimientos.",
      "Identifico y expreso mis emociones y sentimientos de manera adecuada.",
      "Descubro la importancia del descanso y el sueño para mi bienestar.",
      "Reconozco la importancia de la salud mental y emocional para sentirme bien."
    ],
    ambiente: [
      "Reconozco que mis acciones pueden afectar al ambiente y me comprometo a cuidarlo.",
      "Disfruto de las actividades al aire libre y en contacto directo con la naturaleza.",
      "Identifico los principales problemas ambientales de mi comunidad.",
      "Participo en acciones de cuidado, protección y recuperación del ambiente.",
      "Reconozco la biodiversidad de mi región y la importancia de preservarla.",
      "Practico hábitos de consumo responsable y reducción de residuos.",
      "Conozco y valoro la importancia del agua y la energía para la vida.",
      "Identifico elementos naturales y sus ciclos en el entorno donde vivo."
    ],
    paz: [
      "Respeto las normas de convivencia construidas en la Manada.",
      "Identifico situaciones de injusticia y actúo de forma solidaria.",
      "Reconozco y valoro la diversidad cultural y personal como una riqueza.",
      "Utilizo el diálogo para resolver conflictos con mis amigos y amigas.",
      "Participo activamente en proyectos de servicio a la comunidad.",
      "Conozco mis derechos y mis responsabilidades como niño/a y ciudadano/a.",
      "Exploro mi dimensión espiritual y respeto las creencias de las demás personas.",
      "Descubro el sentido de la oración o la reflexión personal en mi vida."
    ],
    habilidades: [
      "Desarrollo mi creatividad a través de diferentes expresiones artísticas y manuales.",
      "Utilizo herramientas y materiales de forma segura para realizar tareas.",
      "Aprendo nuevas habilidades que me permiten ser más autónomo/a.",
      "Uso la tecnología de manera responsable y segura para aprender y jugar.",
      "Busco información de forma crítica sobre temas que me interesan.",
      "Me propongo metas personales y me esfuerzo por alcanzarlas.",
      "Expreso mis ideas y opiniones con claridad y respeto.",
      "Trabajo en equipo de forma colaborativa dentro de mi seisena."
    ]
  },
  SCOUTS: {
    salud: [
      "Asumo la responsabilidad de mi propio desarrollo físico y el cuidado de mi salud.",
      "Conozco los procesos biológicos que ocurren en mi cuerpo y los acepto con naturalidad.",
      "Mantengo hábitos de higiene personal y del entorno.",
      "Elijo una alimentación equilibrada que responda a mis necesidades energéticas.",
      "Desarrollo mis capacidades físicas a través del deporte, la recreación y la vida al aire libre.",
      "Identifico situaciones de riesgo y actúo de forma responsable para prevenirlas.",
      "Conozco y aplico técnicas de primeros auxilios.",
      "Identifico y expreso mis sentimientos, emociones y necesidades de manera asertiva.",
      "Reconozco la importancia del descanso y el tiempo libre para mi equilibrio personal.",
      "Valoro mi cuerpo y el de los demás, respetando las diferencias."
    ],
    ambiente: [
      "Me comprometo con el cuidado, protección y recuperación del ambiente.",
      "Disfruto de la vida en contacto directo con la naturaleza, respetando sus ritmos y ciclos.",
      "Identifico los problemas ambientales y sus causas a nivel local y global.",
      "Participo en acciones de conservación de la biodiversidad.",
      "Practico hábitos de consumo responsable y sustentable.",
      "Valoro la importancia del agua y la energía y actúo para su uso racional.",
      "Reconozco el impacto de mis acciones en el ambiente y actúo para minimizarlo.",
      "Promuevo en mi entorno prácticas amigables con la naturaleza."
    ],
    paz: [
      "Construyo y respeto normas de convivencia basadas en el diálogo y la democracia.",
      "Actúo de manera solidaria ante situaciones de injusticia o exclusión.",
      "Valoro la diversidad cultural, social y personal como una oportunidad de aprendizaje.",
      "Resuelvo los conflictos de manera pacífica mediante la escucha y el entendimiento.",
      "Participo en proyectos de servicio que beneficien a mi comunidad.",
      "Conozco y ejerzo mis derechos y responsabilidades como ciudadano/a.",
      "Exploro mi dimensión espiritual y respeto las diversas manifestaciones de fe.",
      "Busco momentos de reflexión y encuentro personal en mi vida cotidiana."
    ],
    habilidades: [
      "Expreso mi creatividad mediante el uso de diferentes lenguajes y técnicas.",
      "Utilizo herramientas, materiales y tecnologías de forma segura y eficiente.",
      "Desarrollo habilidades técnicas que me permiten ganar autonomía.",
      "Uso las tecnologías de la información y comunicación de forma crítica y responsable.",
      "Busco, selecciono y evalúo información de diversas fuentes.",
      "Me planteo objetivos personales y diseño planes para alcanzarlos.",
      "Comunico mis ideas y opiniones de forma clara, fundamentada y respetuosa.",
      "Participo en el trabajo en equipo asumiendo diferentes roles con responsabilidad."
    ]
  },
  CAMINANTES: {
    salud: [
      "Asumo la responsabilidad del cuidado integral de mi salud (física, mental y emocional).",
      "Acepto mi cuerpo y los cambios propios de mi etapa de desarrollo.",
      "Mantengo hábitos de higiene, alimentación y actividad física que favorecen mi bienestar.",
      "Identifico situaciones de riesgo y actúo con autonomía para prevenirlas.",
      "Conozco y aplico técnicas de primeros auxilios y prevención de accidentes.",
      "Gestiono mis emociones y sentimientos de manera equilibrada y asertiva.",
      "Valoro la importancia de la salud mental y busco espacios de contención si lo necesito.",
      "Respeto mi cuerpo y el de los demás, rechazando cualquier forma de violencia o discriminación."
    ],
    ambiente: [
      "Actúo como agente de cambio en el cuidado y la regeneración del ambiente.",
      "Convivo armónicamente con la naturaleza, valorando su importancia para la vida.",
      "Analizo críticamente los problemas ambientales y propongo acciones de mitigación.",
      "Promuevo la conservación de la biodiversidad y el patrimonio natural.",
      "Adopto un estilo de vida sustentable basado en el consumo responsable.",
      "Uso racionalmente los recursos naturales y promuevo su cuidado en la comunidad.",
      "Participo en proyectos socio-ambientales que transformen mi realidad local.",
      "Comprendo la interconexión entre el ambiente, la sociedad y la economía."
    ],
    paz: [
      "Construyo vínculos basados en la cultura de la paz, la justicia y la equidad.",
      "Denuncio situaciones de injusticia y me comprometo con acciones solidarias.",
      "Celebro la diversidad y promuevo la inclusión en todos los ámbitos.",
      "Utilizo el diálogo y la mediación como herramientas para la resolución de conflictos.",
      "Lidero y participo en proyectos de servicio que impacten positivamente en la sociedad.",
      "Ejerzo mi ciudadanía de manera activa, crítica y responsable.",
      "Profundizo en mi búsqueda espiritual respetando la libertad de creencias.",
      "Encuentro en la reflexión y el silencio espacios para mi crecimiento interior."
    ],
    habilidades: [
      "Desarrollo mi potencial creativo para dar respuestas originales a los desafíos.",
      "Manejo herramientas y tecnologías con destreza y sentido ético.",
      "Adquiero competencias técnicas y profesionales que faciliten mi proyecto de vida.",
      "Interactúo en los entornos digitales de manera segura, crítica y constructiva.",
      "Evalúo la veracidad y el origen de la información que recibo.",
      "Gestiono mis proyectos personales y colectivos con compromiso y perseverancia.",
      "Expreso mis puntos de vista con argumentos sólidos y respeto por la opinión ajena.",
      "Lidero y colaboro en equipos de trabajo de forma democrática y eficiente."
    ]
  },
  ROVERS: {
    corporalidad: [
      "Asumo el cuidado de mi cuerpo como una responsabilidad personal y social.",
      "Acepto mi imagen corporal y busco el equilibrio físico y mental.",
      "Mantengo hábitos de vida saludable de manera autónoma y constante."
    ],
    creatividad: [
      "Uso mi creatividad para transformar la realidad y resolver problemas complejos.",
      "Aplico mis conocimientos técnicos o profesionales en mis proyectos y acciones.",
      "Mantengo una actitud de aprendizaje continuo y búsqueda de la verdad."
    ],
    afectividad: [
      "Logro un equilibrio emocional que me permite construir vínculos sanos y profundos.",
      "Integro mi sexualidad de manera responsable en mi proyecto de vida.",
      "Actúo con resiliencia y madurez ante las dificultades y los fracasos."
    ],
    sociabilidad: [
      "Ejerzo mi ciudadanía de manera comprometida con la democracia y el bien común.",
      "Promuevo la justicia social y los Derechos Humanos en mis ámbitos de acción.",
      "Lidero proyectos de servicio solidario con impacto transformador en la comunidad."
    ],
    caracter: [
      "Construyo mi identidad basándome en los valores de la Ley y la Promesa.",
      "Actúo con autonomía, coherencia y responsabilidad en todas mis decisiones.",
      "Diseño y gestiono mi proyecto de vida con esperanza y perseverancia."
    ],
    espiritualidad: [
      "Vivo mi fe o búsqueda trascendente de manera coherente y comprometida.",
      "Participo de mi comunidad religiosa o espacios de espiritualidad con apertura.",
      "Testimonio mis convicciones respetando la libertad de conciencia de los demás."
    ]
  }
};