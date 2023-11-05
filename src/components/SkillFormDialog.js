import React from 'react'
import { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { skillTypeList } from '../config/skill-type-list';
import MenuItem from '@mui/material/MenuItem';

function SkillFormDialog(props) {

    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit } = useForm();

    const onSkillSubmit = (data) => {
        console.log(data);
        props.create(data);
        handleClose();
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        props.setTrigger(false);
    };

    useEffect(() => {
        if (props.trigger) {
            handleClickOpen();
        }
    }, [props.trigger]);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                component="form"
                onSubmit={handleSubmit(onSkillSubmit)}
            >
                <DialogTitle id="alert-dialog-title">
                    Add Skill
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please enter the skill information
                    </DialogContentText>
                    <TextField
                        sx={{ margin: 2 }}
                        autoFocus
                        required
                        id="skillName"
                        label="Skill Name"
                        type="text"
                        variant="standard"
                        {...register("skillName")}
                    />
                    <TextField
                        sx={{ margin: 2, width: 200 }}
                        margin="dense"
                        id="skillType"
                        label="Skill Type"
                        select
                        size='small'
                        variant="filled"
                        {...register("skillType")}
                    >{skillTypeList.map((type) => (
                        <MenuItem key={type.label} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        color='success'
                        type='submit'>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SkillFormDialog