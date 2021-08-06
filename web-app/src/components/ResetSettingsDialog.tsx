import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";

interface ConfirmResetSettingsDialogProps {
	open: boolean;
	close: () => void;
	handleResetSettings: () => void;
	isLoading: boolean;
}

// TODO test
const ConfirmResetSettingsDialog = ({
	open,
	close,
	handleResetSettings,
	isLoading,
}: ConfirmResetSettingsDialogProps): JSX.Element => {
	return (
		<Dialog
			open={open}
			onClose={close}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{"Reset settings?"}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Resetting your settings will restore all settings to the default
					settings. Are you sure you want to reset your settings?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={close}
					color="primary"
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button
					onClick={handleResetSettings}
					color="primary"
					disabled={isLoading}
				>
					Reset
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmResetSettingsDialog;
