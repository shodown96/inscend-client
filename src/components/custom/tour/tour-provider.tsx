
"use client"

import { TourProvider } from '@reactour/tour'
import { type PropsWithChildren } from 'react'
import TourCardContent from './tour-card-content'


export function Close({  }: { onClick?: () => void }) {
    return null
    // return (
    //     <div>
    //         <div className='flex justify-end h-4'></div>
    //         <X className="h-5 w-5 cursor-pointer absolute top-5 right-5" onClick={onClick} />
    //     </div>
    // )
}

function CustomTourProvider({ children }: PropsWithChildren) {
    return (
        <TourProvider steps={[]}
            showDots={false}
            showNavigation={false}
            showBadge={false}
            onClickMask={() => { }}
            components={{ Close, Content: TourCardContent }}
            padding={{
                popover: [-5, 10],
            }}
            styles={{
                popover: (base) => ({
                    ...base,
                    '--reactour-accent': '#ef5a3d',
                    borderRadius: "0.5rem",
                    // margin:20
                    padding: 20
                }),
            }}>
            {children}
        </TourProvider>
    )
}

export default CustomTourProvider