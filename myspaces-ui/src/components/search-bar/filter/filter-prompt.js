import React from 'react';

import {Dialog, DialogContent, DialogTitle, Button, Grid, Typography, TextField} from '@mui/material';
import { DesignerColumnSeparator, DesignerRowSeparator } from '../../mui-helpers/grid-spacers';
import {Calendar} from '../../calendar/calendar';

const Filter = ({title, value, setValue}) => {
    return (
        <>
            <DesignerColumnSeparator xs={1} />
            <Grid item container xs={10} >
                
                <Grid item xs={4} >
                    <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                        {title}                           
                    </Typography>
                </Grid>
                
                <Grid item xs={8} >
                    <TextField 
                        defaultValue={value}
                        label={title} 
                        variant="outlined" 
                        type="number"
                        onChange={(event) => {setValue(event.target.value)}}
                    />
                </Grid>
                
            </Grid>
            <DesignerColumnSeparator xs={1} />
        </>
    );
}

export const FilterPrompt = ({context, display, setDisplay, handleSearch}) => {

    return (
        <Dialog open={display}>
            <DialogTitle>
                <Typography variant="h6" align={'center'} sx={{fontWeight: 'bold',}}>
                    {'Add Filters'}                           
                </Typography>
            </DialogTitle>
            <DialogContent>
            
                <Grid container rowSpacing={1}>
                


                    <DesignerRowSeparator />
                    <Filter title={"Max Cost /hr"} value={context.costFilter} setValue={context.setCostFilter}/>
                    <Filter title={"Length"} value={context.lengthFilter} setValue={context.setLengthFilter} />
                    <Filter title={"Width"} value={context.widthFilter} setValue={context.setWidthFilter} />
                    <Filter title={"Height"} value={context.heightFilter} setValue={context.setHeightFilter} />
                    
                </Grid>
            
                <Button 
                    variant="container" 
                    sx={{backgroundColor: '#2196f3', color: '#ffffff'}}
                    onClick={() => {
                        handleSearch();
                        setDisplay(false);   
                    }}>
                    SEARCH
                </Button>
                <Button 
                    variant="container" 
                    onClick={() => {
                        setDisplay(false);   
                    }}>
                    BACK
                </Button>
            </DialogContent>
        </Dialog>
    );
}