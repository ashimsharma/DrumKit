import { TypeAnimation as Animation } from 'react-type-animation';

export default function TypeAnimation({textSequence}){
    const CURSOR_CLASS_NAME = 'custom-type-animation-cursor';

    textSequence.push((el) => {
        el.className = '';
    })
    
    return <Animation
      sequence={textSequence}
      wrapper="span"
      className={CURSOR_CLASS_NAME}
      speed={30}
      style={{display: 'block', fontSize: '2rem'}}
    />
}