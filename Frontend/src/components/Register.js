import { Button, makeStyles, TextField } from '@material-ui/core'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

var today = new Date();

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    box1: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    box2: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 10
    },
    box3: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        minHeight: 530,
        height: "fit-content",
        minWidth: 500,
        width: 200,
        justifyContent: "center",
        border: "2px solid black",
        margin: "0 auto 0 auto",

    },
    cnt: {
        display: "flex",
        justifyContent: "flex-end",
    }
}));

function Register() {

    const classes = useStyles();

    const initialState = { name: "", email: "", phone_no: "", no_of_rooms: "", check_in_date: React.useState(new Date(today)), check_out_date: React.useState(new Date(today)) };
    const [formValue, setformValue] = useState(initialState);

    const [formErrors, setFormErrors] = useState({ name: "", email: "", phone_no: "", no_of_rooms: "", check_in_date: "", check_out_date: "" });

    let [countRegistration, setCountRegistration] = useState(5);

    const [clickcheck, setClickcheck] = useState({first:false,second:false});

    const handleChange = (event) => {

        const { name, value } = event.target;
        setformValue({ ...formValue, [name]: value });
    };
    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.name) {
            errors.name = "Name is required!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.phone_no) {
            errors.phone_no = "Phone No is required!";
        } else if (values.phone_no.length !== 10) {
            errors.phone_no = "Phone no must be of 10 numbers";
        } else {
            let flag = false;
            for (let i = 0; i < values.phone_no.length; i++) {
                let text = values.phone_no[i];
                let code = text.charCodeAt(0);
                if (code > 57 || code < 48) {
                    flag = true;
                    break;
                }
            }
            if (flag)
                errors.phone_no = "Phone no must contain Only Numbers";
        }
        if (!values.no_of_rooms) {
            errors.no_of_rooms = "No of Rooms is required and must contain only Numbers";
        }
        else if (values.no_of_rooms < 1 || values.no_of_rooms > 100) {
            errors.no_of_rooms = "No of Rooms must be between 1 and 100";
        }
        if (!clickcheck.first) {
            errors.check_in_date = "Please Enter a Date";
        }
        if (!clickcheck.second) {
            errors.check_out_date = "Please Enter a Date";
        }
        return (errors);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setFormErrors(validate(formValue));
    }



    const handleData = () => {
        if (today.getHours() === 0 && today.getMinutes() === 0) {
            setCountRegistration(5);
        }
        else if (countRegistration <= 0) {
            setCountRegistration(0);
        }
        else {
            axios.post("http://localhost:5000/register", formValue)
                .then(res => {
                    if (res.data.message === "User already registerd") {
                        setFormErrors({ email: "Email Already exists try a different one" });
                    }
                    else {
                        setCountRegistration(countRegistration - 1);
                        setFormErrors({ email: "" });
                    }
                })
        }



    }

    useEffect(() => {
        if (formErrors.name === undefined && formErrors.email === undefined && formErrors.phone_no === undefined
            && formErrors.no_of_rooms === undefined && formErrors.check_in_date===undefined && formErrors.check_out_date===undefined) {
            handleData();
        }
    }, [formErrors])

    const [selectedDate1, setSelectedDate1] = React.useState(new Date(today));
    const [selectedDate2, setSelectedDate2] = React.useState(new Date(today));

    const handleDateChange1 = (date) => {
        setSelectedDate1(date);
        formValue.check_in_date=date;
        clickcheck.first=true;
    };
    const handleDateChange2 = (date) => {
        setSelectedDate2(date);
        formValue.check_out_date=date;
        clickcheck.second=true;
    };

    return (
        <>
            <div className={classes.cnt}>
                {(countRegistration > 0) ?
                    (<h3 style={{ margin: 30 }}>Number of registration left {countRegistration}</h3>) :
                    (<h3 style={{ margin: 30 }}>Registration Closed Try again Next Day</h3>)

                }

            </div>
            <div className={classes.box3}>
                <div className={classes.box1}>
                    <form className={classes.root} noValidate autoComplete="off">
                        <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.email}</span><div style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center" }}><TextField id="outlined-basic" label="Enter Email" variant="outlined" onChange={handleChange} name="email" /></div>
                        <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.name}</span><div style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center" }}><TextField id="outlined-basic" label="Enter Name" variant="outlined" name="name" onChange={handleChange} /></div>
                        <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.phone_no}</span><div style={{ margin: 0, padding: 0, display: "flex", justifyContent: "center" }}><TextField id="outlined-basic" label="Enter Phone Number" variant="outlined" name="phone_no" onChange={handleChange} /></div>
                        <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.no_of_rooms}</span><div style={{ display: "flex", justifyContent: "center" }}><TextField id="outlined-basic" label="Enter No of Rooms" variant="outlined" name="no_of_rooms" onChange={handleChange} /></div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.check_in_date}</span><div style={{ display: "flex", justifyContent: "center" }}>
                                <Grid container justifyContent="space-around">
                                    <KeyboardDatePicker

                                        id="date-picker-dialog"
                                        label="Check In Date"
                                        format="MM/dd/yyyy"
                                        value={selectedDate1}
                                        onChange={handleDateChange1}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </div>
                            <span style={{ color: "red", margin: 0, padding: 0, display: 'flex', justifyContent: "center" }}>{formErrors.check_out_date}</span><div style={{ display: "flex", justifyContent: "center" }}>

                                <Grid container justifyContent="space-around">
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Check Out Date"
                                        format="MM/dd/yyyy"
                                        value={selectedDate2}
                                        onChange={handleDateChange2}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </div>
                        </MuiPickersUtilsProvider>

                    </form>

                </div>
                <div className={classes.box2}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>

        </>
    )
}


export default Register