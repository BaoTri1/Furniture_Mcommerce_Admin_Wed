import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = props => {

    return (
        <div>
            <Dialog
                open={true}
                onClose={props.clickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.clickClose}>Hủy</Button>
                    <Button onClick={props.clickConfirm} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ConfirmDialog
