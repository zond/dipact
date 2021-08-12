import {
	CircularProgress,
	makeStyles,
} from "@material-ui/core";


const useStyles = makeStyles((theme) => {
	return {
		root: {
			display: "flex",
			margin: theme.spacing(2),
            justifyContent: "center",
		},
	};
});

const Loading = (): JSX.Element => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<CircularProgress />
		</div>
	);
};

export default Loading;
