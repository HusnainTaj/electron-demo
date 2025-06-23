import type * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';


function TextTip({ children, tip }: { children: React.ReactNode, tip: string })
{
    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {tip}
                </TooltipContent>
            </Tooltip>
        </>
    );
}

export default TextTip;