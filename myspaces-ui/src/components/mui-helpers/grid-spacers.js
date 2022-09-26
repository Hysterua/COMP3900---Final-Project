import React from 'react';
import {Grid} from '@mui/material';

/**
 * @name DesignerMatrixSeparator
 * @description This helper component separates the grid components a particular number of times, n.
 * @param {integer denoting the number of helper rows to generate} 
 * @returns A DesignerMatrixSeparatorComponent
 */
export const DesignerMatrixSeparator = ({n}) => {
    return (
        <React.Fragment>
            {[...Array(n)].map(() => (
                <DesignerRowSeparator />
            ))}
        </React.Fragment>
    );
}

/**
 * @name DesignerRowSeparator
 * @description This helper component separates the grid components used through the page components
 * @returns A DesignerRowSeparator
 */
export const DesignerRowSeparator = () => {
    return <Grid item xs={12}/>;
}

/**
 * @name DesignerColumnSeparator
 * @description This helped component separates grid columns in the pages by a certain amount for required spacing
 * @param {size length as an integer: x/12}
 * @returns A DesignerColumnSeparator
 */
export const DesignerColumnSeparator = ({xs}) => {
    return <Grid item xs={xs}/>
}