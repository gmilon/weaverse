import * as React from 'react'
import {useEffect} from 'react'
import {css} from '../theme'

export const Button = ({color, setColor, style}: any) => {
    useEffect(() => {
        window.addEventListener('message', (event) => {
            console.log(event.data)
            if (event.data.type?.startsWith('HW')) {
                if (event.data.type === 'HW_SET_COLOR') {
                    setColor(event.data.payload)
                }
            }
        })
    }, [])
    let cssClass = css({
        ...style,
        backgroundColor: color
    })()
    return <button className={cssClass}>Test Element</button>
}

Button.defaultProps = {
    style: {
        backgroundColor: 'green',
        borderRadius: '9999px',
        fontSize: '13px',
        padding: '10px 15px'
    },
    type: 'button',
    tag: 'button'
}


export default Button