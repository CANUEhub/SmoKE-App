import React from 'react';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    '& .MuiTooltip-arrow': {
        color: 'white', // Change the color of the arrow here
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 250,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        textAlign: "center"
    },
}));


export default HtmlTooltip;
