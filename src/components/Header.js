import React from "react";
import { Grid } from "@mui/material"

import Logon from "../components/Logon"

function Header() {
    return (
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" sx={{ height: "100px", bgcolor: "primary.main" }}>
            <Grid item xs={1}></Grid>
            <Grid item xs={10} sx={{ textAlign: "center", color: 'primary.mainText' }}>
                <h1>SAS Viya Application</h1>
            </Grid>
            <Grid item xs={1} padding={3} >
                <Logon />
            </Grid>
        </Grid>
    )
}

export default Header