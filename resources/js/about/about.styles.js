export default MaterialUI.makeStyles((theme) => {
	return {
		root: {
			overflowY: 'scroll',
			height: 'calc(100% - 60px)',
		},
		header: {
			textAlign: 'center',
			padding: theme.spacing(2, 0),
		},
		accordionDetails: {
    		flexDirection: 'column',
			'& p:not(:last-child)': {
				marginBottom: theme.spacing(2),
			}
		},
	}
})