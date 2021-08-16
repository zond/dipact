import {
	makeStyles, Typography,
} from "@material-ui/core";
import { ErrorIcon } from "../icons";


const useStyles = makeStyles((theme) => {
	return {
		root: {
			display: "flex",
			margin: theme.spacing(2),
            justifyContent: "center",
		},
        error: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: theme.palette.error.main,
            gap: theme.spacing(2),
        },
	};
});

const ErrorPage = (): JSX.Element => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
            <div className={classes.error}>
                <ErrorIcon />
                <Typography>
                    Something has gone wrong.
                </Typography>
            </div>
		</div>
	);
};

export default ErrorPage;
