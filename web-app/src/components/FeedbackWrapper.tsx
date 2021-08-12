import React from "react";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useFeedback } from "../hooks/selectors";
import { useAppDispatch } from "../hooks/store";
import { actions } from "../store/feedback";

interface FeedbackWrapperProps {
	children: React.ReactNode;
}

// TODO test
const FeedbackWrapper = ({ children }: FeedbackWrapperProps): JSX.Element => {
	const feedback = useFeedback();
	const dispatch = useAppDispatch();
	const onClose = (id: number) => dispatch(actions.clear(id));

	return (
		<>
			{children}
			{feedback.map((fb) => (
				<Snackbar
					key={fb.id}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					open={true}
					onClose={() => onClose(fb.id)}
				>
					<Alert onClose={() => onClose(fb.id)} severity={fb.severity}>
						{fb.message}
					</Alert>
				</Snackbar>
			))}
		</>
	);
};

export default FeedbackWrapper;
