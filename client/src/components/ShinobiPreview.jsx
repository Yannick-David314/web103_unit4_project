import React, { useId } from 'react'
import { findOption } from '../../../shared/shinobiOptions.js'
import '../css/ShinobiPreview.css'

const eyeColors = {
    Sharingan: '#e3132b',
    Byakugan: '#e9e4ff'
}

// A drawn shinobi whose aura glows in the chakra nature's color, with the
// village symbol on the forehead protector. Sharingan and Byakugan also change the eyes.
const ShinobiPreview = ({ shinobi, size = 'large' }) => {
    // Each preview needs its own filter id, since the list page shows many at once
    const blurId = `aura-blur-${useId().replace(/:/g, '')}`

    const auraColor = findOption('chakra_nature', shinobi.chakra_nature)?.color ?? '#888888'
    const symbol = findOption('village', shinobi.village)?.symbol ?? ''
    const eyeColor = eyeColors[shinobi.kekkei_genkai] ?? '#9aa3b5'
    const glowingEyes = Boolean(eyeColors[shinobi.kekkei_genkai])

    return (
        <div className={`shinobi-preview shinobi-preview-${size}`} style={{ '--aura': auraColor }}>
            <svg viewBox='0 0 200 260' role='img' aria-label={`${shinobi.chakra_nature} chakra shinobi of the Hidden ${shinobi.village}`}>
                <defs>
                    <filter id={blurId} x='-50%' y='-50%' width='200%' height='200%'>
                        <feGaussianBlur stdDeviation='14' />
                    </filter>
                </defs>

                <ellipse className='aura' cx='100' cy='145' rx='80' ry='110' fill={auraColor} filter={`url(#${blurId})`} />

                {/* body, neck, head and hair */}
                <path d='M48 260 L56 165 Q60 130 100 124 Q140 130 144 165 L152 260 Z' className='silhouette' />
                <rect x='88' y='98' width='24' height='30' className='silhouette' />
                <circle cx='100' cy='74' r='34' className='silhouette' />
                <path d='M66 72 L58 36 L78 50 L84 22 L98 44 L110 18 L118 46 L138 28 L134 56 L148 50 L134 74 Z' className='silhouette' />

                {/* forehead protector: cloth, trailing tails, metal plate with village symbol */}
                <rect x='63' y='56' width='74' height='16' rx='3' className='headband-cloth' />
                <path d='M66 61 L40 80 L46 86 L68 70 Z' className='headband-cloth' />
                <rect x='79' y='53' width='42' height='22' rx='3' className='headband-plate' />
                <text x='100' y='69.5' textAnchor='middle' className='headband-symbol'>{symbol}</text>

                {/* eyes */}
                <g className={glowingEyes ? 'eyes eyes-glow' : 'eyes'} fill={eyeColor} style={{ '--eye': eyeColor }}>
                    <ellipse cx='88' cy='85' rx='5.5' ry='3' />
                    <ellipse cx='112' cy='85' rx='5.5' ry='3' />
                </g>
            </svg>
        </div>
    )
}

export default ShinobiPreview
